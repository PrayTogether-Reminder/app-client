import messaging from "@react-native-firebase/messaging";
import * as SecureStore from "expo-secure-store";

export const FIRST_LAUNCH_KEY = "already_launched";

// 알림 권한 확인
export const checkNotificationPermission = async (): Promise<boolean> => {
  try {
    const authStatus = await messaging().hasPermission();
    return (
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL
    );
  } catch (error) {
    console.error("Error checking notification permission:", error);
    return false;
  }
};

// 알림 권한 요청
export const requestNotificationPermission = async (): Promise<boolean> => {
  try {
    const authStatus = await messaging().requestPermission();
    return (
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL
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
