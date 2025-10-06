import React from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import { Chip, Text } from "react-native-paper";
import { RFValue } from "react-native-responsive-fontsize";
import type { MemberSearchResult } from "@/domain/members/types/response/searchMembersResponse";

type SelectedMemberChipsProps = {
  selectedMembers: MemberSearchResult[];
  onRemoveMember: (memberId: number) => void;
  disabled?: boolean;
};

export default function SelectedMemberChips({
  selectedMembers,
  onRemoveMember,
  disabled = false,
}: SelectedMemberChipsProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        선택된 회원 ({selectedMembers.length}명)
      </Text>
      {selectedMembers.length > 0 ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsContainer}
        >
          {selectedMembers.map((member) => (
            <Chip
              key={member.id}
              mode="flat"
              onClose={() => !disabled && onRemoveMember(member.id)}
              style={styles.chip}
              textStyle={styles.chipText}
              disabled={disabled}
            >
              {member.name}
            </Chip>
          ))}
        </ScrollView>
      ) : (
        <Text style={styles.emptyText}>
          회원을 선택하면 여기에 표시됩니다
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: RFValue(16),
    paddingVertical: RFValue(12),
    backgroundColor: "#f5f5f5",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    minHeight: RFValue(70),
  },
  label: {
    fontSize: RFValue(13),
    fontWeight: "600",
    marginBottom: RFValue(8),
    color: "#666",
  },
  chipsContainer: {
    flexDirection: "row",
    gap: RFValue(8),
  },
  chip: {
    marginRight: RFValue(4),
  },
  chipText: {
    fontSize: RFValue(14),
  },
  emptyText: {
    fontSize: RFValue(13),
    color: "#999",
    fontStyle: "italic",
    paddingVertical: RFValue(8),
  },
});
