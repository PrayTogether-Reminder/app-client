import { getApp } from "@react-native-firebase/app";
import {
  getMessaging,
  hasPermission as checkPermission,
  requestPermission as requestPerm,
  AuthorizationStatus,
} from "@react-native-firebase/messaging";
import * as SecureStore from "expo-secure-store";

export const FIRST_LAUNCH_KEY = "already_launched";

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
