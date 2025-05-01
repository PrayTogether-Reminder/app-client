// 4. PrayerAddButton.tsx
import React from "react";
import { StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import { RFValue } from "react-native-responsive-fontsize";
import { color } from "../../../../../src/common/styles/color";
import { RoomMember } from "@/domain/rooms/types/roomMember";

interface PrayerAddButtonProps {
  prayerContent: string;
  selectedMember: RoomMember | null;
  onAddPrayer: () => void;
}

export default function PrayerAddButton({
  prayerContent,
  selectedMember,
  onAddPrayer,
}: PrayerAddButtonProps) {
  const isDisabled = !prayerContent.trim() || !selectedMember;

  return (
    <Button
      mode="contained"
      onPress={onAddPrayer}
      style={[styles.addButton, isDisabled && styles.addButton_disabled]}
      labelStyle={styles.addButtonLabel}
      disabled={isDisabled}
    >
      기도문 추가
    </Button>
  );
}

const styles = StyleSheet.create({
  addButton: {
    marginTop: RFValue(4),
    backgroundColor: color.secondary,
    borderRadius: RFValue(8),
  },
  addButton_disabled: {
    backgroundColor: color.gray,
  },
  addButtonLabel: {
    fontSize: RFValue(14),
    color: color.white,
  },
});
