// app/(public)/forgot-password/index.tsx
import React, { useState } from "react";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from "react-native";
import {
  TextInput,
  Button,
  Text,
  HelperText,
} from "react-native-paper";
import { BackButtonHeader, AuthHeader } from "@/common/components/header";
import { useRouter } from "expo-router";
import { RFValue } from "react-native-responsive-fontsize";
import { color } from "@/common/styles/color";
import { useReissuePasswordMutation } from "@/domain/auth/hooks/mutations/useAuthMutation";
import path from "@/common/constants/path";

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { mutate: reissuePassword } = useReissuePasswordMutation();

  const handleReissuePassword = async () => {
    if (email.trim() === "") {
      setError("이메일을 입력해주세요.");
      return;
    }

    // 간단한 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("유효한 이메일 형식이 아닙니다.");
      return;
    }

    setError(null);
    setIsLoading(true);
    reissuePassword(
      { email },
      {
        onSuccess: (data) => {
          // 성공 시 로그인 화면으로 이동
          setTimeout(() => {
            router.back();
          }, 2000);
        },
        onError: (error) => {
          setError(error?.message || "임시 비밀번호 발급에 실패했습니다.");
        },
        onSettled: () => {
          setIsLoading(false);
        },
      }
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <BackButtonHeader disabled={isLoading} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        {/* 전체 콘텐츠 영역 */}
        <View style={styles.content}>
          {/* 상단 헤더 */}
          <AuthHeader
            icon="lock-reset"
            title="비밀번호 찾기"
            description={`가입하신 이메일 주소를 입력해주세요.\n임시 비밀번호를 발급해드립니다.`}
          />

          {/* 입력 폼 영역 */}
          <View style={styles.formContainer}>
            <TextInput
              label="이메일"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              mode="outlined"
              keyboardType="email-address"
              autoCapitalize="none"
              disabled={isLoading}
              left={<TextInput.Icon icon="email-outline" />}
            />

            <HelperText type="error" visible={!!error} style={styles.errorText}>
              {error}
            </HelperText>
          </View>

          {/* 하단 액션 버튼 영역 */}
          <View style={styles.actionContainer}>
            <Button
              mode="contained"
              onPress={handleReissuePassword}
              style={styles.button}
              labelStyle={styles.buttonLabel}
              disabled={isLoading}
              loading={isLoading}
              icon="send"
              uppercase={false}
              contentStyle={styles.buttonContent}
            >
              {isLoading ? "전송 중..." : "임시 비밀번호 발급"}
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
    backgroundColor: color.white,
  },
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: RFValue(24),
    justifyContent: "space-between",
  },
  formContainer: {
    flexGrow: 1,
    justifyContent: "flex-start",
    paddingTop: RFValue(20),
    paddingBottom: RFValue(20),
  },
  input: {
    marginBottom: RFValue(16),
    backgroundColor: color.white,
  },
  errorText: {
    fontSize: RFValue(13),
    textAlign: "left",
    marginBottom: RFValue(5),
    paddingHorizontal: RFValue(5),
  },
  actionContainer: {
    paddingBottom: RFValue(10),
  },
  button: {
    borderRadius: RFValue(30),
  },
  buttonLabel: {
    fontSize: RFValue(16),
    fontWeight: "bold",
    lineHeight: RFValue(20),
  },
  buttonContent: {
    paddingVertical: RFValue(8),
  },
});
