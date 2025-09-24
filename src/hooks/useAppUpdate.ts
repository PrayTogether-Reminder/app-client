import { useEffect, useState } from 'react';
import { Alert, Linking, Platform } from 'react-native';
import Constants from 'expo-constants';
import * as Updates from 'expo-updates';
import { getValue } from 'firebase/remote-config';
import { remoteConfig, fetchRemoteConfig } from '../config/firebase';

interface UpdateInfo {
  needsUpdate: boolean;
  isForceUpdate: boolean;
  message: string;
  maintenanceMode: boolean;
  maintenanceMessage: string;
}

export const useAppUpdate = () => {
  const [updateInfo, setUpdateInfo] = useState<UpdateInfo>({
    needsUpdate: false,
    isForceUpdate: false,
    message: '',
    maintenanceMode: false,
    maintenanceMessage: '',
  });

  useEffect(() => {
    checkForUpdates();
  }, []);

  const checkForUpdates = async () => {
    try {
      // 1. Expo Updates 체크 (빠른 업데이트)
      if (!__DEV__) {
        const update = await Updates.checkForUpdateAsync();
        if (update.isAvailable) {
          await Updates.fetchUpdateAsync();
          Alert.alert(
            '업데이트 알림',
            '새로운 업데이트가 준비되었습니다. 앱을 다시 시작합니다.',
            [
              {
                text: '확인',
                onPress: () => Updates.reloadAsync(),
              },
            ],
            { cancelable: false }
          );
        }
      }

      // 2. Firebase Remote Config 체크 (강제 업데이트)
      await fetchRemoteConfig();
      
      // 서버 점검 체크
      const maintenanceMode = getValue(remoteConfig, 'maintenance_mode').asBoolean();
      const maintenanceMessage = getValue(remoteConfig, 'maintenance_message').asString();
      
      if (maintenanceMode) {
        setUpdateInfo({
          needsUpdate: false,
          isForceUpdate: false,
          message: '',
          maintenanceMode: true,
          maintenanceMessage,
        });
        return;
      }

      // 버전 체크
      const currentVersion = Constants.expoConfig?.version || '1.0.0';
      const minimumVersion = getValue(remoteConfig, 'minimum_app_version').asString();
      const forceUpdateVersion = getValue(remoteConfig, 'force_update_version').asString();
      const updateMessage = getValue(remoteConfig, 'update_message').asString();

      const needsUpdate = compareVersions(currentVersion, minimumVersion) < 0;
      const isForceUpdate = compareVersions(currentVersion, forceUpdateVersion) < 0;

      if (needsUpdate) {
        setUpdateInfo({
          needsUpdate: true,
          isForceUpdate,
          message: updateMessage,
          maintenanceMode: false,
          maintenanceMessage: '',
        });
        
        if (isForceUpdate) {
          showForceUpdateAlert(updateMessage);
        } else {
          showOptionalUpdateAlert(updateMessage);
        }
      }
    } catch (error) {
      console.error('Update check failed:', error);
    }
  };

  const compareVersions = (current: string, required: string): number => {
    const currentParts = current.split('.').map(Number);
    const requiredParts = required.split('.').map(Number);

    for (let i = 0; i < 3; i++) {
      const currentPart = currentParts[i] || 0;
      const requiredPart = requiredParts[i] || 0;
      
      if (currentPart < requiredPart) return -1;
      if (currentPart > requiredPart) return 1;
    }
    
    return 0;
  };

  const showForceUpdateAlert = (message: string) => {
    Alert.alert(
      '필수 업데이트',
      message,
      [
        {
          text: '업데이트',
          onPress: openStore,
        },
      ],
      { cancelable: false }
    );
  };

  const showOptionalUpdateAlert = (message: string) => {
    Alert.alert(
      '업데이트 알림',
      message,
      [
        { text: '나중에', style: 'cancel' },
        { text: '업데이트', onPress: openStore },
      ]
    );
  };

  const openStore = () => {
    const storeUrl = Platform.select({
      ios: 'https://apps.apple.com/app/id6738428439',
      android: 'https://play.google.com/store/apps/details?id=com.praytogether.app',
    });
    
    if (storeUrl) {
      Linking.openURL(storeUrl);
    }
  };

  return {
    updateInfo,
    checkForUpdates,
  };
};