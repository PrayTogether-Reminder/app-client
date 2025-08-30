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
    height: "100%", // 고정된 높이 설정
    alignItems: "center", // 수직 중앙 정렬
    flexDirection: "row", // 명시적으로 가로 방향 설정
    justifyContent: "space-between", // 요소들 사이 간격 균등하게
    paddingTop: 0, // 상단 패딩 제거
    elevation: 0, // 그림자 제거 (Android)
  },
  headerTitle: {
    color: color.primary,
    fontSize: RFValue(20),
    fontWeight: "bold",
    textAlign: "center",
    alignSelf: "center", // 제목 자체도 중앙 정렬
    lineHeight: RFValue(26),
  },
  headerAction: {
    alignSelf: "center", // 메뉴 버튼 중앙 정렬
    marginRight: 0, // 기본 마진 제거
  },
  headerActionActive: {
    backgroundColor: color.primary + "20", // 편집 모드일 때 배경색
    borderRadius: RFValue(20),
  },
  headerBackAction: {
    alignSelf: "center", // 뒤로가기 버튼 중앙 정렬
    marginLeft: 0, // 기본 마진 제거
  },
});

export default PrayerReadTop;
