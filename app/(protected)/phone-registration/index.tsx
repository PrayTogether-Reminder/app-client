import React, { useState } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from "react-native";
import {
  TextInput,
  Button,
  Text,
  HelperText,
} from "react-native-paper";
import { useRouter } from "expo-router";
import { RFValue } from "react-native-responsive-fontsize";
import { color, backgroundColor } from "@/common/styles/color";
import { useUpdateProfileMutation } from "@/domain/members/hooks/mutations/memberMutations";
import path from "@/common/constants/path";

export default function PhoneRegistrationScreen() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");
  const { mutate: updateProfile, isPending } = useUpdateProfileMutation();

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
    setError("");
  };

  const validatePhoneNumber = () => {
    const phoneRegex = /^010-\d{4}-\d{4}$/;
    if (!phoneRegex.test(phoneNumber)) {
      setError("올바른 전화번호 형식이 아니에요 (010-0000-0000)");
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    Keyboard.dismiss();

    if (!validatePhoneNumber()) {
      return;
    }

    updateProfile(
      { phoneNumber },
      {
        onSuccess: () => {
          // 전화번호 등록 완료 후 기도방 목록 화면으로 이동
          router.replace(path.showRoomList());
        },
        onError: () => {
          setError("전화번호 등록 중 오류가 발생했어요. 다시 시도해주세요.");
        },
      }
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <View style={styles.content}>
          {/* 상단 헤더 */}
          <View style={styles.headerContainer}>
            <Text variant="headlineMedium" style={styles.title}>
              안녕하세요 😃
            </Text>
            <Text style={styles.description}>
              기도방 초대를 더욱 쉽게 하기 위해{"\n"}
              기도자님의 전화번호가 필요해요.{"\n\n"}
              <Text style={styles.highlight}>동명이인을 구분하기 위한 목적으로만 사용</Text>되며,{"\n"}
              전화번호 뒷자리 4자리만{"\n"}
              다른 사용자에게 공개돼요 😊{"\n\n"}
              소중한 개인정보는 안전하게 보호됩니다.
            </Text>
          </View>

          {/* 입력 폼 영역 */}
          <View style={styles.formContainer}>
            <TextInput
              label="전화번호"
              value={phoneNumber}
              onChangeText={handlePhoneNumberChange}
              placeholder="010-0000-0000"
              keyboardType="phone-pad"
              mode="outlined"
              style={styles.input}
              maxLength={13}
              error={!!error}
              disabled={isPending}
              left={<TextInput.Icon icon="cellphone" />}
              theme={{
                fonts: {
                  bodyLarge: { fontSize: RFValue(16) },
                },
              }}
            />
            <HelperText type="error" visible={!!error} style={styles.errorText}>
              {error}
            </HelperText>
          </View>

          {/* 하단 액션 버튼 영역 */}
          <View style={styles.actionContainer}>
            <Button
              mode="contained"
              onPress={handleSubmit}
              style={styles.button}
              labelStyle={styles.buttonLabel}
              disabled={isPending || phoneNumber.length === 0}
              loading={isPending}
              uppercase={false}
              contentStyle={styles.buttonContent}
            >
              {isPending ? "등록 중..." : "다음"}
            </Button>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: backgroundColor.default,
  },
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: RFValue(20),
    justifyContent: "space-between",
  },
  headerContainer: {
    alignItems: "center",
    marginTop: RFValue(40),
    marginBottom: RFValue(20),
  },
  title: {
    fontSize: RFValue(22),
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
    lineHeight: RFValue(28),
    marginBottom: RFValue(16),
  },
  description: {
    fontSize: RFValue(15),
    color: "#666",
    textAlign: "center",
    lineHeight: RFValue(22),
  },
  highlight: {
    fontWeight: "bold",
    color: color.secondary,
  },
  formContainer: {
    flexGrow: 1,
    justifyContent: "flex-start",
    paddingTop: RFValue(8),
    paddingBottom: RFValue(20),
  },
  input: {
    marginBottom: RFValue(8),
    backgroundColor: color.white,
    fontSize: RFValue(16),
  },
  errorText: {
    fontSize: RFValue(14),
    textAlign: "left",
    paddingHorizontal: RFValue(5),
  },
  actionContainer: {
    paddingBottom: RFValue(10),
  },
  button: {
    height: RFValue(50),
  },
  buttonLabel: {
    fontSize: RFValue(18),
    lineHeight: RFValue(24),
  },
  buttonContent: {
    height: "100%",
  },
});
