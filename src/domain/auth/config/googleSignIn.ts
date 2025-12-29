import { GoogleSignin } from "@react-native-google-signin/google-signin";

// Google Cloud Console에서 Web Client ID를 가져와서 설정하세요
// Firebase Console > 프로젝트 설정 > 일반 > 내 앱 > 웹 앱의 OAuth 2.0 클라이언트 ID
// 또는 Google Cloud Console > API 및 서비스 > 사용자 인증 정보 > OAuth 2.0 클라이언트 ID (웹 클라이언트)
const WEB_CLIENT_ID =
  "124350525745-7fv6b3etpabd7ni0cqd7enc713o4ic0e.apps.googleusercontent.com";
const IOS_CLIENT_ID =
  "124350525745-4gap8sbgh7kg5gg7n0cgibd3pb10s7jg.apps.googleusercontent.com";



/**
 * Google Sign-In 초기 설정
 * - 앱 시작 시 호출되어야 함 (app/_layout.tsx)
 */
export const configureGoogleSignIn = () => {
  GoogleSignin.configure({
    webClientId: WEB_CLIENT_ID,
    iosClientId: IOS_CLIENT_ID,
    offlineAccess: true, // refresh token을 받기 위해 필요
    scopes: ["profile", "email"],
  });
};
