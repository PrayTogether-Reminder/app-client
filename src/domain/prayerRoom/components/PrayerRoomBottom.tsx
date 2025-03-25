import React from "react";
import { StyleSheet } from "react-native";
import { Surface, Button, useTheme } from "react-native-paper";
import { RFValue } from "react-native-responsive-fontsize";
import { color } from "../../../common/styles/color";
import { useRouter } from "expo-router";
import path from "../../../common/constants/path";

interface PrayerRoomBottomButtonProps {}

const PrayerRoomBottomButton: React.FC<PrayerRoomBottomButtonProps> = ({}) => {
  const router = useRouter();
  const handlePress = () => {
    router.push(path.showPrayersCreate());
  };

  return (
    <Surface style={styles.bottomButtonContainer}>
      <Button
        mode="contained"
        uppercase={false}
        style={styles.bottomButton}
        labelStyle={styles.bottomButtonText}
        icon="pencil"
        onPress={handlePress}
      >
        기도제목 작성하기
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

export default PrayerRoomBottomButton;
