import React from "react";
import { FlatList, StyleSheet, View, RefreshControl } from "react-native";
import { Text, ActivityIndicator } from "react-native-paper";
import { RFValue } from "react-native-responsive-fontsize";
import { color } from "@/common/styles/color";
import { FriendInvitation } from "@/domain/friends/types/FriendInvitation";
import { FRIEND_INVITATION_STATUS } from "@/domain/friends/constants/friendInvitationStatus";
import FriendRequestItem from "./FriendRequestItem";

interface FriendRequestListProps {
  invitations: FriendInvitation[];
  isLoading: boolean;
  isRefetching: boolean;
  isPending: boolean;
  onRefresh: () => void;
  onStatusUpdate: (
    invitationId: number,
    status: FRIEND_INVITATION_STATUS
  ) => void;
}

export default function FriendRequestList({
  invitations,
  isLoading,
  isRefetching,
  isPending,
  onRefresh,
  onStatusUpdate,
}: FriendRequestListProps): React.ReactElement {
  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={color.primary} />
        <Text style={styles.loadingText}>친구 요청을 불러오는 중...</Text>
      </View>
    );
  }

  if (invitations.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text variant="titleMedium" style={styles.emptyTitle}>
          친구 요청이 없어요
        </Text>
        <Text variant="bodyMedium" style={styles.emptyDescription}>
          새로운 친구 요청이 오면 여기에 표시됩니다.
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={invitations}
      keyExtractor={(item) => item.invitationId.toString()}
      renderItem={({ item }) => (
        <FriendRequestItem
          invitation={item}
          onStatusUpdate={onStatusUpdate}
          isPending={isPending}
        />
      )}
      style={styles.list}
      contentContainerStyle={styles.listContent}
      refreshControl={
        <RefreshControl
          refreshing={isRefetching}
          onRefresh={onRefresh}
          colors={[color.primary]}
        />
      }
    />
  );
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: RFValue(16),
    paddingTop: RFValue(12),
    paddingBottom: RFValue(20),
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: RFValue(20),
  },
  loadingText: {
    marginTop: RFValue(12),
    color: color.gray,
  },
  emptyTitle: {
    marginBottom: RFValue(8),
    fontWeight: "bold",
    color: color.dark,
  },
  emptyDescription: {
    color: color.gray,
    textAlign: "center",
  },
});