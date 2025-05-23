// src/screens/invitations/InvitationsScreen.tsx (경로는 예시입니다)
import React, { useCallback } from "react";
import { StyleSheet, View } from "react-native"; // Platform, Text, Button 등 제거

import type { INVITATION_STATUS } from "@/domain/invitations/constants/invitationStatus";
import { useUpdateInvitationStatusMutation } from "@/domain/invitations/hooks/mutations/useInvitationMutations";
import { useInviationsQuery } from "@/domain/invitations/hooks/queries/useInvitationQueries";
import type { UpdateInvitationStatusRequest } from "@/domain/invitations/types/request/updateInvitationStatusRequest";

import OverlayLoading from "@/common/components/loading/OverlayLoading";
import Top1Body10 from "@/common/layout/Top1Body10";
import InvitationBody from "./_components/InvitationBody";
import InvitationTop from "./_components/InvitationTop";

export default function InvitationsScreen(): React.ReactElement {
  const {
    data: invitations = [],
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useInviationsQuery();

  const { mutate: updateStatusMutate, isPending: isPendingUpdate } =
    useUpdateInvitationStatusMutation();

  const handleUpdateStatus = useCallback(
    (invitationId: number, status: INVITATION_STATUS) => {
      if (isPendingUpdate) return;

      updateStatusMutate({
        invitationId,
        status,
      } as UpdateInvitationStatusRequest);
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
        tops={[<InvitationTop />]} // 분리된 AppBar 컴포넌트 사용
        bodies={[
          <InvitationBody
            invitations={invitations}
            isLoading={isLoading}
            isRefetching={isRefetching}
            isError={isError}
            error={error as Error | null} // 타입 단언 또는 타입 가드 필요 시 사용
            isPending={isPendingUpdate}
            onRefresh={handleRefresh}
            onStatusUpdate={handleUpdateStatus}
            onRetry={refetch} // 에러 시 재시도 함수로 refetch 전달
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
