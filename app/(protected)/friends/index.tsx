import React, { useCallback } from "react";
import { View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import path from "@/common/constants/path";
import Top1Body10 from "@/common/layout/Top1Body10";
import FriendsTop from "./_components/FriendsTop";
import FriendsBody from "./_components/FriendsBody";
import { useFetchFriendsQuery } from "@/domain/friends/hooks/queries/useFriendQueries";
import { useFetchFriendInvitationsQuery } from "@/domain/friends/hooks/queries/useFriendQueries";
import { Friend } from "@/domain/friends/types/Friend";

export default function FriendsScreen() {
  const router = useRouter();

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
    // TODO: Bottom Sheet 표시 (Step 5에서 구현)
    console.log("친구 롱프레스:", friend);
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});