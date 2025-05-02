import React, { useState, useRef, useEffect } from "react";
import {
  View,
  StyleSheet,
  Keyboard,
  Alert,
  BackHandler,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import path from "@/common/constants/path";
import PagerView from "react-native-pager-view";
import type { PagerViewOnPageSelectedEventData } from "react-native-pager-view";
import { useTheme, IconButton } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { backgroundColor, color } from "@/common/styles/color";
import { RFValue } from "react-native-responsive-fontsize";

import NameStep from "./_components/NameStep";
import EmailStep from "./_components/EmailStep";
import PasswordStep from "./_components/PasswordStep";
import { useSignupMutation } from "@/domain/auth/hooks/mutations/useAuthMutation";

const SignupScreen: React.FC = () => {
  const theme = useTheme();
  const pagerRef = useRef<PagerView>(null);
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(0);

  // name setp
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");

  // email step
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

  // password step
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- Android 백 버튼 핸들러 ---
  useEffect(() => {
    const backAction = () => {
      if (currentPage > 0) {
        // 이전 페이지로 이동
        pagerRef.current?.setPage(currentPage - 1);
        // 상태 초기화
        resetStateForPage(currentPage - 1);
        return true; // 이벤트를 소비했음을 알림 (앱 종료 방지)
      }
      // 첫 페이지거나 PagerView가 없으면 기본 동작 수행
      return false; // 이벤트가 처리되지 않았음을 알림 (앱 종료 또는 이전 스크린 이동)
    };

    // Android 플랫폼에서만 BackHandler 사용
    if (Platform.OS === "android") {
      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        backAction
      );

      // 컴포넌트 언마운트 시 리스너 제거
      return () => backHandler.remove();
    }

    // iOS 등 다른 플랫폼에서는 아무것도 하지 않음
    return () => {}; // cleanup 함수 반환 타입 일치
  }, [currentPage]);

  // --- 페이지 이동 시 상태 초기화 로직 ---
  const resetStateForPage = (pageIndex: number) => {
    if (pageIndex === 0) {
      setEmail("");
      setEmailError("");
      setOtp("");
      setOtpError("");
      setIsOtpSent(false);
      setIsSendingOtp(false);
      setIsVerifyingOtp(false);
    }
    if (pageIndex === 1) {
      setPassword("");
      setConfirmPassword("");
      setPasswordError("");
      setOtp("");
      setOtpError("");
      setIsOtpSent(false);
      setIsSendingOtp(false);
      setIsVerifyingOtp(false);
    }
  };

  // --- 페이지 변경 이벤트 핸들러 ---
  const onPageSelected = (event: {
    nativeEvent: PagerViewOnPageSelectedEventData;
  }) => {
    const newPage = event.nativeEvent.position;
    setCurrentPage(newPage);
    // 페이지 전환 시 키보드 숨김
    Keyboard.dismiss();
  };

  const goToNextPage = () => {
    pagerRef.current?.setPage(currentPage + 1);
  };

  const goToPrevPage = () => {
    if (currentPage > 0) {
      pagerRef.current?.setPage(currentPage - 1);
      resetStateForPage(currentPage - 1);
      return;
    }

    if (currentPage === 0) {
      router.back();
    }
  };

  // --- 회원가입 제출 핸들러 ---
  const { mutate: singup } = useSignupMutation();
  const handleSignup = async () => {
    Keyboard.dismiss();
    let hasError = false;

    if (password.length < 8) {
      setPasswordError("비밀번호는 8자 이상 입력해주세요.");
      hasError = true;
    } else if (password.length > 15) {
      setPasswordError("비밀번호는 15자 이하로 입력해주세요.");
      hasError = true;
    } else if (password !== confirmPassword) {
      setPasswordError("비밀번호가 일치하지 않습니다.");
      hasError = true;
    } else {
      setPasswordError("");
    }

    if (hasError) {
      setIsSubmitting(false);
      return false;
    }

    setIsSubmitting(true);

    try {
      singup(
        { name, email, password },
        {
          onSuccess: () => {
            router.replace(path.showLogin());
            setIsSubmitting(false);
          },
          onError: (error) => {
            setPasswordError("회원가입 중 오류가 발생했습니다.");
            setIsSubmitting(false);
          },
        }
      );
      return true;
    } catch (error) {
      setPasswordError("예상치 못한 오류가 발생했습니다.");
      setIsSubmitting(false);
      return false;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.top}>
        <IconButton
          icon="arrow-left"
          size={RFValue(30)}
          onPress={goToPrevPage}
          style={styles.backButton}
          disabled={isSubmitting}
          iconColor={color.secondary}
        />
      </View>
      <PagerView
        ref={pagerRef}
        style={styles.pagerView}
        initialPage={0}
        scrollEnabled={false}
        onPageSelected={onPageSelected}
      >
        {/* 1단계: 이름 입력 */}
        <View key="1" style={styles.eachView}>
          <NameStep
            name={name}
            setName={setName}
            nameError={nameError}
            setNameError={setNameError}
            onNext={goToNextPage}
            isSubmitting={isSubmitting}
          />
        </View>

        {/* 2단계: 이메일 + OTP 인증 */}
        <View key="2" style={styles.eachView}>
          <EmailStep
            email={email}
            setEmail={setEmail}
            emailError={emailError}
            setEmailError={setEmailError}
            otp={otp}
            setOtp={setOtp}
            otpError={otpError}
            setOtpError={setOtpError}
            isOtpSent={isOtpSent}
            setIsOtpSent={setIsOtpSent}
            isSendingOtp={isSendingOtp}
            setIsSendingOtp={setIsSendingOtp}
            isVerifyingOtp={isVerifyingOtp}
            setIsVerifyingOtp={setIsVerifyingOtp}
            onNext={goToNextPage}
            onBack={goToPrevPage}
            isSubmitting={isSubmitting}
          />
        </View>

        {/* 3단계: 비밀번호 설정 */}
        <View key="3" style={styles.eachView}>
          <PasswordStep
            password={password}
            setPassword={setPassword}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
            passwordError={passwordError}
            setPasswordError={setPasswordError}
            passwordVisible={passwordVisible}
            setPasswordVisible={setPasswordVisible}
            confirmPasswordVisible={confirmPasswordVisible}
            setConfirmPasswordVisible={setConfirmPasswordVisible}
            onSubmit={handleSignup}
            isSubmitting={isSubmitting}
          />
        </View>
      </PagerView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: backgroundColor.default,
  },
  top: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: RFValue(8),
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  backButton: {
    marginLeft: 0,
    paddingLeft: 0,
  },
  backButtonLabel: {},
  pagerView: {
    flex: 11,
  },
  eachView: {
    justifyContent: "flex-start",
  },
});

export default SignupScreen;
