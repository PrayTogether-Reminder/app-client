import React from "react";
import { View, StyleSheet } from "react-native";
import {
  TextInput,
  Button,
  HelperText,
  Text,
  ActivityIndicator,
} from "react-native-paper";

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
  onBack: () => void;
  onSubmit: () => void;
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
  onBack,
  onSubmit,
  isSubmitting,
}) => {
  return (
    <View style={styles.page}>
      <Text variant="titleLarge" style={styles.stepTitle}>
        비밀번호 설정
      </Text>
      <TextInput
        label="비밀번호 (8자 이상)"
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
        right={
          <TextInput.Icon
            icon={confirmPasswordVisible ? "eye-off" : "eye"}
            onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
          />
        }
      />
      <HelperText type="error" visible={!!passwordError}>
        {passwordError}
      </HelperText>
      <View style={styles.buttonContainer}>
        <Button
          mode="outlined"
          onPress={onBack}
          style={[styles.button, styles.backButton]}
          disabled={isSubmitting}
          icon="arrow-left"
        >
          이전
        </Button>
        <Button
          mode="contained"
          onPress={onSubmit}
          style={styles.button}
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
    padding: 20,
  },
  stepTitle: {
    marginBottom: 24,
    textAlign: "center",
    fontWeight: "bold",
  },
  input: {
    marginBottom: 8,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  button: {
    paddingVertical: 8,
    minWidth: "48%",
  },
  backButton: {
    // 이전 버튼에 대한 추가 스타일
  },
  loadingIndicator: {
    marginTop: 20,
  },
});

export default PasswordStep;
