import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { Appbar, useTheme } from "react-native-paper";
import { useRouter } from "expo-router";
import { RFValue } from "react-native-responsive-fontsize";
import { color } from "../../../common/styles/color";
import path from "../../../../src/common/constants/path";
import { useSelectedRoomStore } from "../../rooms/stores/useSelectedRoomStore";
import { useSelectedPrayerTitleStore } from "../../prayers/stores/useSelectedPrayerTitleStore";

interface PrayerReadTopProps {}

const PrayerReadTop: React.FC<PrayerReadTopProps> = () => {
  const router = useRouter();
  const room = useSelectedRoomStore().selectedRoom;
  const titleId = useSelectedPrayerTitleStore().selectedPrayerTitle?.id ?? null;
  const onEdit = () => {
    router.push(path.showPrayersUpdateById(titleId));
  };

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
          icon="playlist-edit"
          color={color.primary}
          onPress={onEdit}
          size={RFValue(32)}
        />
      </Appbar.Header>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: color.third,
    height: RFValue(56), // 고정된 높이 설정
    alignItems: "center", // 수직 중앙 정렬
    flexDirection: "row", // 명시적으로 가로 방향 설정
    justifyContent: "space-between", // 요소들 사이 간격 균등하게
  },
  headerTitle: {
    color: color.primary,
    fontSize: RFValue(20),
    fontWeight: "bold",
    textAlign: "center",
    alignSelf: "center", // 제목 자체도 중앙 정렬
  },
  headerAction: {
    alignSelf: "center", // 메뉴 버튼 중앙 정렬
    marginRight: 0, // 기본 마진 제거
  },
  headerBackAction: {
    alignSelf: "center", // 뒤로가기 버튼 중앙 정렬
    marginLeft: 0, // 기본 마진 제거
  },
});

export default PrayerReadTop;
