import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Button,
  Alert,
  ScrollView,
  Linking,
  Platform,
} from "react-native";
import PushNotificationService from "@/common/services/notification/pushNotificationService";

export default function NotificationsScreen() {
  const [loading, setLoading] = useState(true);
  const [permissionStatus, setPermissionStatus] = useState(false);
  const pushService = PushNotificationService.getInstance();

  // 알림 상태 확인
  const checkPermissionStatus = async () => {
    setLoading(true);
    const status = await pushService.hasPermission();
    setPermissionStatus(status);
    setLoading(false);
  };

  // 컴포넌트 마운트시 상태 확인
  useEffect(() => {
    checkPermissionStatus();
  }, []);

  // 시스템 설정으로 이동
  const openNotificationSettings = () => {
    Alert.alert(
      "알림 설정",
      "알림 설정을 변경하려면 시스템 설정으로 이동해야 합니다.",
      [
        { text: "취소", style: "cancel" },
        {
          text: "설정으로 이동",
          onPress: () => {
            if (Platform.OS === "ios") {
              Linking.openURL("app-settings:");
            } else {
              Linking.openSettings();
            }
          },
        },
      ]
    );
  };

  // 설정 화면에서 돌아올 때 상태 갱신
  useEffect(() => {
    const subscription = Linking.addEventListener("url", () => {
      // 앱으로 돌아왔을 때 권한 상태 다시 확인
      checkPermissionStatus();
    });

    return () => subscription.remove();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>로딩 중...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>알림 설정</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>푸시 알림</Text>

        <View style={styles.statusContainer}>
          <Text style={styles.statusLabel}>현재 상태:</Text>
          <Text
            style={[
              styles.statusValue,
              permissionStatus ? styles.statusEnabled : styles.statusDisabled,
            ]}
          >
            {permissionStatus ? "활성화됨" : "비활성화됨"}
          </Text>
        </View>

        <Text style={styles.description}>
          {permissionStatus
            ? "알림이 활성화되어 있습니다. 알림 수신을 중지하려면 시스템 설정에서 변경하세요."
            : "알림이 비활성화되어 있습니다. 알림을 받으려면 시스템 설정에서 활성화하세요."}
        </Text>

        <View style={styles.buttonContainer}>
          <Button
            title="알림 설정 변경하기"
            onPress={openNotificationSettings}
          />
        </View>
      </View>

      {permissionStatus && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>앱 내 알림 설정</Text>
          {/* <Text style={styles.description}>
            알림이 활성화된 상태에서 아래 알림 유형을 설정할 수 있습니다.
          </Text> */}

          {/* 앱 내부적으로 조절 가능한 알림 설정들 */}

          {/* <View style={styles.settingItem}>
            <Text style={styles.settingTitle}>기도 완료 알림</Text>
            <Text style={styles.settingDescription}>
              기도가 완료되면 알림을 받습니다.
            </Text>
            <View style={styles.toggleContainer}>
              <Button
                title="활성화"
                onPress={() => {
                  // 앱 내 설정 로직
                }}
              />
              <View style={styles.buttonSpacer} />
              <Button
                title="비활성화"
                onPress={() => {
                  // 앱 내 설정 로직
                }}
              />
            </View>
          </View> */}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  section: {
    marginBottom: 30,
    padding: 16,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 15,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  statusLabel: {
    fontSize: 16,
    marginRight: 8,
  },
  statusValue: {
    fontSize: 16,
    fontWeight: "600",
  },
  statusEnabled: {
    color: "#34C759",
  },
  statusDisabled: {
    color: "#FF3B30",
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
    lineHeight: 20,
  },
  buttonContainer: {
    marginTop: 8,
  },
  settingItem: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#eaeaea",
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "500",
  },
  settingDescription: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
    marginBottom: 12,
  },
  toggleContainer: {
    flexDirection: "row",
  },
  buttonSpacer: {
    width: 12,
  },
});
