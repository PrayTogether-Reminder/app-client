// src/screens/invitations/_components/InvitationBody.tsx (경로는 예시입니다)
import React from "react";
import { StyleSheet } from "react-native"; // View, Text, Button, RFValue 제거
// 분리된 FetchError 컴포넌트 임포트 (경로 수정 필요)
import FetchError from "@/common/components/error/FetchError";

import type { Invitation } from "@/domain/invitations/types/Intivation";
import type { INVITATION_STATUS } from "@/domain/invitations/constants/invitationStatus";

import InvitationList from "./InvitationList";

interface InvitationBodyProps {
  invitations: Invitation[];
  isLoading: boolean;
  isRefetching: boolean;
  isError: boolean;
  error: Error | null;
  isPending: boolean;
  onRefresh: () => void;
  onStatusUpdate: (invitationId: number, status: INVITATION_STATUS) => void;
  onRetry: () => void;
}

export default function InvitationBody({
  invitations,
  isLoading,
  isRefetching,
  isError,
  error,
  isPending,
  onRefresh,
  onStatusUpdate,
  onRetry,
}: InvitationBodyProps) {
  if (isError) {
    return (
      <FetchError error={error} onRetry={onRetry} isRetrying={isRefetching} />
    );
  }

  return (
    <InvitationList
      invitations={invitations}
      isLoading={isLoading}
      isRefetching={isRefetching}
      isPending={isPending}
      onRefresh={onRefresh}
      onStatusUpdate={onStatusUpdate}
    />
  );
}

const styles = StyleSheet.create({});
