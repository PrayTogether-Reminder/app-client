import React from "react";
import { StyleSheet } from "react-native";
import { Surface, Button, useTheme } from "react-native-paper";
import { RFValue } from "react-native-responsive-fontsize";
import { color } from "../../../common/styles/color";
import { useRouter } from "expo-router";
import path from "../../../common/constants/path";

interface PrayerReadBottomProps {}

const PrayerReadBottom: React.FC<PrayerReadBottomProps> = ({}) => {
  const router = useRouter();
  const handlePress = () => {
    // router.push(path.showPrayerCreate());
  };

  return (
    <Surface style={styles.bottomButtonContainer}>
      <Button
        mode="contained"
        uppercase={false}
        style={styles.bottomButton}
        labelStyle={styles.bottomButtonText}
        icon="bell"
        onPress={handlePress}
      >
        기도 알림
      </Button>
    </Surface>
  );
};

const styles = StyleSheet.create({
  bottomButtonContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  bottomButton: {
    borderRadius: 30,
    width: "70%",
    paddingVertical: 5,
    backgroundColor: color.secondary,
  },
  bottomButtonText: {
    fontSize: RFValue(16),
    fontWeight: "500",
  },
});

export default PrayerReadBottom;
