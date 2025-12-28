import React from "react";
import { View, Keyboard, StyleSheet, TouchableWithoutFeedback } from "react-native";
import { TextInput, Button, HelperText, Text } from "react-native-paper";
import { RFValue } from "react-native-responsive-fontsize";
import { Analytics } from "@/common/services/analytics";

export interface PhoneStepProps {
  phoneNumber: string;
  setPhoneNumber: (phoneNumber: string) => void;
  phoneError: string;
  setPhoneError: (error: string) => void;
  onNext: () => void;
  isSubmitting: boolean;
}

const PhoneStep: React.FC<PhoneStepProps> = ({
  phoneNumber,
  setPhoneNumber,
  phoneError,
  setPhoneError,
  onNext,
  isSubmitting,
}) => {
  // 전화번호 포맷팅 (010-0000-0000)
  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/[^\d]/g, "");

    if (numbers.length <= 3) {
      return numbers;
    } else if (numbers.length <= 7) {
      return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    } else {
      return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
    }
  };

  const handlePhoneNumberChange = (value: string) => {
    const formatted = formatPhoneNumber(value);
    setPhoneNumber(formatted);
    if (phoneError) setPhoneError("");
  };

  const validatePhoneNumber = () => {
    const phoneRegex = /^010-\d{4}-\d{4}$/;
    if (!phoneRegex.test(phoneNumber)) {
      setPhoneError("올바른 전화번호 형식이 아니에요 (010-0000-0000)");
      return false;
    }
    return true;
  };

  const handleNext = () => {
    Keyboard.dismiss();

    if (!validatePhoneNumber()) {
      return;
    }

    Analytics.logSignUpPhoneCompleted(); // 전화번호 입력 완료 이벤트
    onNext();
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.page}>
        <Text variant="titleLarge" style={styles.stepTitle}>
          전화번호 입력
        </Text>
        <Text style={styles.description}>
          동명이인을 구분하기 위해 전화번호가 필요해요.{"\n"}
          전화번호 뒷자리 4자리만 다른 사용자에게 공개돼요 😊
        </Text>
        <TextInput
          label="전화번호"
          value={phoneNumber}
          onChangeText={handlePhoneNumberChange}
          placeholder="010-0000-0000"
          keyboardType="phone-pad"
          mode="outlined"
          style={styles.input}
          maxLength={13}
          error={!!phoneError}
          disabled={isSubmitting}
          returnKeyType="done"
          onSubmitEditing={handleNext}
          left={<TextInput.Icon icon="cellphone" />}
          theme={{
            fonts: {
              bodyLarge: { fontSize: RFValue(16) },
            },
          }}
        />
        <HelperText type="error" visible={!!phoneError} style={styles.helperText}>
          {phoneError}
        </HelperText>

        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={handleNext}
            style={styles.button}
            labelStyle={styles.buttonLabel}
            disabled={!phoneNumber || isSubmitting}
          >
            다음
          </Button>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
    padding: RFValue(20),
  },
  stepTitle: {
    marginBottom: RFValue(12),
    textAlign: "center",
    fontWeight: "bold",
    fontSize: RFValue(22),
    lineHeight: RFValue(28),
  },
  description: {
    marginBottom: RFValue(20),
    textAlign: "center",
    fontSize: RFValue(14),
    color: "#666",
    lineHeight: RFValue(20),
  },
  input: {
    fontSize: RFValue(16),
    marginBottom: RFValue(8),
  },
  helperText: {
    fontSize: RFValue(14),
  },
  buttonContainer: {
    height: RFValue(50),
    justifyContent: "center",
    marginTop: "auto",
  },
  button: {
    height: "100%",
  },
  buttonLabel: {
    fontSize: RFValue(22),
    lineHeight: RFValue(28),
  },
});

export default PhoneStep;
