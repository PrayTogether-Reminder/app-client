import { getApp } from "@react-native-firebase/app";
import {
  getMessaging,
  hasPermission as checkPermission,
  requestPermission as requestPerm,
  AuthorizationStatus,
} from "@react-native-firebase/messaging";
import * as SecureStore from "expo-secure-store";
import Constants from "expo-constants";

export const FIRST_LAUNCH_KEY = "already_launched";
export const APP_VERSION_KEY = "app_version";

// 알림 권한 확인
export const checkNotificationPermission = async (): Promise<boolean> => {
  try {
    const app = getApp();
    const messaging = getMessaging(app);
    const authStatus = await checkPermission(messaging);
    return (
      authStatus === AuthorizationStatus.AUTHORIZED ||
      authStatus === AuthorizationStatus.PROVISIONAL
    );
  } catch (error) {
    console.error("Error checking notification permission:", error);
    return false;
  }
};

// 알림 권한 요청
export const requestNotificationPermission = async (): Promise<boolean> => {
  try {
    const app = getApp();
    const messaging = getMessaging(app);
    const authStatus = await requestPerm(messaging);
    console.log("Notification permission status:", authStatus);
    
    return (
      authStatus === AuthorizationStatus.AUTHORIZED ||
      authStatus === AuthorizationStatus.PROVISIONAL
    );
  } catch (error) {
    console.error("Error requesting notification permission:", error);
    return false;
  }
};

// 첫 실행 확인
export const isFirstLaunch = async (): Promise<boolean> => {
  try {
    const value = await SecureStore.getItemAsync(FIRST_LAUNCH_KEY);
    return value === null;
  } catch (error) {
    console.error("Error checking first launch status:", error);
    return false;
  }
};

// 첫 실행 표시 설정
export const setLaunched = async (): Promise<void> => {
  try {
    await SecureStore.setItemAsync(FIRST_LAUNCH_KEY, "launched");
  } catch (error) {
    console.error("Error setting launched flag:", error);
  }
};

// 앱 버전 변경 확인 (업데이트/재설치 감지)
export const checkAppVersionChanged = async (): Promise<boolean> => {
  try {
    const currentVersion = Constants.expoConfig?.version || "1.0.0";
    const savedVersion = await SecureStore.getItemAsync(APP_VERSION_KEY);
    
    console.log(`앱 버전 확인 - 현재: ${currentVersion}, 저장된 버전: ${savedVersion}`);
    
    if (!savedVersion || savedVersion !== currentVersion) {
      // 버전이 변경되었거나 처음 실행하는 경우
      await SecureStore.setItemAsync(APP_VERSION_KEY, currentVersion);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error("Error checking app version:", error);
    return false;
  }
};
