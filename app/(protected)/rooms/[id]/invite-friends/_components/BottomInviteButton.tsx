import React from "react";
import { StyleSheet, View } from "react-native";
import { Button } from "react-native-paper";
import { RFValue } from "react-native-responsive-fontsize";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { backgroundColor, color } from "@/common/styles/color";

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
  const isDisabled = selectedCount === 0 || isLoading;

  return (
    <View style={styles.container}>
      <Button
        mode="contained"
        onPress={onPress}
        disabled={isDisabled}
        loading={isLoading}
        buttonColor={color.secondary}
        style={[styles.button, isDisabled && styles.buttonDisabled]}
        labelStyle={styles.buttonLabel}
        uppercase={false}
        icon={() =>
          !isLoading && (
            <MaterialCommunityIcons
              name="account-multiple-plus"
              size={RFValue(20)}
              color={color.white}
            />
          )
        }
      >
        {isLoading ? "초대 중..." : `기도방 초대 (${selectedCount}명)`}
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: backgroundColor.white,
    width: "100%",
    height: "100%",
  },
  button: {
    borderRadius: RFValue(30),
    width: "70%",
    paddingVertical: RFValue(5),
  },
  buttonDisabled: {
    backgroundColor: "#CCCCCC",
  },
  buttonLabel: {
    fontSize: RFValue(16),
    fontWeight: "500",
    lineHeight: RFValue(22),
  },
});
