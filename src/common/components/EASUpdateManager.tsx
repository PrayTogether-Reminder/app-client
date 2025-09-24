import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Portal, Modal, IconButton } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { RFValue } from 'react-native-responsive-fontsize';
import { useEASUpdate } from '../hooks/useEASUpdate';
import { color } from '../styles/color';

const { width } = Dimensions.get('window');

/**
 * EAS Update 관리 컴포넌트
 * - 자동으로 업데이트 체크
 * - 업데이트 다운로드 진행 상황 표시
 * - 재시작 알림
 */
export default function EASUpdateManager() {
  const {
    isDownloading,
    isDevelopment,
  } = useEASUpdate();

  // 개발 환경에서는 렌더링하지 않음
  if (isDevelopment) {
    return null;
  }

  // 다운로드 중일 때 모달 표시 - AlertModal 스타일 적용
  if (isDownloading) {
    return (
      <Portal>
        <Modal
          visible={true}
          dismissable={false}
          contentContainerStyle={styles.modalContainer}
        >
          <View style={styles.modalContent}>
            <View style={styles.loadingContainer}>
              <IconButton
                icon="download"
                size={RFValue(32)}
                iconColor={color.secondary}
                style={styles.downloadIcon}
                animated
              />
              <ActivityIndicator
                size="large"
                color={color.secondary}
                style={styles.loadingIndicator}
              />
            </View>
            <Text style={styles.modalTitle}>업데이트 다운로드 중</Text>
            <Text style={styles.modalText}>
              새로운 버전을 준비하고 있습니다.{'\n'}
              잠시만 기다려주세요...
            </Text>
          </View>
        </Modal>
      </Portal>
    );
  }

  return null;
}

/**
 * 수동 업데이트 체크 버튼 컴포넌트
 * 설정 화면 등에서 사용
 */
export function UpdateCheckButton() {
  const { isChecking, checkForUpdate, isDevelopment, updateId, channel } = useEASUpdate();

  if (isDevelopment) {
    return (
      <View style={styles.updateInfo}>
        <Text style={styles.updateInfoText}>개발 환경 (업데이트 비활성화)</Text>
      </View>
    );
  }

  return (
    <TouchableOpacity
      style={styles.updateButton}
      onPress={() => checkForUpdate(false)}
      disabled={isChecking}
      activeOpacity={0.8}
    >
      <View style={styles.updateButtonContent}>
        <View style={styles.updateButtonLeft}>
          <MaterialIcons
            name="system-update"
            size={RFValue(24)}
            color={color.primary}
          />
          <View style={styles.updateButtonTextContainer}>
            <Text style={styles.updateButtonTitle}>업데이트 확인</Text>
            {updateId && (
              <Text style={styles.updateButtonSubtitle}>
                현재: {channel || 'production'} 채널
              </Text>
            )}
          </View>
        </View>
        {isChecking ? (
          <ActivityIndicator size="small" color={color.primary} />
        ) : (
          <MaterialIcons
            name="chevron-right"
            size={RFValue(24)}
            color="#999"
          />
        )}
      </View>
    </TouchableOpacity>
  );
}

/**
 * 업데이트 상태 배지 컴포넌트
 * 업데이트가 대기 중일 때 표시
 */
export function UpdateStatusBadge() {
  const { isUpdatePending, isDevelopment } = useEASUpdate();

  if (isDevelopment || !isUpdatePending) {
    return null;
  }

  return (
    <View style={styles.badge}>
      <Text style={styles.badgeText}>업데이트 대기 중</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: RFValue(16),
    width: width * 0.85,
    alignSelf: 'center',
    overflow: 'hidden',
    elevation: 5,
  },
  modalContent: {
    paddingVertical: RFValue(32),
    paddingHorizontal: RFValue(24),
    alignItems: 'center',
  },
  loadingContainer: {
    position: 'relative',
    marginBottom: RFValue(20),
  },
  downloadIcon: {
    margin: 0,
    backgroundColor: 'transparent',
  },
  loadingIndicator: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -20 }, { translateY: -20 }],
  },
  modalTitle: {
    fontSize: RFValue(20),
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: RFValue(12),
    lineHeight: RFValue(26),
  },
  modalText: {
    fontSize: RFValue(16),
    color: '#555',
    textAlign: 'center',
    lineHeight: RFValue(22),
  },
  updateButton: {
    backgroundColor: 'white',
    borderRadius: RFValue(8),
    padding: RFValue(16),
    marginVertical: RFValue(4),
  },
  updateButtonContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  updateButtonLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  updateButtonTextContainer: {
    marginLeft: RFValue(12),
  },
  updateButtonTitle: {
    fontSize: RFValue(16),
    fontWeight: '500',
    color: '#333',
  },
  updateButtonSubtitle: {
    fontSize: RFValue(12),
    color: '#666',
    marginTop: RFValue(2),
  },
  updateInfo: {
    padding: RFValue(16),
    backgroundColor: '#f5f5f5',
    borderRadius: RFValue(8),
    marginVertical: RFValue(4),
  },
  updateInfoText: {
    fontSize: RFValue(14),
    color: '#666',
    textAlign: 'center',
  },
  badge: {
    backgroundColor: color.primary,
    paddingHorizontal: RFValue(8),
    paddingVertical: RFValue(4),
    borderRadius: RFValue(12),
  },
  badgeText: {
    color: 'white',
    fontSize: RFValue(10),
    fontWeight: '600',
  },
});