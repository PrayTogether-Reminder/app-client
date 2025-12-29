import React from "react";
import { StyleSheet, View, ScrollView, Alert, Linking } from "react-native";
import { List, Button } from "react-native-paper";
import { CONTACT_FORM_URL } from "@/common/constants/externalLinks";

type ListSectionProps = {
  onGoToInvitations: () => void;
  // onGoToFriends: () => void;
  onGoToNotifications: () => void;
  onChangePassword: () => void;
  onLogout: () => void;
  onDeleteAccount: () => void;
  showPasswordChange?: boolean;
};

export default function ListSection({
  onGoToInvitations,
  // onGoToFriends,
  onGoToNotifications,
  onChangePassword,
  onLogout,
  onDeleteAccount,
  showPasswordChange = true,
}: ListSectionProps): React.ReactElement {
  const handleInquiryPress = async () => {
    try {
      const supported = await Linking.canOpenURL(CONTACT_FORM_URL);
      if (supported) {
        await Linking.openURL(CONTACT_FORM_URL);
        return;
      }
    } catch (error) {
      console.error("Failed to open contact form", error);
    }

    Alert.alert(
      "링크를 열 수 없어요",
      "잠시 후 다시 시도해 주세요. 문제가 계속되면 운영팀에 알려주세요."
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <List.Section style={styles.listSection}>
        <List.Item
          title="기도방 초대 목록"
          description="받은 초대를 확인하세요."
          left={(props) => <List.Icon {...props} icon="email-outline" />}
          right={(props) => <List.Icon {...props} icon="chevron-right" />}
          onPress={onGoToInvitations}
        />
        {/* <List.Item
          title="친구 관리"
          description="친구 목록과 요청을 관리하세요."
          left={(props) => <List.Icon {...props} icon="account-group-outline" />}
          right={(props) => <List.Icon {...props} icon="chevron-right" />}
          onPress={onGoToFriends}
        /> */}
        <List.Item
          title="알림 설정"
          description="알림 수신 여부를 설정하세요."
          left={(props) => <List.Icon {...props} icon="bell-outline" />}
          right={(props) => <List.Icon {...props} icon="chevron-right" />}
          onPress={onGoToNotifications}
        />
        {showPasswordChange && (
          <List.Item
            title="비밀번호 변경"
            description="새로운 비밀번호로 변경하세요."
            left={(props) => <List.Icon {...props} icon="lock-reset" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={onChangePassword}
          />
        )}
        <List.Item
          title="1:1 문의"
          description="문의사항을 남겨주세요."
          left={(props) => <List.Icon {...props} icon="help-circle-outline" />}
          right={(props) => <List.Icon {...props} icon="open-in-new" />}
          onPress={handleInquiryPress}
        />
        <List.Item
          title="회원 탈퇴"
          description="계정을 완전히 삭제합니다."
          left={(props) => <List.Icon {...props} icon="account-remove-outline" />}
          right={(props) => <List.Icon {...props} icon="chevron-right" />}
          onPress={onDeleteAccount}
        />
      </List.Section>

      <View style={styles.logoutContainer}>
        <Button
          mode="contained"
          onPress={onLogout}
          style={styles.logoutButton}
          icon="logout"
        >
          로그아웃
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  contentContainer: {
    paddingBottom: 20,
  },
  listSection: {
    marginTop: 16,
  },
  logoutContainer: {
    paddingHorizontal: 16,
    marginTop: 24,
  },
  logoutButton: {},
});
