import React from "react";
import { StyleSheet, View, ScrollView, TouchableOpacity } from "react-native";
import { Text } from "react-native-paper";
import { RFValue } from "react-native-responsive-fontsize";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { color } from "@/common/styles/color";
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
      <Text style={styles.label}>선택됨 ({selectedMembers.length})</Text>
      {selectedMembers.length > 0 ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsContainer}
        >
          {selectedMembers.map((member) => (
            <View key={member.id} style={styles.chip}>
              <Text style={styles.chipText}>{member.name}</Text>
              <TouchableOpacity
                onPress={() => !disabled && onRemoveMember(member.id)}
                disabled={disabled}
                style={styles.closeButton}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <MaterialCommunityIcons
                  name="close"
                  size={RFValue(16)}
                  color={color.white}
                />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      ) : (
        <Text style={styles.emptyText}>회원을 선택해주세요</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: RFValue(16),
    paddingTop: RFValue(12),
    paddingBottom: RFValue(16),
    minHeight: RFValue(90),
  },
  label: {
    fontSize: RFValue(13),
    fontWeight: "600",
    marginBottom: RFValue(8),
    color: color.secondary,
  },
  chipsContainer: {
    flexDirection: "row",
    gap: RFValue(8),
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: color.secondary,
    borderRadius: RFValue(16),
    paddingLeft: RFValue(12),
    paddingRight: RFValue(8),
    paddingVertical: RFValue(6),
    marginRight: RFValue(4),
    gap: RFValue(4),
  },
  chipText: {
    fontSize: RFValue(13),
    color: color.white,
    fontWeight: "500",
  },
  closeButton: {
    width: RFValue(20),
    height: RFValue(20),
    borderRadius: RFValue(10),
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: RFValue(13),
    color: "#999",
    fontStyle: "italic",
  },
});
