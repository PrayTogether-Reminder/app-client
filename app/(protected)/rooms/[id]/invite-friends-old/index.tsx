import React, { useState, useCallback } from "react";
import { View, StyleSheet } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import Top1Body10 from "@/common/components/layout/Top1Body10";
import InviteFriendsTop from "./_components/InviteFriendsTop";
import InviteFriendsBody from "./_components/InviteFriendsBody";
import BottomInviteButton from "./_components/BottomInviteButton";
import { useFetchFriendsQuery } from "@/domain/friends/hooks/queries/useFriendQueries";
import { useRoomMembersQuery } from "@/domain/rooms/hooks/queries/useRoomQueries";
import { useInviteRoomMemberV2Mutation } from "@/domain/invitations/hooks/mutations/useInvitationMutations";

export default function InviteFriendsScreen(): React.ReactElement {
  const router = useRouter();
  const params = useLocalSearchParams();
  const roomId = Number(params.id);

  const [selectedFriendIds, setSelectedFriendIds] = useState<number[]>([]);

  // 친구 목록 조회
  const {
    data: friends = [],
    isLoading: isFriendsLoading,
    isRefetching: isFriendsRefetching,
    refetch: refetchFriends
  } = useFetchFriendsQuery();

  // 방 멤버 목록 조회
  const {
    data: roomMembers = [],
    isLoading: isMembersLoading,
    isRefetching: isMembersRefetching,
    refetch: refetchMembers
  } = useRoomMembersQuery(roomId);

  // 방 초대 mutation (v2)
  const { mutate: inviteFriend, isPending } = useInviteRoomMemberV2Mutation();

  // 방 멤버들의 ID 추출
  const roomMemberIds = roomMembers.map((member) => member.id).filter((id): id is number => id !== null);

  // 친구 선택/해제
  const handleToggleFriend = useCallback((friendId: number) => {
    setSelectedFriendIds((prev) =>
      prev.includes(friendId)
        ? prev.filter((id) => id !== friendId)
        : [...prev, friendId]
    );
  }, []);

  // 새로고침
  const handleRefresh = useCallback(() => {
    refetchFriends();
    refetchMembers();
  }, [refetchFriends, refetchMembers]);

  // 초대하기
  const handleInvite = useCallback(() => {
    if (selectedFriendIds.length === 0) return;

    // 선택한 친구들 배열로 한 번에 초대
    inviteFriend(
      { roomId, friendIds: selectedFriendIds },
      {
        onSuccess: () => {
          // 초대 완료 후 화면 닫기
          router.back();
        },
      }
    );
  }, [roomId, selectedFriendIds, inviteFriend, router]);

  return (
    <View style={styles.container}>
      <Top1Body10
        tops={[<InviteFriendsTop key="top" />]}
        bodies={[
          <InviteFriendsBody
            key="body"
            friends={friends}
            roomMemberIds={roomMemberIds}
            selectedFriendIds={selectedFriendIds}
            onToggleFriend={handleToggleFriend}
            isLoading={isFriendsLoading || isMembersLoading}
            isRefetching={isFriendsRefetching || isMembersRefetching}
            onRefresh={handleRefresh}
          />,
        ]}
      />

      {/* 하단 고정 버튼 */}
      <BottomInviteButton
        selectedCount={selectedFriendIds.length}
        onPress={handleInvite}
        isLoading={isPending}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
