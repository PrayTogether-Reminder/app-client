// app/index.tsx (또는 앱의 가장 첫 진입점)
import React from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  Alert,
  Linking,
} from "react-native";
import { Text, Button, useTheme, Avatar } from "react-native-paper";
import { TextButton, GoogleSignInButton } from "@/common/components/button";
import { useRouter } from "expo-router";
import { RFValue } from "react-native-responsive-fontsize";
import { color } from "@/common/styles/color";
import path from "@/common/constants/path";
import { CONTACT_FORM_URL } from "@/common/constants/externalLinks";

export default function WelcomeScreen() {
  const theme = useTheme();
  const router = useRouter();

  const handleLoginPress = () => {
    router.push(path.showLogin()); // 로그인 화면으로 이동
  };

  const handleInquiryPress = async () => {
    try {
      const supported = await Linking.canOpenURL(CONTACT_FORM_URL);
      if (supported) {
        await Linking.openURL(CONTACT_FORM_URL);
        return;
      }
    } catch (error) {
      console.error("Failed to open contact form", error);
    }

    Alert.alert(
      "링크를 열 수 없어요",
      "잠시 후 다시 시도해 주세요. 문제가 계속되면 운영팀에 알려주세요."
    );
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
        <TextButton
          onPress={handleInquiryPress}
          textColor={color.secondary}
          size="large"
          style={styles.inquiryButton}
        >
          1:1 문의
        </TextButton>
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

        {/* 구분선 */}
        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>또는</Text>
          <View style={styles.divider} />
        </View>

        <GoogleSignInButton />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  logoContainer: {
    flex: 5,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: RFValue(30),
  },
  logo: {
    // marginBottom: RFValue(30),
    elevation: 4, // 약간의 입체감
  },
  slogonContainer: {
    flex: 2,
    paddingHorizontal: RFValue(30),
  },
  slogan: {
    textAlign: "center",
    lineHeight: RFValue(28),
  },
  buttonContainer: {
    flex: 4,
    paddingHorizontal: RFValue(30),
    paddingBottom: RFValue(30),
    justifyContent: "flex-end",
  },
  button: {
    borderRadius: RFValue(30),
    marginBottom: RFValue(8),
    borderColor: color.secondary,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: RFValue(8),
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: color.grayDark,
  },
  dividerText: {
    marginHorizontal: RFValue(12),
    color: color.gray,
    fontSize: RFValue(12),
  },
  inquiryButton: {
    marginBottom: RFValue(25),
  },
  buttonLabel: {
    fontSize: RFValue(16),
    fontWeight: "600", // Medium-Bold
    lineHeight: RFValue(20),
  },
  buttonContent: {
    paddingVertical: RFValue(8), // 버튼 내부 높이 조절
  },
});
