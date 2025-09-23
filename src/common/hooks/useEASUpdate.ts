import { useEffect, useState, useCallback } from 'react';
import * as Updates from 'expo-updates';
import { Alert, AppState, AppStateStatus } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LAST_UPDATE_CHECK_KEY = '@last_update_check';
const CHECK_INTERVAL = 1000 * 60 * 60 * 4; // 4시간마다 체크

interface UpdateStatus {
  isChecking: boolean;
  isDownloading: boolean;
  isUpdateAvailable: boolean;
  isUpdatePending: boolean;
}

export function useEASUpdate() {
  const [updateStatus, setUpdateStatus] = useState<UpdateStatus>({
    isChecking: false,
    isDownloading: false,
    isUpdateAvailable: false,
    isUpdatePending: false,
  });

  // 개발 환경에서는 작동하지 않음
  const isDevelopment = __DEV__;

  /**
   * 업데이트 체크 (silent 모드: 백그라운드에서 조용히 체크)
   */
  const checkForUpdate = useCallback(async (silent = false) => {
    // 개발 환경에서는 체크하지 않음
    if (isDevelopment) {
      return;
    }

    // 이미 체크 중이면 스킵하고 상태 업데이트
    const shouldSkip = await new Promise<boolean>(resolve => {
      setUpdateStatus(prev => {
        if (prev.isChecking) {
          resolve(true);
          return prev;
        }
        resolve(false);
        return { ...prev, isChecking: true };
      });
    });

    if (shouldSkip) return;

    try {
      // Silent 모드일 때 최근 체크 시간 확인
      if (silent) {
        const lastCheck = await AsyncStorage.getItem(LAST_UPDATE_CHECK_KEY);
        if (lastCheck) {
          const timeSinceLastCheck = Date.now() - parseInt(lastCheck, 10);
          if (timeSinceLastCheck < CHECK_INTERVAL) {
            return;
          }
        }
      }

      // 업데이트 체크
      const update = await Updates.checkForUpdateAsync();

      if (update.isAvailable) {
        setUpdateStatus(prev => ({
          ...prev,
          isUpdateAvailable: true,
          isChecking: false
        }));

        if (!silent) {
          // 사용자에게 업데이트 알림
          showUpdateAlert();
        } else {
          // Silent 모드: 백그라운드에서 다운로드
          await downloadUpdateSilently();
        }
      } else {
        setUpdateStatus(prev => ({
          ...prev,
          isUpdateAvailable: false,
          isChecking: false
        }));

        if (!silent) {
          Alert.alert('업데이트 확인', '현재 최신 버전을 사용 중입니다.');
        }
      }

      // 체크 시간 저장
      await AsyncStorage.setItem(LAST_UPDATE_CHECK_KEY, Date.now().toString());

    } catch (error) {
      console.error('[EAS Update] 체크 실패:', error);
      setUpdateStatus(prev => ({ ...prev, isChecking: false }));

      if (!silent) {
        Alert.alert('업데이트 확인 실패', '업데이트를 확인하는 중 오류가 발생했습니다.');
      }
    }
  }, [isDevelopment]);

  /**
   * 업데이트 다운로드 및 적용
   */
  const downloadAndApplyUpdate = useCallback(async () => {
    try {
      setUpdateStatus(prev => ({ ...prev, isDownloading: true }));

      await Updates.fetchUpdateAsync();

      setUpdateStatus(prev => ({
        ...prev,
        isDownloading: false,
        isUpdatePending: true
      }));

      Alert.alert(
        '업데이트 완료',
        '새로운 버전이 다운로드되었습니다. 앱을 재시작하여 적용하시겠습니까?',
        [
          {
            text: '나중에',
            style: 'cancel'
          },
          {
            text: '재시작',
            onPress: async () => {
              await Updates.reloadAsync();
            }
          }
        ],
        { cancelable: false }
      );

    } catch (error) {
      console.error('[EAS Update] 다운로드 실패:', error);
      setUpdateStatus(prev => ({ ...prev, isDownloading: false }));
      Alert.alert('업데이트 실패', '업데이트 다운로드 중 오류가 발생했습니다.');
    }
  }, []);

  /**
   * Silent 모드로 업데이트 다운로드 (백그라운드)
   */
  const downloadUpdateSilently = async () => {
    try {
      await Updates.fetchUpdateAsync();
      setUpdateStatus(prev => ({
        ...prev,
        isUpdatePending: true
      }));
    } catch (error) {
      console.error('[EAS Update] 백그라운드 다운로드 실패:', error);
    }
  };

  /**
   * 업데이트 알림 표시
   */
  const showUpdateAlert = () => {
    Alert.alert(
      '새로운 업데이트',
      '새로운 버전이 출시되었습니다. 지금 업데이트하시겠습니까?',
      [
        {
          text: '나중에',
          style: 'cancel'
        },
        {
          text: '업데이트',
          onPress: downloadAndApplyUpdate
        }
      ]
    );
  };

  /**
   * 앱 상태 변경 감지 (포그라운드 복귀 시 체크)
   */
  useEffect(() => {
    if (isDevelopment) return;

    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        // 앱이 포그라운드로 돌아올 때 silent 체크
        checkForUpdate(true);
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    // 초기 실행 시 체크
    checkForUpdate(true);

    // 주기적 체크 (4시간마다)
    const interval = setInterval(() => {
      checkForUpdate(true);
    }, CHECK_INTERVAL);

    return () => {
      subscription.remove();
      clearInterval(interval);
    };
  }, [isDevelopment]);

  // 업데이트 이벤트 리스너는 expo-updates v0.18+에서 지원
  // 현재 버전에서는 주석 처리
  // useEffect(() => {
  //   if (isDevelopment) return;
  //   const subscription = Updates.addListener((event) => {
  //     if (event.type === Updates.UpdateEventType.UPDATE_AVAILABLE) {
  //       setUpdateStatus(prev => ({ ...prev, isUpdateAvailable: true }));
  //     }
  //   });
  //   return () => subscription.remove();
  // }, [isDevelopment]);

  return {
    ...updateStatus,
    checkForUpdate,
    downloadAndApplyUpdate,
    isDevelopment,
    updateId: Updates.updateId,
    channel: Updates.channel,
  };
}