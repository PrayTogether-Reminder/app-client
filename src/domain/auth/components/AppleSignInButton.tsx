import React from "react";
import { StyleSheet, TouchableOpacity, Platform } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { RFValue } from "react-native-responsive-fontsize";
import { color } from "@/common/styles/color";
import { useAppleSignIn } from "@/domain/auth/hooks/mutations/useAppleSignIn";
import { AntDesign } from "@expo/vector-icons";
import { Analytics } from "@/common/services/analytics";

interface AppleSignInButtonProps {
  disabled?: boolean;
}

const BUTTON_SIZE = RFValue(50);

/**
 * Apple 로그인 버튼 컴포넌트 (원형 아이콘)
 * - iOS에서만 표시됨
 * - 비즈니스 로직은 useAppleSignIn 훅에서 처리
 */
export const AppleSignInButton: React.FC<AppleSignInButtonProps> = ({
  disabled = false,
}) => {
  const { isLoading, isAvailable, handleAppleSignIn } = useAppleSignIn({ disabled });

  // iOS가 아니거나 Apple 로그인을 지원하지 않는 경우 렌더링하지 않음
  if (Platform.OS !== "ios" || !isAvailable) {
    return null;
  }

  const handlePress = () => {
    Analytics.logAppleSignInClicked();
    handleAppleSignIn();
  };

  return (
    <TouchableOpacity
      style={[styles.button, (disabled || isLoading) && styles.buttonDisabled]}
      onPress={handlePress}
      disabled={disabled || isLoading}
      activeOpacity={0.7}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color={color.white} />
      ) : (
        <AntDesign
          name="apple1"
          size={RFValue(24)}
          color={color.white}
        />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: color.dark,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});
