import React from "react";
import { View, StyleSheet, Platform } from "react-native";
import { Title, IconButton, Appbar } from "react-native-paper";
import { RFValue } from "react-native-responsive-fontsize";
import { backgroundColor, color } from "../../../../../src/common/styles/color";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface PrayerCreationTopProps {
  roomName: string | undefined;
  onCancel: () => void;
}

export default function PrayerCreationTop({
  roomName,
  onCancel,
}: PrayerCreationTopProps) {
  const insets = useSafeAreaInsets();
  
  return (
    <Appbar.Header style={styles.header}>
      <Title numberOfLines={1} ellipsizeMode="tail" style={styles.title}>
        {roomName}
      </Title>
      <Appbar.Action
        icon="close"
        onPress={onCancel}
        size={RFValue(24)}
        color={color.primary}
        style={styles.close}
      />
    </Appbar.Header>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: RFValue(22),
    backgroundColor: color.third,
    height: "100%",
    paddingTop: 0,
    paddingBottom: 0,
    paddingVertical: 0,
    elevation: 0,
    minHeight: 0,
  },
  title: {
    fontSize: RFValue(18),
    fontWeight: "bold",
    color: color.primary,
    alignSelf: "center",
    lineHeight: RFValue(22),
    marginTop: -RFValue(20),
  },
  close: {
    alignSelf: "center",
    marginRight: 0,
    marginTop: -RFValue(20),
  },
});
