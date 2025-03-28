// src/screens/invitations/InvitationsScreen.tsx (경로는 예시입니다)
import React, { useCallback } from "react";
import { StyleSheet, View, Alert } from "react-native"; // Platform, Text, Button 등 제거
import { ActivityIndicator } from "react-native-paper"; // Appbar 등 제거
import { useRouter } from "expo-router";

import { useInviationsQuery } from "@/domain/invitations/hooks/queries/useInvitationQueries";
import { useUpdateInvitationStatusMutation } from "@/domain/invitations/hooks/mutations/useInvitationMutations";
import type { UpdateInvitationStatusRequest } from "@/domain/invitations/types/request/updateInvitationStatusRequest";
import type { INVITATION_STATUS } from "@/domain/invitations/constants/invitationStatus";

import { backgroundColor } from "@/common/styles/color"; // 필요 시 유지
// 분리된 컴포넌트 임포트
import InvitationTop from "./_components/InvitationTop";
import InvitationBody from "./_components/InvitationBody";
import Top1Body10 from "@/common/layout/Top1Body10"; // 레이아웃 임포트
import Loading from "@/common/components/loading/Loading";

export default function InvitationsScreen(): React.ReactElement {
  // router, queryClient는 InvitationAppBar 내부 또는 여기서 필요 시 사용
  // const router = useRouter(); // InvitationAppBar에서 사용하므로 여기선 불필요할 수 있음
  // const queryClient = useQueryClient(); // 뮤테이션 성공/실패 시 필요

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
      {isPendingUpdate && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator animating={true} size="large" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: backgroundColor.default, // 앱 기본 배경색
  },
  // centerContainer, errorText 등 Body 관련 스타일은 InvitationBody.tsx 로 이동
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
});
