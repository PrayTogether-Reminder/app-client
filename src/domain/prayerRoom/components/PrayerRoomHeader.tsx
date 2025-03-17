// PrayerRoomHeader.tsx
import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { Appbar, useTheme } from "react-native-paper";
import { useRouter } from "expo-router";
import { RFValue } from "react-native-responsive-fontsize";
import { color } from "../../../common/styles/color";
import { useSelectedRoomStore } from "../types/roomStore";

interface PrayerRoomHeaderProps {
  toggleDrawer: () => void;
}

const PrayerRoomHeader: React.FC<PrayerRoomHeaderProps> = ({
  toggleDrawer,
}) => {
  const router = useRouter();
  const room = useSelectedRoomStore().selectedRoom;

  return (
    <>
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
          onPress={toggleDrawer}
          size={RFValue(24)}
        />
      </Appbar.Header>
    </>
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
