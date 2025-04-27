// app/index.tsx (또는 앱의 가장 첫 진입점)
import React from "react";
import { View, StyleSheet, SafeAreaView } from "react-native";
import { Text, Button, useTheme, Avatar } from "react-native-paper";
import { useRouter } from "expo-router";
import { RFValue } from "react-native-responsive-fontsize";
import { color } from "@/common/styles/color";
import path from "@/common/constants/path";

export default function WelcomeScreen() {
  const theme = useTheme();
  const router = useRouter();

  const handleLoginPress = () => {
    router.push(path.showLogin()); // 로그인 화면으로 이동
  };

  const handleSignupPress = () => {
    router.push(path.showSignup()); // 회원가입 화면으로 이동
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: color.white }]}>
      <View style={styles.logoContainer}>
        {/* 앱 로고 또는 상징적 아이콘 */}
        <Avatar.Image
          size={RFValue(200)}
          source={require("../assets/main_logo.png")} // 로고 이미지
          style={[styles.logo, { backgroundColor: theme.colors.primary }]} // 테마 색상 활용
        />
      </View>

      {/* 슬로건 */}
      <View style={styles.slogonContainer}>
        <Text
          variant="titleLarge"
          style={[styles.slogan, { color: color.secondary }]}
        >
          마음을 나누고 기도로 응원하는 공간
        </Text>
      </View>

      {/* 버튼 영역 */}
      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={handleLoginPress}
          style={styles.button}
          labelStyle={styles.buttonLabel}
          icon="login"
          uppercase={false}
          contentStyle={styles.buttonContent}
        >
          로그인
        </Button>
        <Button
          mode="outlined"
          onPress={handleSignupPress}
          style={[styles.button, styles.signupButton]}
          labelStyle={[styles.buttonLabel, { color: theme.colors.primary }]}
          textColor={theme.colors.secondary}
          icon="account-plus-outline"
          uppercase={false}
          contentStyle={styles.buttonContent}
        >
          회원가입
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "80%",
    width: "100%",
  },
  logoContainer: {
    flex: 9, // 남은 공간 차지
    justifyContent: "center", // 수직 중앙 정렬
    alignItems: "center", // 수평 중앙 정렬
    paddingHorizontal: RFValue(30),
  },
  logo: {
    // marginBottom: RFValue(30),
    elevation: 4, // 약간의 입체감
  },
  slogonContainer: {
    flex: 3,
  },
  slogan: {
    textAlign: "center",
    lineHeight: RFValue(22),
  },
  buttonContainer: {
    flex: 2, // 남은 공간 차지
    paddingHorizontal: RFValue(30),
    paddingBottom: RFValue(20), // 하단 여백
    paddingTop: RFValue(20),
    justifyContent: "center",
  },
  button: {
    borderRadius: RFValue(30),
    marginBottom: RFValue(15),
    borderColor: color.secondary, // Outlined 버튼 테두리 색상
  },
  signupButton: {
    // Optional: Add specific styles for signup button if needed
    // e.g., borderWidth: 1.5,
  },
  buttonLabel: {
    fontSize: RFValue(16),
    fontWeight: "600", // Medium-Bold
  },
  buttonContent: {
    paddingVertical: RFValue(8), // 버튼 내부 높이 조절
  },
});
