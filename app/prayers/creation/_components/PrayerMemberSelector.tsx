// 2. PrayerMemberSelector.tsx
import React from "react";
import { StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import { RFValue } from "react-native-responsive-fontsize";
import { color } from "../../../../src/common/styles/color";
import { RoomMember } from "@/domain/rooms/types/roomMember";

interface PrayerMemberSelectorProps {
  selectedMember: RoomMember | null;
  openMemberSelectionModal: () => void;
}

export default function PrayerMemberSelector({
  selectedMember,
  openMemberSelectionModal,
}: PrayerMemberSelectorProps) {
  return (
    <Button
      mode="outlined"
      icon="account-multiple"
      onPress={openMemberSelectionModal}
      style={styles.memberSelectButton}
      labelStyle={styles.buttonLabel}
    >
      {selectedMember === null ? "기도 대상자 선택" : `${selectedMember?.name}`}
    </Button>
  );
}

const styles = StyleSheet.create({
  memberSelectButton: {
    borderRadius: RFValue(24),
    backgroundColor: color.white,
  },
  buttonLabel: {
    fontSize: RFValue(14),
    color: color.secondary,
  },
});
