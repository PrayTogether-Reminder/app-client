import { useState, useCallback } from "react";
import { useRouter } from "expo-router";
import { googleAuthService } from "../services/googleAuthService";
import { useGoogleAuthMutation } from "./mutations/useAuthMutation";
import { useAuthStore } from "../stores/useAuthStore";
import { Analytics } from "@/common/services/analytics";
import { showAlert } from "@/common/components/modal/stores/useAlertStore";
import path from "@/common/constants/path";

interface UseGoogleSignInOptions {
  disabled?: boolean;
}

interface UseGoogleSignInReturn {
  isLoading: boolean;
  handleGoogleSignIn: () => Promise<void>;
}

/**
 * Google 로그인 비즈니스 로직을 담당하는 훅
 * - Google OAuth 로그인 시도
 * - 신규/기존 회원 분기 처리
 * - 네비게이션 처리
 */
export const useGoogleSignIn = (
  options: UseGoogleSignInOptions = {}
): UseGoogleSignInReturn => {
  const { disabled = false } = options;
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { mutate: googleAuth } = useGoogleAuthMutation();
  const setLoginState = useAuthStore((state) => state.login);

  const handleGoogleSignIn = useCallback(async () => {
    if (isLoading || disabled) return;

    setIsLoading(true);

    try {
      const result = await googleAuthService.signIn();

      if (!result || !result.idToken) {
        showAlert({
          title: "Google 로그인 실패",
          message: "Google 인증에 실패했습니다. 다시 시도해주세요.",
          icon: "alert-circle",
        });
        setIsLoading(false);
        return;
      }

      // 백엔드로 idToken 전송하여 기존/신규 회원 확인
      googleAuth(
        {
          idToken: result.idToken,
          email: result.user.email,
          name: result.user.name,
        },
        {
          onSuccess: (data) => {
            if (!data) {
              showAlert({
                title: "로그인 실패",
                message: "서버 응답이 올바르지 않습니다.",
                icon: "alert-circle",
              });
              return;
            }

            if (data.isNewMember) {
              // 신규 회원 → 추가 정보 입력 화면으로 이동
              const googleSignupUrl = `${path.showGoogleSignup()}?idToken=${encodeURIComponent(result.idToken)}&email=${encodeURIComponent(result.user.email)}&name=${encodeURIComponent(result.user.name || "")}`;
              router.push(googleSignupUrl as any);
            } else {
              // 기존 회원 → 바로 로그인
              Analytics.logLogin("google");
              setLoginState(data.accessToken!, data.refreshToken!);
              router.replace(path.showRoomList());
            }
          },
          onSettled: () => {
            setIsLoading(false);
          },
        }
      );
    } catch (error: any) {
      console.error("Google Sign-In Error:", error);

      // 사용자가 취소한 경우는 에러 메시지를 표시하지 않음
      if (error.code !== "SIGN_IN_CANCELLED") {
        showAlert({
          title: "Google 로그인 실패",
          message: error.message || "알 수 없는 오류가 발생했습니다.",
          icon: "alert-circle",
        });
      }
      setIsLoading(false);
    }
  }, [isLoading, disabled, googleAuth, setLoginState, router]);

  return {
    isLoading,
    handleGoogleSignIn,
  };
};
