import React, { useState, useCallback, useEffect } from "react";
import { View, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Appbar } from "react-native-paper";
import { RFValue } from "react-native-responsive-fontsize";
import { backgroundColor } from "@/common/styles/color";

import MemberSearchInput from "./_components/MemberSearchInput";
import SelectableMemberList from "./_components/SelectableMemberList";
import BottomInviteButton from "./_components/BottomInviteButton";
import SelectedMemberChips from "./_components/SelectedMemberChips";

import { useSearchMembersQuery } from "@/domain/members/hooks/queries/memberQueries";
import { useRoomMembersQuery } from "@/domain/rooms/hooks/queries/useRoomQueries";
import { useInviteRoomMemberV2Mutation } from "@/domain/invitations/hooks/mutations/useInvitationMutations";
import type { MemberSearchResult } from "@/domain/members/types/response/searchMembersResponse";

export default function InviteMembersScreen(): React.ReactElement {
  const router = useRouter();
  const params = useLocalSearchParams();
  const roomId = Number(params.id);

  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<MemberSearchResult[]>([]);

  // 회원 검색 쿼리 (검색 버튼 클릭 시에만)
  const {
    data: searchResults = [],
    isLoading: isSearching,
    refetch: refetchSearch,
  } = useSearchMembersQuery(searchQuery, { enabled: searchQuery.length > 0 });

  // 방 멤버 목록 조회
  const {
    data: roomMembers = [],
    isLoading: isMembersLoading,
    refetch: refetchMembers,
  } = useRoomMembersQuery(roomId);

  // 방 초대 mutation (v2)
  const { mutate: inviteMembers, isPending } =
    useInviteRoomMemberV2Mutation();

  // 방 멤버들의 ID 추출
  const roomMemberIds = roomMembers
    .map((member) => member.id)
    .filter((id): id is number => id !== null);

  // 검색 실행
  const handleSearch = useCallback(() => {
    if (searchInput.trim().length > 0) {
      setSearchQuery(searchInput.trim());
    }
  }, [searchInput]);

  // 회원 선택/해제
  const handleToggleMember = useCallback(
    (memberId: number) => {
      const member = searchResults.find((m) => m.id === memberId);
      if (!member) return;

      setSelectedMembers((prev) => {
        const isSelected = prev.some((m) => m.id === memberId);
        if (isSelected) {
          return prev.filter((m) => m.id !== memberId);
        } else {
          return [...prev, member];
        }
      });
    },
    [searchResults]
  );

  // 선택된 회원 제거
  const handleRemoveMember = useCallback((memberId: number) => {
    setSelectedMembers((prev) => prev.filter((m) => m.id !== memberId));
  }, []);

  // 새로고침
  const handleRefresh = useCallback(() => {
    if (searchQuery.length > 0) {
      refetchSearch();
    }
    refetchMembers();
  }, [searchQuery, refetchSearch, refetchMembers]);

  // 초대하기
  const handleInvite = useCallback(() => {
    if (selectedMembers.length === 0) return;

    const memberIds = selectedMembers.map((m) => m.id);

    // 선택한 회원들 배열로 한 번에 초대
    inviteMembers(
      { roomId, memberIds },
      {
        onSuccess: () => {
          // 초대 완료 후 화면 닫기
          router.back();
        },
      }
    );
  }, [roomId, selectedMembers, inviteMembers, router]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* 상단 헤더 */}
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="기도방 초대" titleStyle={styles.headerTitle} />
      </Appbar.Header>

      {/* 검색 입력 */}
      <MemberSearchInput
        searchQuery={searchInput}
        onChangeSearch={setSearchInput}
        onSearch={handleSearch}
        placeholder="이름으로 검색"
        disabled={isPending}
      />

      {/* 선택된 회원 칩 */}
      <SelectedMemberChips
        selectedMembers={selectedMembers}
        onRemoveMember={handleRemoveMember}
        disabled={isPending}
      />

      {/* 검색 결과 리스트 */}
      <SelectableMemberList
        members={searchResults}
        selectedMemberIds={selectedMembers.map((m) => m.id)}
        roomMemberIds={roomMemberIds}
        onToggleMember={handleToggleMember}
        isLoading={isSearching || isMembersLoading}
        onRefresh={handleRefresh}
        emptyMessage={
          searchQuery.length === 0
            ? "이름을 입력하고 검색 버튼을 눌러주세요."
            : "검색 결과가 없습니다."
        }
      />

      {/* 하단 고정 버튼 */}
      <BottomInviteButton
        selectedCount={selectedMembers.length}
        onPress={handleInvite}
        isLoading={isPending}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: backgroundColor.default,
  },
  header: {
    elevation: 2,
  },
  headerTitle: {
    fontSize: RFValue(18),
    fontWeight: "bold",
  },
});
