// PrayerRoomDrawer.tsx
import React from "react";
import { StyleSheet, Dimensions, View, ScrollView } from "react-native";
import { Drawer, Text, Portal, Modal, Button } from "react-native-paper";
import { RFValue } from "react-native-responsive-fontsize";
import { color } from "../../../common/styles/color";

const { width, height } = Dimensions.get("window");

const SAMPLE_MEMBERS = [
  "김예수",
  "이하나님",
  "박성령",
  "최믿음",
  "정소망",
  "한사랑",
  "김예수",
  "이하나님",
  "박성령",
  "최믿음",
  "정소망",
  "한사랑",
  "김예수",
  "이하나님",
  "박성령",
  "최믿음",
  "정소망",
  "한사랑",
  "김예수",
  "이하나님",
  "박성령",
  "최믿음",
  "정소망",
  "한사랑",
];

interface PrayerRoomDrawerProps {
  visible: boolean;
  onClose: () => void;
  drawerWidth?: number;
  members?: string[]; // 멤버 목록을 props로 받을 수 있도록 추가
}

const PrayerRoomDrawer: React.FC<PrayerRoomDrawerProps> = ({
  visible,
  onClose,
  members = SAMPLE_MEMBERS, // 기본값으로 샘플 데이터 사용
}) => {
  const drawerWidth = width * 0.5;
  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onClose}
        contentContainerStyle={[styles.modal, { width: drawerWidth }]}
      >
        <View style={styles.container}>
          {/* 상단: 현재 인원 */}
          <View style={styles.headerSection}>
            <Text style={styles.memberCountText}>
              현재 인원: {members.length}명
            </Text>
          </View>

          {/* 중간: 멤버 목록 */}
          <ScrollView style={styles.memberListSection}>
            {members.map((member, index) => (
              <View key={index} style={styles.memberItem}>
                <Text style={styles.memberName}>{member}</Text>
              </View>
            ))}
          </ScrollView>

          {/* 하단: 초대 버튼 */}
          <View style={styles.footerSection}>
            <Button
              mode="contained"
              style={styles.inviteButton}
              labelStyle={styles.inviteButtonLabel}
              onPress={() => {
                // 초대 기능 구현
                console.log("방 초대 버튼 클릭");
              }}
            >
              방 초대
            </Button>
          </View>
        </View>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  modal: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    backgroundColor: color.primary,
    margin: 0,
    elevation: 5,
  },
  container: {
    flex: 1,
    flexDirection: "column",
    paddingTop: 50,
  },
  headerSection: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.2)",
  },
  memberCountText: {
    fontSize: RFValue(16),
    fontWeight: "bold",
    color: color.secondary,
  },
  memberListSection: {
    flex: 1,
    paddingHorizontal: 20,
  },
  memberItem: {
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  memberName: {
    fontSize: RFValue(14),
    color: color.secondary,
  },
  footerSection: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.2)",
  },
  inviteButton: {
    backgroundColor: color.third,
  },
  inviteButtonLabel: {
    fontSize: RFValue(14),
    color: color.primary,
    fontWeight: "bold",
  },
});

export default PrayerRoomDrawer;
