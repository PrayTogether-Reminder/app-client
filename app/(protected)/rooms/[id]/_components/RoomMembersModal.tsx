import React, { useState } from "react";
import { StyleSheet, Dimensions, View, ScrollView } from "react-native";
import { Portal, Modal, Button, Text } from "react-native-paper";
import { RFValue } from "react-native-responsive-fontsize";
import { color } from "../../../../../src/common/styles/color";
import { useSelectedRoomStore } from "../../../../../src/domain/rooms/stores/useSelectedRoomStore";
import { useRoomMembersQuery } from "@/domain/rooms/hooks/queries/useRoomQueries";

const { width } = Dimensions.get("window");

interface RoomMembersModalProps {
  visible: boolean;
  closeRightMenu: () => void;
  openInvite: () => void;
}

const RoomMembersModal: React.FC<RoomMembersModalProps> = ({
  visible,
  closeRightMenu,
  openInvite,
}) => {
  const drawerWidth = width * 0.5;
  const room = useSelectedRoomStore().selectedRoom;
  const { data: members = [] } = useRoomMembersQuery(room?.id ?? null);

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={closeRightMenu}
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
                <Text style={styles.memberName}>{member.name}</Text>
              </View>
            ))}
          </ScrollView>

          {/* 하단: 초대 버튼 */}
          <View style={styles.footerSection}>
            <Button
              mode="contained"
              style={styles.inviteButton}
              labelStyle={styles.inviteButtonLabel}
              onPress={openInvite}
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
    borderBottomColor: color.white,
  },
  memberCountText: {
    fontSize: RFValue(16),
    fontWeight: "bold",
    color: color.black,
  },
  memberListSection: {
    flex: 1,
    paddingHorizontal: 20,
  },
  memberItem: {
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: color.white,
  },
  memberName: {
    fontSize: RFValue(14),
    color: color.black,
  },
  footerSection: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: color.white,
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

export default RoomMembersModal;
