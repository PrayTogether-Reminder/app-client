import React from "react";
import { View, StyleSheet } from "react-native";
import {
  Button,
  Text,
  ActivityIndicator,
} from "react-native-paper";
import { FormInput } from "@/common/components/form";
import { RFValue } from "react-native-responsive-fontsize";
import path from "@/common/constants/path";
import { useRouter } from "expo-router";

export interface PasswordStepProps {
  password: string;
  setPassword: (password: string) => void;
  confirmPassword: string;
  setConfirmPassword: (confirmPassword: string) => void;
  passwordError: string;
  setPasswordError: (error: string) => void;
  onSubmit: () => Promise<Boolean>;
  isSubmitting: boolean;
}

const PasswordStep: React.FC<PasswordStepProps> = ({
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  passwordError,
  setPasswordError,
  onSubmit,
  isSubmitting,
}) => {
  const router = useRouter();

  console.log('[PasswordStep] 렌더링 - password:', password, 'confirmPassword:', confirmPassword, 'isSubmitting:', isSubmitting);

  const handleSignupComplete = async () => {
    console.log('[PasswordStep] handleSignupComplete 호출');
    const isSuccess = await onSubmit();

    if (isSuccess) {
      router.replace(path.showLogin());
    }
  };
  return (
    <View style={styles.page}>
      <Text variant="titleLarge" style={styles.stepTitle}>
        비밀번호 설정
      </Text>
      <FormInput
        label="비밀번호 (8자 이상, 15자 이하)"
        value={password}
        onChangeText={(text) => {
          setPassword(text);
          if (passwordError) setPasswordError("");
        }}
        type="password"
        disabled={isSubmitting}
        icon="lock-outline"
      />
      <FormInput
        label="비밀번호 확인"
        value={confirmPassword}
        onChangeText={(text) => {
          setConfirmPassword(text);
          if (passwordError) setPasswordError("");
        }}
        type="password"
        disabled={isSubmitting}
        icon="lock-check-outline"
        error={passwordError || undefined}
      />
      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={handleSignupComplete}
          style={styles.button}
          labelStyle={styles.buttonLabel}
          disabled={
            !password || !confirmPassword || !!passwordError || isSubmitting
          }
          loading={isSubmitting}
        >
          가입 완료
        </Button>
      </View>
      {isSubmitting && (
        <ActivityIndicator animating={true} style={styles.loadingIndicator} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
    padding: RFValue(20),
  },
  stepTitle: {
    marginBottom: RFValue(16),
    textAlign: "center",
    fontWeight: "bold",
    fontSize: RFValue(22),
    lineHeight: RFValue(28),
  },
  buttonContainer: {
    height: RFValue(50),
    justifyContent: "center",
    marginTop: RFValue(24),
  },
  button: {
    height: "100%",
  },
  buttonLabel: {
    fontSize: RFValue(18),
    lineHeight: RFValue(24),
  },
  loadingIndicator: {
    marginTop: RFValue(20),
  },
});

export default PasswordStep;
