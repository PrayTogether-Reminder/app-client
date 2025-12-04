// app/(auth)/login.tsx
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
  ActivityIndicator,
  Avatar,
} from "react-native-paper";
import { BackButtonHeader } from "@/common/components/header";
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
    <SafeAreaView style={styles.safeArea}>
      <BackButtonHeader disabled={isLoading} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        {/* 전체 콘텐츠 영역 */}
        <View style={styles.content}>
          {/* 상단 헤더 (아이콘 + 제목) <- 지우거나, 다른 컨텐츠로 대체가 필요함. */}
          <View style={styles.headerContainer}>
            <Avatar.Icon
              size={RFValue(60)}
              icon="login"
              style={styles.headerIcon}
              color={color.primary}
            />
            <Text variant="headlineMedium" style={styles.title}>
              로그인
            </Text>
          </View>

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
            <Button
              mode="contained"
              onPress={handleLogin}
              style={styles.button}
              labelStyle={styles.buttonLabel}
              disabled={isLoading}
              loading={isLoading}
              icon="arrow-right"
              uppercase={false}
              contentStyle={styles.buttonContent}
            >
              {isLoading ? "로그인 중..." : "로그인"}
            </Button>

            <Button
              mode="text"
              onPress={() => router.push(path.showSignup())}
              style={styles.switchButton}
              disabled={isLoading}
              textColor={color.black}
              labelStyle={styles.switchButtonLabel}
            >
              계정이 없으신가요?{" "}
              <Text style={styles.switchButtonHighlight}>회원가입</Text>
            </Button>

            <Button
              mode="text"
              onPress={() => router.push(path.showForgotPassword())}
              style={styles.forgotPasswordButton}
              disabled={isLoading}
              textColor={color.black}
              labelStyle={styles.forgotPasswordLabel}
            >
              <Text style={styles.forgotPasswordText}>비밀번호를 잊으셨나요?</Text>
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
  // content가 전체 영역을 차지하고 내부에서 flex 배분
  content: {
    flex: 1,
    padding: RFValue(24),
    justifyContent: "space-between", // header, form, action 영역 분리
  },
  headerContainer: {
    alignItems: "center", // 아이콘, 타이틀 중앙 정렬
    marginBottom: RFValue(10),
  },
  headerIcon: {
    backgroundColor: "transparent",
    marginBottom: RFValue(10),
  },
  title: {
    fontSize: RFValue(26),
    fontWeight: "bold",
    textAlign: "center",
    color: color.primary,
    lineHeight: RFValue(32),
  },
  // formContainer가 늘어나서 actionContainer를 아래로 밀어냄
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
  switchButton: {
    marginTop: RFValue(15), // 로그인 버튼과의 간격
    // alignSelf: "center", // 중앙 정렬
    // justifyContent: "center", // 내부 텍스트 중앙 정렬
    width: "100%", // 전체 너비를 사용하여 텍스트 중앙 정렬
  },
  switchButtonLabel: {
    fontSize: RFValue(14),
    textAlign: "center", // 텍스트 중앙 정렬
    lineHeight: RFValue(18),
  },
  switchButtonHighlight: {
    fontWeight: "bold",
    color: color.secondary,
  },
  forgotPasswordButton: {
    width: "100%",
  },
  forgotPasswordLabel: {
    fontSize: RFValue(13),
    textAlign: "center",
    lineHeight: RFValue(18),
  },
  forgotPasswordText: {
    color: color.secondary,
    textDecorationLine: "underline",
  },
});
