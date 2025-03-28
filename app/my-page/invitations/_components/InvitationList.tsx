// src/screens/invitations/_components/InvitationList.tsx
import React from "react";
import { StyleSheet, View, FlatList, Platform } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { Invitation } from "@/domain/invitations/types/Intivation";
import EmptyState from "@/common/components/empty/EmptyState";
import Loading from "@/common/components/loading/Loading";
import InvitationItem from "./InvitationItem";
import type { INVITATION_STATUS } from "@/domain/invitations/constants/invitationStatus";

interface InvitationListProps {
  invitations: Invitation[];
  isLoading: boolean; // 초기 로딩 상태
  isRefetching: boolean; // 새로고침 중 상태
  onStatusUpdate: (invitationId: number, status: INVITATION_STATUS) => void;
  onRefresh: () => void;
  isPending: boolean; // 아이템 버튼 비활성화용
}

export default function InvitationList({
  invitations,
  isLoading,
  isRefetching,
  onStatusUpdate,
  onRefresh,
  isPending,
}: InvitationListProps): React.ReactElement {
  const renderItem = ({ item }: { item: Invitation }) => (
    <InvitationItem
      invitation={item}
      onClick={onStatusUpdate}
      ispending={isPending}
    />
  );
  // 초기 로딩 상태 처리
  if (isLoading && !isRefetching) {
    return <Loading />;
  }

  return (
    <FlatList
      data={invitations}
      renderItem={renderItem}
      keyExtractor={(item) => `${item.invitationId}`}
      contentContainerStyle={styles.listContentContainer}
      ListEmptyComponent={
        !isLoading && !isRefetching ? ( // 로딩/새로고침 중이 아닐 때만 빈 상태 표시
          <EmptyState
            icon="email-off-outline"
            message="받은 초대장이 없습니다."
          />
        ) : null
      }
      onRefresh={onRefresh}
      refreshing={isRefetching}
      showsVerticalScrollIndicator={true}
    />
  );
}

const styles = StyleSheet.create({
  listContentContainer: {
    padding: RFValue(16),
    paddingBottom: Platform.OS === "ios" ? RFValue(40) : RFValue(16),
    flexGrow: 1, // 중요: 내용이 적을 때도 EmptyState가 중앙에 오도록 함
  },
});
