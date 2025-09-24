import React, { useEffect, useState } from 'react';
import { Linking, Platform } from 'react-native';
import Constants from 'expo-constants';
import * as Updates from 'expo-updates';
import { getValue } from 'firebase/remote-config';
import { remoteConfig, fetchRemoteConfig } from '../config/firebase';
import { useAlertStore } from '@/common/components/modal/stores/useAlertStore';
import ConfirmationModal from '@/common/components/modal/ConfirmationModal';
import { AlertModal } from '@/common/components/modal/AlertModal';
import { color } from '@/common/styles/color';

interface UpdateInfo {
  needsUpdate: boolean;
  isForceUpdate: boolean;
  message: string;
  maintenanceMode: boolean;
  maintenanceMessage: string;
}

export const useAppUpdateModal = () => {
  const { showAlert } = useAlertStore();
  const [updateInfo, setUpdateInfo] = useState<UpdateInfo>({
    needsUpdate: false,
    isForceUpdate: false,
    message: '',
    maintenanceMode: false,
    maintenanceMessage: '',
  });

  const [showOptionalUpdate, setShowOptionalUpdate] = useState(false);
  const [optionalUpdateMessage, setOptionalUpdateMessage] = useState('');

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
            title: '업데이트 준비 완료',
            message: '새로운 업데이트가 준비되었습니다.\n앱을 다시 시작하여 적용합니다.',
            icon: 'download-circle',
            iconColor: color.secondary,
            confirmText: '다시 시작',
            onConfirm: () => Updates.reloadAsync(),
          });
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

        // 서버 점검 모달 표시
        showAlert({
          title: '서버 점검 중',
          message: maintenanceMessage || '서비스 개선을 위한 정기 점검 중입니다.\n잠시 후 다시 이용해주세요.',
          icon: 'tools',
          iconColor: '#FFA500',
          confirmText: '확인',
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
          // 선택적 업데이트는 ConfirmationModal 사용
          setOptionalUpdateMessage(updateMessage || '새로운 기능과 개선사항이 포함된 업데이트가 있습니다.\n지금 업데이트하시겠습니까?');
          setShowOptionalUpdate(true);
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
    showAlert({
      title: '필수 업데이트',
      message: message || '더 나은 서비스를 위해 앱 업데이트가 필요합니다.\n스토어에서 최신 버전으로 업데이트해주세요.',
      icon: 'alert-circle',
      iconColor: '#FF6B6B',
      confirmText: '업데이트하기',
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
    OptionalUpdateModal: () => (
      <ConfirmationModal
        visible={showOptionalUpdate}
        onDismiss={() => setShowOptionalUpdate(false)}
        onConfirm={() => {
          setShowOptionalUpdate(false);
          openStore();
        }}
        icon="download"
        iconColor={color.primary}
        title="업데이트 사용 가능"
        content={optionalUpdateMessage}
        confirmText="업데이트하기"
        cancelText="나중에"
      />
    ),
  };
};