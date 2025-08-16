import React from "react";
import { View, Keyboard, StyleSheet } from "react-native";
import {
  TextInput,
  Button,
  HelperText,
  Text,
  ActivityIndicator,
} from "react-native-paper";
import { validateEmail } from "@/common/services/email/emailService";
import { RFValue } from "react-native-responsive-fontsize";
import {
  useOtpEmailRequestMutation,
  useOtpVerifyMutation,
} from "@/domain/auth/hooks/mutations/useAuthMutation";
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
  isSubmitting,
}) => {
  const { mutate: requestEmailOtp } = useOtpEmailRequestMutation();
  const { mutate: verifyOtp } = useOtpVerifyMutation();
  const handleSendOtp = async () => {
    Keyboard.dismiss();
    if (!validateEmail(email)) {
      setEmailError("올바른 이메일 형식이 아닙니다.");
      return;
    }
    setEmailError("");
    setIsSendingOtp(true);
    requestEmailOtp(email, {
      onSuccess: () => {
        setIsOtpSent(true);
        setIsSendingOtp(false);
      },
      onError: () => {
        setIsSendingOtp(false);
      },
    });
  };

  const handleVerifyOtpAndGoToPassword = async () => {
    Keyboard.dismiss();
    if (otp.length !== 6) {
      setOtpError("인증번호 6자리를 입력해주세요.");
      return;
    }
    setOtpError("");
    setIsVerifyingOtp(true);
    verifyOtp(
      { email, otp },
      {
        onSuccess: () => {
          onNext();
          setIsVerifyingOtp(false);
        },
        onError: () => {
          setIsVerifyingOtp(false);
        },
      }
    );
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
          theme={{
            fonts: {
              bodyLarge: { fontSize: RFValue(16) },
            },
          }}
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
      <HelperText type="error" visible={!!emailError} style={styles.helperText}>
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
            theme={{
              fonts: {
                bodyLarge: { fontSize: RFValue(16) },
              },
            }}
          />
          <HelperText
            type="error"
            visible={!!otpError}
            style={styles.helperText}
          >
            {otpError}
          </HelperText>
          <View style={styles.buttonContainer}>
            <Button
              mode="contained"
              onPress={handleVerifyOtpAndGoToPassword}
              style={styles.button}
              labelStyle={styles.buttonLabel}
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
  emailContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  emailInput: {
    flex: 1,
    marginRight: RFValue(8),
    marginBottom: 0,
  },
  sendOtpButton: {
    height: RFValue(50),
    justifyContent: "center",
  },
});

export default EmailStep;
