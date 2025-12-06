// PrayerRoomHeader.tsx
import React, { useState } from "react";
import { StyleSheet, Platform } from "react-native";
import { Appbar, useTheme } from "react-native-paper";
import { useRouter } from "expo-router";
import { RFValue } from "react-native-responsive-fontsize";
import { color } from "../../../../../src/common/styles/color";
import { useSelectedRoomStore } from "../../../../../src/domain/rooms/stores/useSelectedRoomStore";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface PrayerRoomTopProps {
  openRightMenu: () => void;
}

const PrayerRoomTop: React.FC<PrayerRoomTopProps> = ({ openRightMenu }) => {
  const router = useRouter();
  const room = useSelectedRoomStore().selectedRoom;
  const insets = useSafeAreaInsets();

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
          style={styles.headerContent}
        />
        <Appbar.Action
          style={styles.headerAction}
          icon="menu"
          color={color.primary}
          onPress={openRightMenu}
          size={RFValue(24)}
        />
      </Appbar.Header>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: color.third,
    height: "100%",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 0,
    paddingBottom: 0,
    paddingVertical: 0,
    elevation: 0,
    minHeight: 0,
  },
  headerContent: {
    marginTop: -RFValue(20),
  },
  headerTitle: {
    color: color.primary,
    fontSize: RFValue(20),
    fontWeight: "bold",
    textAlign: "center",
    alignSelf: "center",
    lineHeight: RFValue(22),
  },
  headerAction: {
    alignSelf: "center",
    marginRight: 0,
    marginTop: -RFValue(20),
  },
  headerBackAction: {
    alignSelf: "center",
    marginLeft: 0,
    marginTop: -RFValue(20),
  },
});

export default PrayerRoomTop;