import path from "@/common/constants/path";
import { backgroundColor, color } from "@/common/styles/color";
import { BackButtonHeader } from "@/common/components/header";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  BackHandler,
  Keyboard,
  Platform,
  SafeAreaView,
  StyleSheet,
  View,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

import { useSignupMutation } from "@/domain/auth/hooks/mutations/useAuthMutation";
import EmailStep from "./_components/EmailStep";
import NameStep from "./_components/NameStep";
import PhoneStep from "./_components/PhoneStep";
import PasswordStep from "./_components/PasswordStep";

const SignupScreen: React.FC = () => {
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
        const prevPage = currentPage - 1;
        setCurrentPage(prevPage);
        // 상태 초기화
        resetStateForPage(prevPage);
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
    // pageIndex 0: 이름 단계 - 초기화 불필요

    // pageIndex 1: 이메일 단계로 돌아갈 때
    if (pageIndex === 1) {
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
      setPhoneNumber("");
      setPhoneError("");
    }

    // pageIndex 3: 비밀번호 단계로 돌아갈 때
    if (pageIndex === 3) {
      setPassword("");
      setConfirmPassword("");
      setPasswordError("");
    }
  };

  const goToNextPage = () => {
    Keyboard.dismiss();
    setCurrentPage((prev) => Math.min(prev + 1, 3));
  };

  const goToPrevPage = () => {
    if (currentPage > 0) {
      const prevPage = currentPage - 1;
      Keyboard.dismiss();
      setCurrentPage(prevPage);
      resetStateForPage(prevPage);
      return;
    }

    if (currentPage === 0) {
      router.back();
    }
  };

  // --- 회원가입 제출 핸들러 ---
  const { mutate: signup } = useSignupMutation();
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
      signup(
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

  const renderCurrentStep = () => {
    switch (currentPage) {
      case 0:
        return (
          <NameStep
            name={name}
            setName={setName}
            nameError={nameError}
            setNameError={setNameError}
            onNext={goToNextPage}
            isSubmitting={isSubmitting}
          />
        );
      case 1:
        return (
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
        );
      case 2:
        return (
          <PhoneStep
            phoneNumber={phoneNumber}
            setPhoneNumber={setPhoneNumber}
            phoneError={phoneError}
            setPhoneError={setPhoneError}
            onNext={goToNextPage}
            isSubmitting={isSubmitting}
          />
        );
      case 3:
      default:
        return (
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
        );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <BackButtonHeader
        onPress={goToPrevPage}
        disabled={isSubmitting}
        style={styles.header}
      />
      <View style={styles.content}>
        <View style={styles.eachView}>{renderCurrentStep()}</View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: backgroundColor.default,
  },
  header: {
    marginTop: RFValue(8),
  },
  content: {
    flex: 1,
  },
  eachView: {
    flex: 1,
    justifyContent: "flex-start",
  },
});

export default SignupScreen;
