import React from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { Text, ActivityIndicator } from "react-native-paper";
import { RFValue } from "react-native-responsive-fontsize";
import { color } from "@/common/styles/color";
import { Friend } from "@/domain/friends/types/Friend";
import SelectableFriendItem from "./SelectableFriendItem";

interface SelectableFriendListProps {
  friends: Friend[];
  roomMemberIds: number[]; // 방 참여자들의 memberId 목록
  selectedFriendIds: number[];
  onToggleFriend: (friendId: number) => void;
  isLoading: boolean;
}

export default function SelectableFriendList({
  friends,
  roomMemberIds,
  selectedFriendIds,
  onToggleFriend,
  isLoading,
}: SelectableFriendListProps): React.ReactElement {
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
          친구 추가 후 기도방에 초대해보세요!
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={friends}
      keyExtractor={(item) => item.friendId.toString()}
      renderItem={({ item }) => (
        <SelectableFriendItem
          friend={item}
          isSelected={selectedFriendIds.includes(item.friendId)}
          isAlreadyMember={roomMemberIds.includes(item.friendId)}
          onToggle={onToggleFriend}
        />
      )}
      style={styles.list}
      contentContainerStyle={styles.listContent}
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
    paddingBottom: RFValue(100), // 하단 버튼 공간 확보
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
