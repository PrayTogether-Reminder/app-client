// src/screens/invitations/_components/InvitationBody.tsx (경로는 예시입니다)
import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, Button } from "react-native-paper";
import { RFValue } from "react-native-responsive-fontsize";

import type { Invitation } from "@/domain/invitations/types/Intivation"; // Invitation 타입 임포트
import type { INVITATION_STATUS } from "@/domain/invitations/constants/invitationStatus"; // INVITATION_STATUS 타입 임포트

import InvitationList from "./InvitationList"; // InvitationList 컴포넌트 임포트

interface InvitationBodyProps {
  invitations: Invitation[];
  isLoading: boolean; // 초기 로딩 상태
  isRefetching: boolean;
  isError: boolean;
  error: Error | null; // Error 타입 또는 null
  isPending: boolean; // 뮤테이션 진행 상태
  onRefresh: () => void;
  onStatusUpdate: (invitationId: number, status: INVITATION_STATUS) => void;
  onRetry: () => void; // 에러 시 재시도 함수
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
}: InvitationBodyProps): React.ReactElement {
  if (isError) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>
          데이터를 불러오는 중 오류가 발생했습니다.
        </Text>
        <Text style={[styles.errorText, { marginBottom: RFValue(20) }]}>
          {error?.message || "알 수 없는 오류"}
        </Text>
        <Button mode="contained" onPress={onRetry} disabled={isRefetching}>
          {isRefetching ? "재시도 중..." : "다시 시도"}
        </Button>
      </View>
    );
  }

  // 에러가 아닐 경우 InvitationList 렌더링
  // InvitationList 내부에서 isLoading 상태를 보고 초기 로딩 UI를 처리합니다.
  return (
    <InvitationList
      invitations={invitations}
      isLoading={isLoading} // 초기 로딩 상태 전달
      isRefetching={isRefetching}
      isPending={isPending} // 뮤테이션 상태 전달 (List 내부 Item 비활성화 등)
      onRefresh={onRefresh}
      onStatusUpdate={onStatusUpdate}
    />
  );
}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: RFValue(20),
    // 배경색은 레이아웃 컴포넌트에서 관리
  },
  errorText: {
    marginBottom: RFValue(10),
    textAlign: "center",
  },
  // InvitationList 관련 스타일은 해당 컴포넌트에 있음
});
