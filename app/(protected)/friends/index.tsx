import React, { useCallback, useState } from "react";
import { View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import path from "@/common/constants/path";
import { color } from "@/common/styles/color";
import Top1Body10 from "@/common/layout/Top1Body10";
import ConfirmationModal from "@/common/components/modal/ConfirmationModal";
import FriendsTop from "./_components/FriendsTop";
import FriendsBody from "./_components/FriendsBody";
import FriendActionSheet from "./_components/FriendActionSheet";
import { useFetchFriendsQuery } from "@/domain/friends/hooks/queries/useFriendQueries";
import { useFetchFriendInvitationsQuery } from "@/domain/friends/hooks/queries/useFriendQueries";
import { useDeleteFriendMutation } from "@/domain/friends/hooks/mutations/useFriendMutations";
import { Friend } from "@/domain/friends/types/Friend";

export default function FriendsScreen() {
  const router = useRouter();
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
  const [showActionSheet, setShowActionSheet] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // 친구 목록 조회
  const {
    data: friends = [],
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useFetchFriendsQuery();

  // 친구 요청 목록 조회 (뱃지 카운트용)
  const { data: friendInvitations = [] } = useFetchFriendInvitationsQuery();

  // 친구 삭제 mutation
  const { mutate: deleteFriend, isPending: isDeleting } =
    useDeleteFriendMutation();

  const handleRefresh = useCallback(() => {
    if (!isLoading && !isRefetching) {
      refetch();
    }
  }, [isLoading, isRefetching, refetch]);

  const handlePressRequests = () => {
    router.push(path.showFriendRequests());
  };

  const handlePressAdd = () => {
    router.push(path.showFriendAdd());
  };

  const handleFriendLongPress = (friend: Friend) => {
    setSelectedFriend(friend);
    setShowActionSheet(true);
  };

  const handleDeleteRequest = () => {
    setShowActionSheet(false);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (selectedFriend) {
      deleteFriend(selectedFriend.friendId, {
        onSuccess: () => {
          setShowDeleteModal(false);
          setSelectedFriend(null);
        },
        onError: () => {
          setShowDeleteModal(false);
        },
      });
    }
  };

  const handleDismissActionSheet = () => {
    setShowActionSheet(false);
    setSelectedFriend(null);
  };

  return (
    <View style={styles.container}>
      <Top1Body10
        tops={[
          <FriendsTop
            requestCount={friendInvitations.length}
            onPressRequests={handlePressRequests}
            onPressAdd={handlePressAdd}
          />,
        ]}
        bodies={[
          <FriendsBody
            friends={friends}
            isLoading={isLoading}
            isRefetching={isRefetching}
            isError={isError}
            error={error as Error | null}
            onRefresh={handleRefresh}
            onRetry={refetch}
            onFriendLongPress={handleFriendLongPress}
          />,
        ]}
      />

      {/* Bottom Sheet - 친구 액션 */}
      <FriendActionSheet
        visible={showActionSheet}
        friend={selectedFriend}
        onDismiss={handleDismissActionSheet}
        onDelete={handleDeleteRequest}
      />

      {/* 삭제 확인 다이얼로그 */}
      <ConfirmationModal
        visible={showDeleteModal}
        onDismiss={() => {
          setShowDeleteModal(false);
          setSelectedFriend(null);
        }}
        onConfirm={handleConfirmDelete}
        icon="account-remove"
        title="친구 삭제"
        content={`${selectedFriend?.friendName}님을 친구 목록에서\n삭제하시겠습니까?`}
        confirmText="삭제"
        cancelText="취소"
        iconColor={color.red}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});