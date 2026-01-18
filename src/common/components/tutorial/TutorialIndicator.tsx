import React from "react";
import { StyleSheet, View, Pressable } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { color } from "../../styles/color";

interface TutorialIndicatorProps {
  total: number;
  current: number;
  onPress?: (index: number) => void;
}

export const TutorialIndicator: React.FC<TutorialIndicatorProps> = ({
  total,
  current,
  onPress,
}) => {
  return (
    <View style={styles.container}>
      {Array.from({ length: total }).map((_, index) => (
        <Pressable
          key={index}
          onPress={() => onPress?.(index)}
          style={[styles.dot, current === index && styles.dotActive]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: RFValue(8),
    paddingVertical: RFValue(16),
  },
  dot: {
    width: RFValue(8),
    height: RFValue(8),
    borderRadius: RFValue(4),
    backgroundColor: color.gray + "40",
  },
  dotActive: {
    backgroundColor: color.secondary,
    width: RFValue(24),
  },
});

export default TutorialIndicator;
