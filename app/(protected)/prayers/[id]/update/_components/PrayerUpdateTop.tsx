import React from "react";
import { View, StyleSheet, Platform } from "react-native";
import { Title, IconButton, Appbar } from "react-native-paper";
import { RFValue } from "react-native-responsive-fontsize";
import {
  backgroundColor,
  color,
} from "../../../../../../src/common/styles/color";
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
    alignItems: "center", // 수직 중앙 정렬 추가
    paddingLeft: RFValue(22),
    backgroundColor: color.third,
    height: RFValue(56), // 헤더 높이 고정
    paddingTop: 0, // 상단 패딩 제거
    elevation: 0, // 그림자 제거 (Android)
  },
  title: {
    fontSize: RFValue(18),
    fontWeight: "bold",
    color: color.primary,
    alignSelf: "center", // 자체적으로도 중앙 정렬
  },
  close: {
    alignSelf: "center", // X 버튼 중앙 정렬
    marginRight: 0, // 기본 마진 제거
  },
});
