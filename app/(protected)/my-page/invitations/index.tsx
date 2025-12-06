// src/screens/invitations/InvitationsScreen.tsx (경로는 예시입니다)
import React, { useCallback } from "react";
import { StyleSheet, View } from "react-native"; // Platform, Text, Button 등 제거

import type { INVITATION_STATUS } from "@/domain/invitations/constants/invitationStatus";
import { useUpdateInvitationStatusMutation } from "@/domain/invitations/hooks/mutations/useInvitationMutations";
import { useInviationsQuery } from "@/domain/invitations/hooks/queries/useInvitationQueries";
import type { UpdateInvitationStatusRequest } from "@/domain/invitations/types/request/updateInvitationStatusRequest";

import OverlayLoading from "@/common/components/loading/OverlayLoading";
import { Top1Body10Layout } from "@/common/components/layout";
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
    <>
      <Top1Body10Layout
        showBackButton={false}
        keyboardAvoiding={false}
        scrollable={false}
        contentPadding={false}
        tops={[<InvitationTop />]}
        bodies={[
          <InvitationBody
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
    </>
  );
}

const styles = StyleSheet.create({});
