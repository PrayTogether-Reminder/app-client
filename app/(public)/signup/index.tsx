import path from "@/common/constants/path";
import { backgroundColor, color } from "@/common/styles/color";
import { ScreenLayout } from "@/common/components/layout";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  BackHandler,
  Keyboard,
  Platform,
  StyleSheet,
  View,
} from "react-native";
import type { PagerViewOnPageSelectedEventData } from "react-native-pager-view";
import PagerView from "react-native-pager-view";
import { useTheme } from "react-native-paper";
import { RFValue } from "react-native-responsive-fontsize";

import { useSignupMutation } from "@/domain/auth/hooks/mutations/useAuthMutation";
import EmailStep from "./_components/EmailStep";
import NameStep from "./_components/NameStep";
import PhoneStep from "./_components/PhoneStep";
import PasswordStep from "./_components/PasswordStep";

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

  // phone step
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneError, setPhoneError] = useState("");

  // password step
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

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
    console.log('[resetStateForPage] pageIndex:', pageIndex);

    // pageIndex 0: 이름 단계 - 초기화 불필요

    // pageIndex 1: 이메일 단계로 돌아갈 때
    if (pageIndex === 1) {
      console.log('[resetStateForPage] 이메일 상태 초기화');
      setEmail("");
      setEmailError("");
      setOtp("");
      setOtpError("");
      setIsOtpSent(false);
      setIsSendingOtp(false);
      setIsVerifyingOtp(false);
    }

    // pageIndex 2: 전화번호 단계로 돌아갈 때
    if (pageIndex === 2) {
      console.log('[resetStateForPage] 전화번호 상태 초기화');
      setPhoneNumber("");
      setPhoneError("");
    }

    // pageIndex 3: 비밀번호 단계로 돌아갈 때
    if (pageIndex === 3) {
      console.log('[resetStateForPage] 비밀번호 상태 초기화');
      setPassword("");
      setConfirmPassword("");
      setPasswordError("");
    }
  };

  // --- 페이지 변경 이벤트 핸들러 ---
  const onPageSelected = (event: {
    nativeEvent: PagerViewOnPageSelectedEventData;
  }) => {
    const newPage = event.nativeEvent.position;
    console.log('[onPageSelected] 페이지 변경:', currentPage, '->', newPage);
    setCurrentPage(newPage);
    // 페이지 전환 시 키보드 숨김
    Keyboard.dismiss();
  };

  const goToNextPage = () => {
    console.log('[goToNextPage] 다음 페이지로 이동:', currentPage + 1);
    pagerRef.current?.setPageWithoutAnimation(currentPage + 1);
  };

  const goToPrevPage = () => {
    console.log('[goToPrevPage] 현재 페이지:', currentPage);

    if (currentPage > 0) {
      console.log('[goToPrevPage] 이전 페이지로 이동:', currentPage - 1);
      pagerRef.current?.setPageWithoutAnimation(currentPage - 1);
      resetStateForPage(currentPage - 1);
      return;
    }

    if (currentPage === 0) {
      console.log('[goToPrevPage] 첫 페이지 - router.back() 호출');
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
        { name, email, password, phoneNumber },
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
    <ScreenLayout
      showBackButton={true}
      onBackPress={goToPrevPage}
      backButtonDisabled={isSubmitting}
      keyboardAvoiding={true}
      scrollable={false}
      contentPadding={false}
      backgroundColor={backgroundColor.default}
    >
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

        {/* 3단계: 전화번호 입력 */}
        <View key="3" style={styles.eachView}>
          <PhoneStep
            phoneNumber={phoneNumber}
            setPhoneNumber={setPhoneNumber}
            phoneError={phoneError}
            setPhoneError={setPhoneError}
            onNext={goToNextPage}
            isSubmitting={isSubmitting}
          />
        </View>

        {/* 4단계: 비밀번호 설정 */}
        <View key="4" style={styles.eachView}>
          <PasswordStep
            password={password}
            setPassword={setPassword}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
            passwordError={passwordError}
            setPasswordError={setPasswordError}
            onSubmit={handleSignup}
            isSubmitting={isSubmitting}
          />
        </View>
      </PagerView>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  pagerView: {
    flex: 1,
  },
  eachView: {
    justifyContent: "flex-start",
  },
});

export default SignupScreen;
