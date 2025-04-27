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
  useTheme,
  Avatar,
} from "react-native-paper";
import { useRouter } from "expo-router";
import { RFValue } from "react-native-responsive-fontsize";
import { color } from "@/common/styles/color";

export default function LoginScreen() {
  const router = useRouter();
  const theme = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    setError(null);
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    if (email === "test@test.com" && password === "password") {
      console.log("Login successful");
      // router.replace('/(tabs)/');
    } else {
      setError("이메일 또는 비밀번호가 잘못되었습니다.");
    }
    setIsLoading(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        {/* 전체 콘텐츠 영역 */}
        <View style={styles.content}>
          {/* 상단 헤더 (아이콘 + 제목) */}
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
              onPress={() => router.push("/(auth)/signup")}
              style={styles.switchButton}
              disabled={isLoading}
              textColor={theme.colors.primary}
              labelStyle={styles.switchButtonLabel}
              uppercase={false}
            >
              계정이 없으신가요?{" "}
              <Text style={styles.switchButtonHighlight}>회원가입</Text>
            </Button>
            {/* 비밀번호 찾기 등 추가 링크 */}
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
    marginBottom: RFValue(30), // 폼과의 간격
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
  },
  // formContainer가 늘어나서 actionContainer를 아래로 밀어냄
  formContainer: {
    flexGrow: 1, // 사용 가능한 추가 공간 차지
    justifyContent: "center", // 입력 필드를 세로 중앙에 가깝게 배치 (조정 가능)
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
    paddingBottom: RFValue(10), // 화면 하단과의 여백
  },
  button: {
    // marginTop 제거 또는 조정
    borderRadius: RFValue(30),
  },
  buttonLabel: {
    fontSize: RFValue(16),
    fontWeight: "600",
  },
  buttonContent: {
    paddingVertical: RFValue(8),
  },
  switchButton: {
    marginTop: RFValue(15), // 로그인 버튼과의 간격
    alignSelf: "center",
  },
  switchButtonLabel: {
    fontSize: RFValue(14),
  },
  switchButtonHighlight: {
    fontWeight: "bold",
    color: color.primary,
  },
});
