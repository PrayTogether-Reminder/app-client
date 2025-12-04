// app/(auth)/login.tsx
import React, { useState } from "react";
import {
  View,
  StyleSheet,
} from "react-native";
import {
  TextInput,
  Text,
  HelperText,
} from "react-native-paper";
import { AuthHeader } from "@/common/components/header";
import { PrimaryButton, TextButton } from "@/common/components/button";
import { ScreenLayout } from "@/common/components/layout";
import { useRouter } from "expo-router";
import { RFValue } from "react-native-responsive-fontsize";
import { color } from "@/common/styles/color";
import { useLoginMutation } from "@/domain/auth/hooks/mutations/useAuthMutation";
import path from "@/common/constants/path";
import { useAuthStore } from "@/domain/auth/stores/useAuthStore";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { mutate: loginRequest } = useLoginMutation();
  const { login: setLoginState } = useAuthStore();

  const handleLogin = async () => {
    if (email.trim() === "" || password.trim() === "") {
      setError("이메일 혹은 비밀번호를 입력해주세요.");
      return;
    }

    setError(null);
    setIsLoading(true);
    loginRequest(
      { email, password },
      {
        onSuccess: (data) => {
          if (data === null || data === undefined) {
            setError("로그인에 실패했습니다.");
            return;
          }
          setLoginState(data.accessToken, data.refreshToken);
          router.replace(path.showRoomList()); // 로그인 성공 시 홈 화면으로 이동
        },
        onError: (error) => {
          setError(error?.message || "로그인에 실패했습니다.");
        },
        onSettled: () => {
          setIsLoading(false);
        },
      }
    );
  };

  return (
    <ScreenLayout backButtonDisabled={isLoading}>
      {/* 상단 헤더 */}
      <AuthHeader icon="login" title="로그인" />

      {/* 입력 폼 영역 (이 영역이 남는 공간을 채움) */}
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

            <TextInput
              label="비밀번호"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!isPasswordVisible}
              style={styles.input}
              mode="outlined"
              disabled={isLoading}
              left={<TextInput.Icon icon="lock-outline" />}
              right={
                <TextInput.Icon
                  icon={isPasswordVisible ? "eye-off-outline" : "eye-outline"}
                  onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                  forceTextInputFocus={false}
                />
              }
            />

            <HelperText type="error" visible={!!error} style={styles.errorText}>
              {error}
            </HelperText>
          </View>

          {/* 하단 액션 버튼 영역 */}
          <View style={styles.actionContainer}>
            <PrimaryButton
              onPress={handleLogin}
              disabled={isLoading}
              loading={isLoading}
              icon="arrow-right"
            >
              {isLoading ? "로그인 중..." : "로그인"}
            </PrimaryButton>

            <TextButton
              onPress={() => router.push(path.showSignup())}
              disabled={isLoading}
              fullWidth
              style={styles.switchButton}
            >
              계정이 없으신가요?{" "}
              <Text style={styles.switchButtonHighlight}>회원가입</Text>
            </TextButton>

            <TextButton
              onPress={() => router.push(path.showForgotPassword())}
              disabled={isLoading}
              fullWidth
              size="small"
            >
              <Text style={styles.forgotPasswordText}>비밀번호를 잊으셨나요?</Text>
            </TextButton>
          </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    flexGrow: 1, // 사용 가능한 추가 공간 차지
    justifyContent: "flex-start", // 상단 정렬로 변경 (원래 center)
    paddingTop: RFValue(20), // 상단에 패딩 추가
    paddingBottom: RFValue(20), // 액션 버튼 영역과의 최소 간격 확보
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
  // actionContainer는 아래쪽에 위치
  actionContainer: {
    // paddingBottom: RFValue(5), // 화면 하단과의 여백
  },
  switchButton: {
    marginTop: RFValue(15),
  },
  switchButtonHighlight: {
    fontWeight: "bold",
    color: color.secondary,
  },
  forgotPasswordText: {
    color: color.secondary,
    textDecorationLine: "underline",
  },
});
