// 3. PrayerContentInput.tsx
import React from "react";
import { View, StyleSheet } from "react-native";
import { TextInput } from "react-native-paper";
import { RFValue } from "react-native-responsive-fontsize";
import { color } from "../../../../../src/common/styles/color";
import type { RoomMember } from "@/domain/rooms/types/roomMember";

interface PrayerContentInputProps {
  selectedMember: RoomMember | null;
  prayerContent: string;
  setPrayerContent: (text: string) => void;
}

export default function PrayerContentInput({
  selectedMember,
  prayerContent,
  setPrayerContent,
}: PrayerContentInputProps) {
  return (
    <View style={styles.contentContainer}>
      <TextInput
        label={
          selectedMember === null
            ? "기도 대상자를 선택하세요."
            : `${selectedMember.name}님을 위한 기도문`
        }
        value={prayerContent}
        onChangeText={setPrayerContent}
        style={styles.contentInput}
        contentStyle={{
          fontSize: RFValue(14),
          textAlignVertical: "top",
          lineHeight: RFValue(20),
        }}
        mode="outlined"
        multiline
        disabled={!selectedMember}
        scrollEnabled={true}
        numberOfLines={8}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  contentContainer: {},
  contentInput: {
    backgroundColor: color.white,
    fontSize: RFValue(14),
    height: RFValue(150),
    marginTop: RFValue(8),
  },
});
