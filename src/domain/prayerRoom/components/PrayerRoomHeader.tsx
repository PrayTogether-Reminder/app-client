// PrayerRoomHeader.tsx
import React from "react";
import { StatusBar, StyleSheet } from "react-native";
import { Appbar, useTheme } from "react-native-paper";
import { useRouter } from "expo-router";
import { RFValue } from "react-native-responsive-fontsize";
import { backgroundColor, color } from "../../../common/styles/color";
import { useSelectedRoomStore } from "../types/roomStore";

const PrayerRoomHeader: React.FC = () => {
  const router = useRouter();
  const paperTheme = useTheme();
  const room = useSelectedRoomStore().selectedRoom;

  return (
    <Appbar.Header style={styles.header}>
      <Appbar.BackAction
        style={styles.headerBackAction}
        onPress={() => router.back()}
        color={color.primary}
      />
      <Appbar.Content
        title={room?.name as string}
        titleStyle={styles.headerTitle}
      />
      <Appbar.Action
        style={styles.headerAction}
        icon="menu"
        color={color.primary}
        onPress={() => {}}
        size={RFValue(24)}
      />
    </Appbar.Header>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: color.third,
  },
  headerTitle: {
    backgroundColor: color.third,
    color: color.primary,
    fontSize: RFValue(20),
    fontWeight: "bold",
    textAlign: "center",
  },
  headerAction: {},
  headerBackAction: {},
});

export default PrayerRoomHeader;
