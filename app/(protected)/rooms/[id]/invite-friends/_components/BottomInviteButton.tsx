import React from "react";
import { StyleSheet, View } from "react-native";
import { Button } from "react-native-paper";
import { RFValue } from "react-native-responsive-fontsize";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { color } from "@/common/styles/color";

interface BottomInviteButtonProps {
  selectedCount: number;
  onPress: () => void;
  isLoading: boolean;
}

export default function BottomInviteButton({
  selectedCount,
  onPress,
  isLoading,
}: BottomInviteButtonProps): React.ReactElement {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        { paddingBottom: Math.max(insets.bottom, RFValue(20)) },
      ]}
    >
      <Button
        mode="contained"
        onPress={onPress}
        disabled={selectedCount === 0 || isLoading}
        loading={isLoading}
        buttonColor={color.secondary}
        style={styles.button}
        labelStyle={styles.buttonLabel}
        contentStyle={styles.buttonContent}
      >
        친구 초대 ({selectedCount}명)
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: color.white,
    paddingHorizontal: RFValue(16),
    paddingTop: RFValue(12),
    borderTopWidth: 1,
    borderTopColor: color.light,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
  },
  button: {
    borderRadius: RFValue(8),
  },
  buttonLabel: {
    fontSize: RFValue(16),
    fontWeight: "bold",
    lineHeight: RFValue(22),
  },
  buttonContent: {
    paddingVertical: RFValue(8),
  },
});
