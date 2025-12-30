import React from "react";
import { StyleSheet, TouchableOpacity, Text } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { RFValue } from "react-native-responsive-fontsize";
import { color } from "@/common/styles/color";
import { useGoogleSignIn } from "@/domain/auth/hooks/mutations/useGoogleSignIn";
import { AntDesign } from "@expo/vector-icons";
import { Analytics } from "@/common/services/analytics";

interface GoogleSignInButtonProps {
  disabled?: boolean;
}

/**
 * Google 로그인 버튼 컴포넌트
 * - 비즈니스 로직은 useGoogleSignIn 훅에서 처리
 */
export const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({
  disabled = false,
}) => {
  const { isLoading, handleGoogleSignIn } = useGoogleSignIn({ disabled });

  const handlePress = () => {
    Analytics.logGoogleSignInClicked();
    handleGoogleSignIn();
  };

  return (
    <TouchableOpacity
      style={[styles.button, (disabled || isLoading) && styles.buttonDisabled]}
      onPress={handlePress}
      disabled={disabled || isLoading}
      activeOpacity={0.7}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color={color.gray} />
      ) : (
        <>
          <AntDesign
            name="google"
            size={RFValue(20)}
            color="#4285F4"
            style={styles.icon}
          />
          <Text style={styles.text}>Google로 계속하기</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: color.white,
    borderWidth: 1,
    borderColor: color.grayDark,
    borderRadius: RFValue(8),
    paddingVertical: RFValue(12),
    paddingHorizontal: RFValue(16),
    marginVertical: RFValue(8),
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  icon: {
    marginRight: RFValue(12),
  },
  text: {
    fontSize: RFValue(14),
    fontWeight: "500",
    color: color.dark,
  },
});
