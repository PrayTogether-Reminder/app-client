import React from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import { List, Button } from "react-native-paper";

type ListSectionProps = {
  onGoToInvitations: () => void;
  onLogout: () => void;
};

export default function ListSection({
  onGoToInvitations,
  onLogout,
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
