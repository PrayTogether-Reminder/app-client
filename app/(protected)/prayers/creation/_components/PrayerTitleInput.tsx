// 1. PrayerTitleInput.tsx
import React from "react";
import { StyleSheet } from "react-native";
import { TextInput } from "react-native-paper";
import { RFValue } from "react-native-responsive-fontsize";
import { color } from "../../../../../src/common/styles/color";

interface PrayerTitleInputProps {
  prayerTitle: string;
  setPrayerTitle: (text: string) => void;
}

export default function PrayerTitleInput({
  prayerTitle,
  setPrayerTitle,
}: PrayerTitleInputProps) {
  return (
    <TextInput
      label="기도 제목 (최대 50글자)"
      value={prayerTitle}
      onChangeText={setPrayerTitle}
      style={styles.titleInput}
      contentStyle={{ fontSize: RFValue(14), lineHeight: RFValue(20) }}
      mode="outlined"
      maxLength={50}
    />
  );
}

const styles = StyleSheet.create({
  titleInput: {
    backgroundColor: color.white,
    fontSize: RFValue(14),
    marginTop: -RFValue(8),
  },
});
