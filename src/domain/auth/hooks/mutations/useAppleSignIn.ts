import { useState, useCallback, useEffect } from "react";
import { Platform } from "react-native";
import { useRouter } from "expo-router";
import { appleAuthService } from "../../services/appleAuthService";
import { useAppleAuthMutation } from "./useAuthMutation";
import { useAuthStore } from "../../stores/useAuthStore";
import { Analytics } from "@/common/services/analytics";
import { showAlert } from "@/common/components/modal/stores/useAlertStore";
import path from "@/common/constants/path";

interface UseAppleSignInOptions {
  disabled?: boolean;
}

interface UseAppleSignInReturn {
  isLoading: boolean;
  isAvailable: boolean;
  handleAppleSignIn: () => Promise<void>;
}

/**
 * Apple 로그인 비즈니스 로직을 담당하는 훅
 * - Apple OAuth 로그인 시도
 * - 신규/기존 모두 바로 로그인 (백엔드에서 신규면 회원 생성)
 * - 전화번호 미입력 시 (protected)/_layout에서 phone-registration으로 리다이렉트
 */
export const useAppleSignIn = (
  options: UseAppleSignInOptions = {}
): UseAppleSignInReturn => {
  const { disabled = false } = options;
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isAvailable, setIsAvailable] = useState(false);
  const { mutate: appleAuth } = useAppleAuthMutation();
  const setLoginState = useAuthStore((state) => state.login);

  // Apple 로그인 가능 여부 확인 (iOS만 지원)
  useEffect(() => {
    const checkAvailability = async () => {
      if (Platform.OS !== "ios") {
        setIsAvailable(false);
        return;
      }
      const available = await appleAuthService.isAvailable();
      setIsAvailable(available);
    };
    checkAvailability();
  }, []);

  const handleAppleSignIn = useCallback(async () => {
    if (isLoading || disabled || !isAvailable) return;

    setIsLoading(true);

    try {
      const result = await appleAuthService.signIn();

      if (!result || !result.identityToken) {
        showAlert({
          title: "Apple 로그인 실패",
          message: "Apple 인증에 실패했습니다. 다시 시도해주세요.",
          icon: "alert-circle",
        });
        setIsLoading(false);
        return;
      }

      // 백엔드로 identityToken 전송하여 로그인/회원가입 처리
      appleAuth(
        {
          identityToken: result.identityToken,
          authorizationCode: result.authorizationCode,
          name: result.user.name,
        },
        {
          onSuccess: (data) => {
            if (!data || !data.accessToken || !data.refreshToken) {
              showAlert({
                title: "로그인 실패",
                message: "서버 응답이 올바르지 않습니다.",
                icon: "alert-circle",
              });
              return;
            }

            // 신규/기존 모두 바로 로그인
            // 전화번호 미입력 시 (protected)/_layout에서 phone-registration으로 리다이렉트
            Analytics.logLogin("apple");
            setLoginState(data.accessToken, data.refreshToken);
            router.replace(path.showRoomList());
          },
          onSettled: () => {
            setIsLoading(false);
          },
        }
      );
    } catch (error: any) {
      console.error("Apple Sign-In Error:", error);

      // 사용자가 취소한 경우는 에러 메시지를 표시하지 않음
      if (error.code !== "SIGN_IN_CANCELLED") {
        showAlert({
          title: "Apple 로그인 실패",
          message: error.message || "알 수 없는 오류가 발생했습니다.",
          icon: "alert-circle",
        });
      }
      setIsLoading(false);
    }
  }, [isLoading, disabled, isAvailable, appleAuth, setLoginState, router]);

  return {
    isLoading,
    isAvailable,
    handleAppleSignIn,
  };
};
