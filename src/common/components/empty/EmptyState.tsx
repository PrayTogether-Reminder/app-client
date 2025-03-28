import React from "react";
import { StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons"; // 아이콘 라이브러리
import { RFValue } from "react-native-responsive-fontsize";
import { color } from "@/common/styles/color";

type EmptyStateProps = {
  icon: string; // MaterialCommunityIcons 이름
  message: string;
};

export default function EmptyState({
  icon,
  message,
}: EmptyStateProps): React.ReactElement {
  const inactiveColor = color.gray; // 비활성화된 텍스트/아이콘 색상

  return (
    <View style={styles.container}>
      <Icon name={icon} size={RFValue(50)} color={inactiveColor} />
      <Text style={[styles.message, { color: inactiveColor }]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: RFValue(20),
  },
  message: {
    marginTop: RFValue(16),
    fontSize: RFValue(16),
    textAlign: "center",
  },
});
