import React from "react";
import { StyleSheet } from "react-native";
import { List, Checkbox } from "react-native-paper";
import { RFValue } from "react-native-responsive-fontsize";
import type { MemberSearchResult } from "@/domain/members/types/response/searchMembersResponse";

type SelectableMemberItemProps = {
  member: MemberSearchResult;
  isSelected: boolean;
  onToggle: (memberId: number) => void;
  disabled?: boolean;
};

export default function SelectableMemberItem({
  member,
  isSelected,
  onToggle,
  disabled = false,
}: SelectableMemberItemProps) {
  const phoneDisplay = member.phoneNumberSuffix
    ? `(${member.phoneNumberSuffix})`
    : "(번호 미등록)";

  return (
    <List.Item
      title={`${member.name} ${phoneDisplay}`}
      onPress={() => !disabled && onToggle(member.id)}
      left={(props) => (
        <List.Icon {...props} icon="account" />
      )}
      right={() => (
        <Checkbox
          status={isSelected ? "checked" : "unchecked"}
          onPress={() => !disabled && onToggle(member.id)}
          disabled={disabled}
        />
      )}
      style={styles.item}
      titleStyle={styles.title}
      disabled={disabled}
    />
  );
}

const styles = StyleSheet.create({
  item: {
    paddingVertical: RFValue(4),
  },
  title: {
    fontSize: RFValue(16),
  },
  description: {
    fontSize: RFValue(13),
    color: "#666",
  },
});
