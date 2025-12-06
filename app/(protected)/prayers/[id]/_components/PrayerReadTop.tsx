import React from "react";
import { StyleSheet, Platform } from "react-native";
import { Appbar, useTheme } from "react-native-paper";
import { useRouter } from "expo-router";
import { RFValue } from "react-native-responsive-fontsize";
import { color } from "../../../../../src/common/styles/color";
import { useSelectedRoomStore } from "../../../../../src/domain/rooms/stores/useSelectedRoomStore";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface PrayerReadTopProps {
  isEditMode: boolean;
  onToggleEditMode: () => void;
}

const PrayerReadTop: React.FC<PrayerReadTopProps> = ({ isEditMode, onToggleEditMode }) => {
  const router = useRouter();
  const room = useSelectedRoomStore().selectedRoom;
  const insets = useSafeAreaInsets();

  return (
    <>
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction
          style={styles.headerBackAction}
          onPress={() => {
            if (isEditMode) {
              onToggleEditMode(); // 편집 모드 종료
            } else {
              router.back();
            }
          }}
          color={color.primary}
        />
        <Appbar.Content
          title={room?.name as string}
          titleStyle={styles.headerTitle}
          style={styles.headerContent}
        />
        <Appbar.Action
          style={[styles.headerAction, isEditMode && styles.headerActionActive]}
          icon={isEditMode ? "check" : "pencil"}
          color={color.primary}
          onPress={onToggleEditMode}
          size={RFValue(28)}
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
    marginTop: -RFValue(20)
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
  headerActionActive: {
    backgroundColor: color.primary + "20",
    borderRadius: RFValue(20),
  },
  headerBackAction: {
    alignSelf: "center",
    marginLeft: 0,
    marginTop: -RFValue(20),
  },
});

export default PrayerReadTop;
