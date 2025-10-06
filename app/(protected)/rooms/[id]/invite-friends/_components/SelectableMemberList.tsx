import React from "react";
import { FlatList, StyleSheet, View, RefreshControl } from "react-native";
import { Text } from "react-native-paper";
import { RFValue } from "react-native-responsive-fontsize";
import { color } from "@/common/styles/color";
import SelectableMemberItem from "./SelectableMemberItem";
import type { MemberSearchResult } from "@/domain/members/types/response/searchMembersResponse";

type SelectableMemberListProps = {
  members: MemberSearchResult[];
  selectedMemberIds: number[];
  roomMemberIds: number[];
  onToggleMember: (memberId: number) => void;
  isLoading?: boolean;
  isRefreshing?: boolean;
  onRefresh?: () => void;
  emptyMessage?: string;
};

export default function SelectableMemberList({
  members,
  selectedMemberIds,
  roomMemberIds,
  onToggleMember,
  isLoading = false,
  isRefreshing = false,
  onRefresh,
  emptyMessage = "검색 결과가 없습니다.",
}: SelectableMemberListProps) {
  // 이미 방 멤버인 사람 제외
  const availableMembers = members.filter(
    (member) => !roomMemberIds.includes(member.id)
  );

  const renderItem = ({ item }: { item: MemberSearchResult }) => (
    <SelectableMemberItem
      member={item}
      isSelected={selectedMemberIds.includes(item.id)}
      onToggle={onToggleMember}
      disabled={isLoading}
    />
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>{emptyMessage}</Text>
    </View>
  );

  return (
    <FlatList
      data={availableMembers}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
      ListEmptyComponent={renderEmpty}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            colors={[color.secondary]}
            tintColor={color.secondary}
          />
        ) : undefined
      }
      contentContainerStyle={
        availableMembers.length === 0
          ? styles.emptyList
          : styles.listContent
      }
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingVertical: RFValue(8),
  },
  emptyList: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: RFValue(32),
    paddingVertical: RFValue(40),
  },
  emptyText: {
    fontSize: RFValue(15),
    color: "#666",
    textAlign: "center",
  },
});
