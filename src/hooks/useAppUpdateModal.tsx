import React, { useEffect, useState } from 'react';
import { Linking, Platform } from 'react-native';
import Constants from 'expo-constants';
import ConfirmationModal from '@/common/components/modal/ConfirmationModal';
import { ForceUpdateModal } from '@/common/components/modal/ForceUpdateModal';
import { MaintenanceModal } from '@/common/components/modal/MaintenanceModal';
import { color } from '@/common/styles/color';
import { appVersionApi } from '@/domain/appVersion/api/appVersionApi';
import { UPDATE_MESSAGES } from '@/constants/updateMessages';

interface UpdateInfo {
  needsUpdate: boolean;
  isForceUpdate: boolean;
  maintenanceMode: boolean;
}

export const useAppUpdateModal = () => {
  const [updateInfo, setUpdateInfo] = useState<UpdateInfo>({
    needsUpdate: false,
    isForceUpdate: false,
    maintenanceMode: false,
  });

  const [showOptionalUpdate, setShowOptionalUpdate] = useState(false);
  const [optionalUpdateMessage, setOptionalUpdateMessage] = useState('');
  const [showMaintenance, setShowMaintenance] = useState(false);
  const [showForceUpdate, setShowForceUpdate] = useState(false);

  useEffect(() => {
    checkForUpdates();
  }, []);

  const checkForUpdates = async () => {
    try {
      // API 서버에서 버전 정보 가져오기
      // (EAS Update는 EASUpdateManager에서 별도로 처리)
      const versionInfo = await appVersionApi.fetchVersionInfo();
      const { maintenanceMode, minimumAppVersion, forceUpdateAppVersion } = versionInfo;

      if (maintenanceMode) {
        setUpdateInfo({
          needsUpdate: false,
          isForceUpdate: false,
          maintenanceMode: true,
        });

        // 서버 점검 모달 표시
        setShowMaintenance(true);
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
        setShowForceUpdate(true);
      } else if (isBelowForceUpdate) {
        // 최소 버전 이상이지만 권장 버전 미만 - 선택적 업데이트
        setUpdateInfo({
          needsUpdate: true,
          isForceUpdate: false,
          maintenanceMode: false,
        });
        setOptionalUpdateMessage(UPDATE_MESSAGES.OPTIONAL_UPDATE_MESSAGE);
        setShowOptionalUpdate(true);
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


  const openStore = () => {
    const storeUrl = Platform.select({
      ios: 'https://apps.apple.com/app/id6738428439',
      android: 'https://play.google.com/apps/testing/site.praytogether',
    });

    if (storeUrl) {
      Linking.openURL(storeUrl);
    }
  };

  return {
    updateInfo,
    checkForUpdates,
    OptionalUpdateModal: () => (
      <>
        <MaintenanceModal
          visible={showMaintenance}
        />
        <ConfirmationModal
          visible={showOptionalUpdate}
          onDismiss={() => setShowOptionalUpdate(false)}
          onConfirm={() => {
            setShowOptionalUpdate(false);
            openStore();
          }}
          icon="download"
          iconColor={color.primary}
          title={UPDATE_MESSAGES.OPTIONAL_UPDATE_TITLE}
          content={optionalUpdateMessage}
          confirmText={UPDATE_MESSAGES.BUTTON_UPDATE}
          cancelText={UPDATE_MESSAGES.BUTTON_LATER}
        />
        <ForceUpdateModal
          visible={showForceUpdate}
          onAction={openStore}
          iconColor="#FF6B6B"
        />
      </>
    ),
  };
};