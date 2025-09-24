import { initializeApp } from 'firebase/app';
import { getRemoteConfig, fetchAndActivate } from 'firebase/remote-config';
import { Platform } from 'react-native';

const firebaseConfig = {
  apiKey: "AIzaSyBe-fSKKI89RaXAFhYs4l5PsDLJoW8fnYc",
  authDomain: "praytogether-reminder.firebaseapp.com",
  projectId: "praytogether-reminder",
  storageBucket: "praytogether-reminder.appspot.com",
  messagingSenderId: "451036551085",
  appId: Platform.select({
    ios: "1:451036551085:ios:6f666c2e2c0c5b46a39ceb",
    android: "1:451036551085:android:b587cdba00f95ed0a39ceb",
  }),
};

const app = initializeApp(firebaseConfig);
export const remoteConfig = getRemoteConfig(app);

// 기본값 설정
remoteConfig.defaultConfig = {
  minimum_app_version: '1.0.2',
  force_update_version: '1.0.2',
  update_message: '새로운 버전이 출시되었습니다. 업데이트를 진행해주세요.',
  maintenance_mode: false,
  maintenance_message: '서버 점검 중입니다. 잠시 후 다시 시도해주세요.',
};

// 캐시 설정 (프로덕션: 12시간, 개발: 0)
remoteConfig.settings.minimumFetchIntervalMillis = __DEV__ ? 0 : 43200000;

export const fetchRemoteConfig = async () => {
  try {
    await fetchAndActivate(remoteConfig);
    return true;
  } catch (error) {
    console.error('Remote Config fetch failed:', error);
    return false;
  }
};