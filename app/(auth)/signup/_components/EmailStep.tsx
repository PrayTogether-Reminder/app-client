import React from "react";
import { View, Keyboard, StyleSheet } from "react-native";
import {
  TextInput,
  Button,
  HelperText,
  Text,
  ActivityIndicator,
} from "react-native-paper";

// API 호출 모의 함수
const fakeApiCall = (delay = 1000) =>
  new Promise((resolve) => setTimeout(resolve, delay));

// 이메일 유효성 검사 함수
const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export interface EmailStepProps {
  email: string;
  setEmail: (email: string) => void;
  emailError: string;
  setEmailError: (error: string) => void;
  otp: string;
  setOtp: (otp: string) => void;
  otpError: string;
  setOtpError: (error: string) => void;
  isOtpSent: boolean;
  setIsOtpSent: (sent: boolean) => void;
  isSendingOtp: boolean;
  setIsSendingOtp: (sending: boolean) => void;
  isVerifyingOtp: boolean;
  setIsVerifyingOtp: (verifying: boolean) => void;
  onNext: () => void;
  onBack: () => void;
  isSubmitting: boolean;
}

const EmailStep: React.FC<EmailStepProps> = ({
  email,
  setEmail,
  emailError,
  setEmailError,
  otp,
  setOtp,
  otpError,
  setOtpError,
  isOtpSent,
  setIsOtpSent,
  isSendingOtp,
  setIsSendingOtp,
  isVerifyingOtp,
  setIsVerifyingOtp,
  onNext,
  onBack,
  isSubmitting,
}) => {
  const handleSendOtp = async () => {
    Keyboard.dismiss();
    if (!isValidEmail(email)) {
      setEmailError("올바른 이메일 형식이 아닙니다.");
      return;
    }
    setEmailError("");
    setIsSendingOtp(true);
    try {
      await fakeApiCall();
      setIsOtpSent(true);
    } catch (error) {
      console.error("OTP 발송 실패:", error);
      setEmailError("OTP 발송 중 오류가 발생했습니다.");
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOtpAndGoToPassword = async () => {
    Keyboard.dismiss();
    if (otp.length !== 6) {
      setOtpError("인증번호 6자리를 입력해주세요.");
      return;
    }
    setOtpError("");
    setIsVerifyingOtp(true);
    try {
      await fakeApiCall();
      const isOtpValid = true; // 실제로는 API 응답에 따라 결정
      if (isOtpValid) {
        onNext();
      } else {
        setOtpError("인증번호가 올바르지 않습니다.");
      }
    } catch (error) {
      console.error("OTP 검증 실패:", error);
      setOtpError("OTP 검증 중 오류가 발생했습니다.");
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  return (
    <View style={styles.page}>
      <Text variant="titleLarge" style={styles.stepTitle}>
        이메일 인증
      </Text>
      <View style={styles.emailContainer}>
        <TextInput
          label="이메일 주소"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            if (emailError) setEmailError("");
          }}
          mode="outlined"
          keyboardType="email-address"
          autoCapitalize="none"
          style={[styles.input, styles.emailInput]}
          error={!!emailError}
          disabled={isOtpSent || isSendingOtp || isVerifyingOtp || isSubmitting}
        />
        <Button
          mode="contained"
          onPress={handleSendOtp}
          style={styles.sendOtpButton}
          disabled={
            !email ||
            !!emailError ||
            isSendingOtp ||
            isVerifyingOtp ||
            isSubmitting
          }
          loading={isSendingOtp}
        >
          {isOtpSent ? "재전송" : "인증 요청"}
        </Button>
      </View>
      <HelperText type="error" visible={!!emailError}>
        {emailError}
      </HelperText>

      {isOtpSent && (
        <>
          <TextInput
            label="인증번호 (6자리)"
            value={otp}
            onChangeText={(text) => {
              setOtp(text);
              if (otpError) setOtpError("");
            }}
            mode="outlined"
            keyboardType="number-pad"
            maxLength={6}
            style={styles.input}
            error={!!otpError}
            disabled={isVerifyingOtp || isSubmitting}
          />
          <HelperText type="error" visible={!!otpError}>
            {otpError}
          </HelperText>
          <View style={styles.buttonContainer}>
            <Button
              mode="outlined"
              onPress={onBack}
              style={[styles.button, styles.backButton]}
              disabled={isVerifyingOtp || isSubmitting}
              icon="arrow-left"
            >
              이전
            </Button>
            <Button
              mode="contained"
              onPress={handleVerifyOtpAndGoToPassword}
              style={styles.button}
              disabled={
                !otp || otp.length !== 6 || isVerifyingOtp || isSubmitting
              }
              loading={isVerifyingOtp}
            >
              인증 및 다음
            </Button>
          </View>
        </>
      )}
      {!isOtpSent && (
        <View style={styles.buttonContainer}>
          <Button
            mode="outlined"
            onPress={onBack}
            style={[styles.button, styles.backButton]}
            disabled={isSendingOtp || isSubmitting}
            icon="arrow-left"
          >
            이전
          </Button>
          <View style={styles.button} />
        </View>
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
  emailContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  emailInput: {
    flex: 1,
    marginRight: 8,
    marginBottom: 0,
  },
  sendOtpButton: {
    marginTop: 8,
    height: 50,
    justifyContent: "center",
  },
});

export default EmailStep;
