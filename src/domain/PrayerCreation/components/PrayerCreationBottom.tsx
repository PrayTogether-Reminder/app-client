import React from "react";
import { StyleSheet } from "react-native";
import { Surface, Button, useTheme } from "react-native-paper";
import { RFValue } from "react-native-responsive-fontsize";
import { color } from "../../../common/styles/color";
import { useRouter } from "expo-router";
import path from "../../../common/constants/path";

interface PrayerCreationBottomProps {
  onSave: () => void;
  disabled: boolean;
}

const PrayerCreationBottom: React.FC<PrayerCreationBottomProps> = ({
  onSave,
  disabled,
}) => {
  const router = useRouter();
  const handlePress = () => {
    router.push(path.showPrayerCreate());
  };

  return (
    <Surface style={styles.container}>
      <Button
        mode="contained"
        uppercase={false}
        style={[styles.button, disabled && styles.buttonDisabled]}
        labelStyle={styles.buttonText}
        icon="content-save-all"
        onPress={onSave}
        disabled={disabled}
      >
        모두 저장하기
      </Button>
    </Surface>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    borderRadius: 30,
    width: "70%",
    paddingVertical: 5,
    backgroundColor: color.secondary,
  },
  buttonDisabled: {
    backgroundColor: color.gray,
  },
  buttonText: {
    fontSize: RFValue(16),
    fontWeight: "500",
    color: color.white,
  },
});

export default PrayerCreationBottom;
