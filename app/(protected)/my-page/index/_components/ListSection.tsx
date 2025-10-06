import React from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import { List, Button } from "react-native-paper";

type ListSectionProps = {
  onGoToInvitations: () => void;
  // onGoToFriends: () => void;
  onGoToNotifications: () => void;
  onLogout: () => void;
  onDeleteAccount: () => void;
};

export default function ListSection({
  onGoToInvitations,
  // onGoToFriends,
  onGoToNotifications,
  onLogout,
  onDeleteAccount,
}: ListSectionProps): React.ReactElement {
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
