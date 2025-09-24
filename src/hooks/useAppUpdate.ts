import { useEffect, useState } from 'react';
import { Linking, Platform } from 'react-native';
import Constants from 'expo-constants';
import * as Updates from 'expo-updates';
import { useAlertStore } from '@/common/components/modal/stores/useAlertStore';
import { color } from '@/common/styles/color';
import { appVersionApi } from '@/domain/appVersion/api/appVersionApi';
import { UPDATE_MESSAGES } from '@/constants/updateMessages';

interface UpdateInfo {
  needsUpdate: boolean;
  isForceUpdate: boolean;
  maintenanceMode: boolean;
}

export const useAppUpdate = () => {
  const { showAlert } = useAlertStore();
  const [updateInfo, setUpdateInfo] = useState<UpdateInfo>({
    needsUpdate: false,
    isForceUpdate: false,
    maintenanceMode: false,
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
          showAlert({
            title: UPDATE_MESSAGES.EAS_UPDATE_READY_TITLE,
            message: UPDATE_MESSAGES.EAS_UPDATE_READY_MESSAGE,
            icon: 'download-circle',
            iconColor: color.secondary,
            confirmText: UPDATE_MESSAGES.BUTTON_RESTART,
            onConfirm: () => Updates.reloadAsync(),
          });
        }
      }

      // 2. API 서버에서 버전 정보 가져오기
      const versionInfo = await appVersionApi.fetchVersionInfo();
      const { maintenanceMode, minimumAppVersion, forceUpdateAppVersion } = versionInfo;

      if (maintenanceMode) {
        setUpdateInfo({
          needsUpdate: false,
          isForceUpdate: false,
          maintenanceMode: true,
        });

        // 서버 점검 모달 표시
        showAlert({
          title: UPDATE_MESSAGES.MAINTENANCE_TITLE,
          message: UPDATE_MESSAGES.MAINTENANCE_MESSAGE,
          icon: 'tools',
          iconColor: color.secondary,
          confirmText: UPDATE_MESSAGES.BUTTON_CONFIRM,
        });

        return;
      }

      // 버전 체크
      const currentVersion = Constants.expoConfig?.version || '1.0.0';
      const isBelowMinimum = compareVersions(currentVersion, minimumAppVersion) < 0;
      const isBelowForceUpdate = compareVersions(currentVersion, forceUpdateAppVersion) < 0;

      if (isBelowMinimum) {
        // 최소 버전 미만 - 강제 업데이트
        setUpdateInfo({
          needsUpdate: true,
          isForceUpdate: true,
          maintenanceMode: false,
        });
        showForceUpdateAlert();
      } else if (isBelowForceUpdate) {
        // 최소 버전 이상이지만 권장 버전 미만 - 선택적 업데이트
        setUpdateInfo({
          needsUpdate: true,
          isForceUpdate: false,
          maintenanceMode: false,
        });
        showOptionalUpdateAlert();
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

  const showForceUpdateAlert = () => {
    showAlert({
      title: UPDATE_MESSAGES.FORCE_UPDATE_TITLE,
      message: UPDATE_MESSAGES.FORCE_UPDATE_MESSAGE,
      icon: 'alert-circle',
      iconColor: '#FF6B6B',
      confirmText: UPDATE_MESSAGES.BUTTON_UPDATE,
      onConfirm: openStore,
    });
  };

  const showOptionalUpdateAlert = () => {
    // 선택적 업데이트는 ConfirmationModal을 사용하는 것이 더 적합하므로
    // 여기서는 AlertModal 스타일로 간단히 구현
    showAlert({
      title: UPDATE_MESSAGES.OPTIONAL_UPDATE_TITLE,
      message: UPDATE_MESSAGES.OPTIONAL_UPDATE_MESSAGE,
      icon: 'download',
      iconColor: color.primary,
      confirmText: UPDATE_MESSAGES.BUTTON_UPDATE,
      onConfirm: openStore,
    });
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