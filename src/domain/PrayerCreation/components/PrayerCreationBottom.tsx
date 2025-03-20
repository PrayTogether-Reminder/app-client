import React from "react";
import { StyleSheet } from "react-native";
import { Surface, Button, useTheme } from "react-native-paper";
import { RFValue } from "react-native-responsive-fontsize";
import { color } from "../../../common/styles/color";
import { useRouter } from "expo-router";
import path from "../../../common/constants/path";

interface PrayerCreationBottomProps {
  disabled: boolean;
}

const PrayerCreationBottom: React.FC<PrayerCreationBottomProps> = ({
  disabled,
}) => {
  const router = useRouter();
  const handlePress = () => {
    router.push(path.showPrayerCreate());
  };

  // 기도 내용 전체 저장(API 요청)
  const createPrayer = () => {
    // 여기서 실제 저장 로직 구현
    // API 호출이나 store 업데이트 등을 수행

    // 저장 후 이전 화면으로 돌아가기
    router.back();
  };

  return (
    <Surface style={styles.container}>
      <Button
        mode="contained"
        uppercase={false}
        style={[styles.button, disabled && styles.button_disabled]}
        labelStyle={styles.buttonText}
        icon="content-save-all"
        onPress={createPrayer}
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
  button_disabled: {
    backgroundColor: color.gray,
  },
  buttonText: {
    fontSize: RFValue(16),
    fontWeight: "500",
    color: color.white,
  },
});

export default PrayerCreationBottom;
