import React from "react";
import { View, StyleSheet } from "react-native";
import {
  TextInput,
  Button,
  HelperText,
  Text,
  ActivityIndicator,
} from "react-native-paper";
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
  passwordVisible: boolean;
  setPasswordVisible: (visible: boolean) => void;
  confirmPasswordVisible: boolean;
  setConfirmPasswordVisible: (visible: boolean) => void;
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
  passwordVisible,
  setPasswordVisible,
  confirmPasswordVisible,
  setConfirmPasswordVisible,
  onSubmit,
  isSubmitting,
}) => {
  const router = useRouter();
  const handleSignupComplete = async () => {
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
      <TextInput
        label="비밀번호 (8자 이상, 15자 이하)"
        value={password}
        onChangeText={(text) => {
          setPassword(text);
          if (passwordError) setPasswordError("");
        }}
        mode="outlined"
        secureTextEntry={!passwordVisible}
        style={styles.input}
        error={!!passwordError}
        disabled={isSubmitting}
        theme={{
          fonts: {
            bodyLarge: { fontSize: RFValue(16) },
          },
        }}
        right={
          <TextInput.Icon
            icon={passwordVisible ? "eye-off" : "eye"}
            onPress={() => setPasswordVisible(!passwordVisible)}
          />
        }
      />
      <TextInput
        label="비밀번호 확인"
        value={confirmPassword}
        onChangeText={(text) => {
          setConfirmPassword(text);
          if (passwordError) setPasswordError("");
        }}
        mode="outlined"
        secureTextEntry={!confirmPasswordVisible}
        style={styles.input}
        error={!!passwordError}
        disabled={isSubmitting}
        theme={{
          fonts: {
            bodyLarge: { fontSize: RFValue(16) },
          },
        }}
        right={
          <TextInput.Icon
            icon={confirmPasswordVisible ? "eye-off" : "eye"}
            onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
          />
        }
      />
      <HelperText
        type="error"
        visible={!!passwordError}
        style={styles.helperText}
      >
        {passwordError}
      </HelperText>
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
  input: {
    marginBottom: RFValue(8),
    fontSize: RFValue(16),
  },
  helperText: {
    fontSize: RFValue(14),
  },
  buttonContainer: {
    height: RFValue(50),
    justifyContent: "center",
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
