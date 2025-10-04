import React, { useCallback } from "react";
import { View, StyleSheet } from "react-native";
import Top1Body10 from "@/common/layout/Top1Body10";
import OverlayLoading from "@/common/components/loading/OverlayLoading";
import FriendRequestTop from "./_components/FriendRequestTop";
import FriendRequestBody from "./_components/FriendRequestBody";
import { useFetchFriendInvitationsQuery } from "@/domain/friends/hooks/queries/useFriendQueries";
import { useUpdateFriendInvitationStatusMutation } from "@/domain/friends/hooks/mutations/useFriendMutations";
import { FRIEND_INVITATION_STATUS } from "@/domain/friends/constants/friendInvitationStatus";

export default function FriendRequestsScreen(): React.ReactElement {
  const {
    data: invitations = [],
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useFetchFriendInvitationsQuery();

  const { mutate: updateStatusMutate, isPending: isPendingUpdate } =
    useUpdateFriendInvitationStatusMutation();

  const handleUpdateStatus = useCallback(
    (invitationId: number, status: FRIEND_INVITATION_STATUS) => {
      if (isPendingUpdate) return;

      updateStatusMutate({
        requestId: invitationId,
        status,
      });
    },
    [updateStatusMutate, isPendingUpdate]
  );

  const handleRefresh = useCallback(() => {
    if (!isLoading && !isRefetching && !isPendingUpdate) {
      refetch();
    }
  }, [isLoading, isRefetching, isPendingUpdate, refetch]);

  return (
    <View style={styles.outerContainer}>
      <Top1Body10
        tops={[<FriendRequestTop />]}
        bodies={[
          <FriendRequestBody
            invitations={invitations}
            isLoading={isLoading}
            isRefetching={isRefetching}
            isError={isError}
            error={error as Error | null}
            isPending={isPendingUpdate}
            onRefresh={handleRefresh}
            onStatusUpdate={handleUpdateStatus}
            onRetry={refetch}
          />,
        ]}
      />

      {/* Mutation 로딩 오버레이 */}
      {isPendingUpdate && <OverlayLoading />}
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
  },
});