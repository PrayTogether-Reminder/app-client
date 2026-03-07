import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { Text } from "react-native-paper";
import { RFValue } from "react-native-responsive-fontsize";
import { color } from "@/common/styles/color";

interface AvatarProps {
  name?: string;
  size?: number;
  style?: ViewStyle;
}

/**
 * 멤버 이름의 이니셜을 표시하는 아바타 컴포넌트
 * 이름에 따라 일관된 배경색을 생성합니다.
 */
export default function Avatar({ name = "익명", size = 28, style }: AvatarProps): JSX.Element {
  const getInitial = (text: string): string => {
    const chars = Array.from(text);
    return chars.length > 0 ? chars[0].toUpperCase() : "";
  };

  const initial = getInitial(name);
  const sizeValue = RFValue(size);

  return (
    <View
      style={[
        styles.avatar,
        {
          width: sizeValue,
          height: sizeValue,
          borderRadius: sizeValue / 2,
          backgroundColor: color.third,
        },
        style,
      ]}
    >
      <Text
        style={[
          styles.initial,
          {
            fontSize: sizeValue * 0.4,
          },
        ]}
      >
        {initial}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    alignItems: "center",
    justifyContent: "center",
  },
  initial: {
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
