import React from "react";
import { FlatList, StyleSheet, View, RefreshControl } from "react-native";
import { Text, ActivityIndicator } from "react-native-paper";
import { RFValue } from "react-native-responsive-fontsize";
import { color } from "@/common/styles/color";
import { Friend } from "@/domain/friends/types/Friend";
import FriendItem from "./FriendItem";

interface FriendListProps {
  friends: Friend[];
  isLoading: boolean;
  isRefetching: boolean;
  onRefresh: () => void;
  onFriendLongPress: (friend: Friend) => void;
}

export default function FriendList({
  friends,
  isLoading,
  isRefetching,
  onRefresh,
  onFriendLongPress,
}: FriendListProps): React.ReactElement {
  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={color.primary} />
        <Text style={styles.loadingText}>친구 목록을 불러오는 중...</Text>
      </View>
    );
  }

  if (friends.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text variant="titleMedium" style={styles.emptyTitle}>
          아직 친구가 없어요
        </Text>
        <Text variant="bodyMedium" style={styles.emptyDescription}>
          상단의 + 버튼을 눌러 친구를 추가해보세요!
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={friends}
      keyExtractor={(item) => item.friendId.toString()}
      renderItem={({ item }) => (
        <FriendItem friend={item} onLongPress={onFriendLongPress} />
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