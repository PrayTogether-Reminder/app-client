import React, { useState, useCallback } from "react";
import { View, StyleSheet } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { RFValue } from "react-native-responsive-fontsize";
import { backgroundColor, color } from "@/common/styles/color";
import { Top1Body10Bottom1Layout } from "@/common/components/layout";
import { TopHeader } from "@/common/components/header/TopHeader";

import MemberSearchInput from "./_components/MemberSearchInput";
import SelectableMemberList from "./_components/SelectableMemberList";
import SelectedMemberChips from "./_components/SelectedMemberChips";
import { BottomActionButton } from "@/common/components/button";

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
  } = useSearchMembersQuery(searchQuery);

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
    <Top1Body10Bottom1Layout
      showBackButton={false}
      keyboardAvoiding
      scrollable={false}
      contentPadding={false}
      tops={[
        <TopHeader
          key="header"
          title="기도방 초대"
          onBackPress={() => router.back()}
        />,
      ]}
      bodies={[
        <View key="body" style={styles.bodyContainer}>
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
        </View>,
      ]}
      bottoms={[
        <BottomActionButton
          key="button"
          onPress={handleInvite}
          disabled={selectedMembers.length === 0 || isPending}
          loading={isPending}
          icon="account-multiple-plus"
          text={`기도방 초대 (${selectedMembers.length}명)`}
          loadingText="초대 중..."
        />
      ]}
    />
  );
}

const styles = StyleSheet.create({
  bodyContainer: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
});
