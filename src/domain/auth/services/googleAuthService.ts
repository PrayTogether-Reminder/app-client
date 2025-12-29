import { GoogleSignin } from "@react-native-google-signin/google-signin";

// Google 로그인 결과 타입
export interface GoogleSignInResult {
  idToken: string;
  user: {
    email: string;
    name: string | null;
    photo: string | null;
  };
}

/**
 * Google Sign-In 관련 서비스
 * - Native Google Sign-In SDK를 통한 인증 처리
 */
export const googleAuthService = {
  // Google 로그인 시도
  signIn: async (): Promise<GoogleSignInResult | null> => {
    try {
      await GoogleSignin.hasPlayServices();
      // 이전 로그인 세션 해제하여 항상 계정 선택 화면 표시
      await GoogleSignin.signOut();
      const response = await GoogleSignin.signIn();

      if (response.type === "success" && response.data) {
        return {
          idToken: response.data.idToken!,
          user: {
            email: response.data.user.email,
            name: response.data.user.name,
            photo: response.data.user.photo,
          },
        };
      }

      return null;
    } catch (error: any) {
      console.error("Google Sign-In Error:", error);
      throw error;
    }
  },

  // Google 로그아웃
  signOut: async (): Promise<void> => {
    try {
      await GoogleSignin.signOut();
    } catch (error) {
      console.error("Google Sign-Out Error:", error);
    }
  },

  // 현재 로그인된 사용자 확인
  getCurrentUser: async () => {
    try {
      const userInfo = await GoogleSignin.getCurrentUser();
      return userInfo;
    } catch (error) {
      console.error("Get Current User Error:", error);
      return null;
    }
  },

  // 로그인 상태 확인
  isSignedIn: async (): Promise<boolean> => {
    const isSignedIn = await GoogleSignin.hasPreviousSignIn();
    return isSignedIn;
  },
};
