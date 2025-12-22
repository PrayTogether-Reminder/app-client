import React from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import { RFValue } from "react-native-responsive-fontsize";
import Avatar from "./Avatar";

interface AvatarStackProps {
  names: string[];
  maxDisplayed?: number;
  size?: number;
  spacing?: number;
}

/**
 * 여러 멤버의 아바타를 스택 형태로 표시하는 컴포넌트
 * 지정된 수를 초과하면 "+n명" 형태로 표시합니다.
 */
export default function AvatarStack({
  names,
  maxDisplayed = 3,
  size = 28,
  spacing = -8,
}: AvatarStackProps): JSX.Element {
  const displayedNames = names.slice(0, maxDisplayed);
  const extraCount = Math.max(0, names.length - maxDisplayed);
  const sizeValue = RFValue(size);
  const spacingValue = RFValue(spacing);

  return (
    <View style={styles.container}>
      <View style={styles.stack}>
        {displayedNames.map((name, index) => (
          <View
            key={`${name}-${index}`}
            style={[
              styles.avatarWrapper,
              {
                marginLeft: index === 0 ? 0 : spacingValue,
              },
            ]}
          >
            <Avatar name={name} size={size} />
          </View>
        ))}
        {extraCount > 0 && (
          <View
            style={[
              styles.extraCount,
              {
                width: sizeValue,
                height: sizeValue,
                borderRadius: sizeValue / 2,
                marginLeft: spacingValue,
              },
            ]}
          >
            <Text
              style={[
                styles.extraText,
                {
                  fontSize: sizeValue * 0.35,
                },
              ]}
            >
              +{extraCount}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: RFValue(28),
    justifyContent: "center",
  },
  stack: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarWrapper: {
    zIndex: 1,
  },
  extraCount: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F0F0F0",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  extraText: {
    fontWeight: "600",
    color: "#666666",
  },
});
