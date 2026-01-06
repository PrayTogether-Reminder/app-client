import * as AppleAuthentication from "expo-apple-authentication";

export interface AppleSignInResult {
  identityToken: string;
  authorizationCode: string;
  sub: string;
  user: {
    name: string | null;
  };
}

export const appleAuthService = {
  // Apple 로그인 가능 여부 확인
  isAvailable: async (): Promise<boolean> => {
    try {
      return await AppleAuthentication.isAvailableAsync();
    } catch (error) {
      console.error("Apple Auth availability check Error:", error);
      return false;
    }
  },

  // Apple 로그인 시도
  signIn: async (): Promise<AppleSignInResult | null> => {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      if (credential.identityToken && credential.authorizationCode) {
        // Apple은 처음 로그인할 때만 이름과 이메일을 제공
        // 이후 로그인에서는 null이 반환됨
        // 한국식 이름 순서: 성(familyName) + 이름(givenName)
        const fullName = credential.fullName;
        const name = fullName
          ? [fullName.familyName, fullName.givenName].filter(Boolean).join("")
          : null;

        // 디버깅용 로그
        console.log("=== Apple Sign-In Credential ===");
        console.log("user (sub):", credential.user);
        console.log("email:", credential.email);
        console.log("fullName:", JSON.stringify(fullName, null, 2));
        console.log("identityToken:", credential.identityToken?.substring(0, 50) + "...");
        console.log("authorizationCode:", credential.authorizationCode?.substring(0, 30) + "...");
        console.log("realUserStatus:", credential.realUserStatus);
        console.log("================================");

        return {
          identityToken: credential.identityToken,
          authorizationCode: credential.authorizationCode,
          sub: credential.user,
          user: {
            name: name || null,
          },
        };
      }

      return null;
    } catch (error: any) {
      // 사용자가 취소한 경우
      if (error.code === "ERR_REQUEST_CANCELED") {
        throw { code: "SIGN_IN_CANCELLED", message: "사용자가 로그인을 취소했습니다." };
      }
      console.error("Apple Sign-In Error:", error);
      throw error;
    }
  },
};
