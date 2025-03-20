import React from "react";
import { StyleSheet, View, ScrollView, TouchableOpacity } from "react-native";
import {
  Title,
  Text,
  Avatar,
  Button,
  Portal,
  IconButton,
  Modal,
} from "react-native-paper";
import { RFValue } from "react-native-responsive-fontsize";
import { color, flexMarker } from "../../../../common/styles/color";
import { RoomMember } from "../../../prayerRoom/types/dto/response/roomMember";
import { backgroundColor } from "./../../../../common/styles/color";

interface PrayerMemberSelectionModalProps {
  visible: boolean;
  onDismiss: () => void;
  members: RoomMember[];
  onSelectMember: (member: RoomMember) => void;
  onCustomNamePress: () => void;
}

const PrayerMemberSelectionModal = ({
  visible,
  onDismiss,
  members,
  onSelectMember,
  onCustomNamePress,
}: PrayerMemberSelectionModalProps) => {
  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={styles.modalContainer}
      >
        <View style={styles.modalHeader}>
          <Title style={styles.modalTitle}>기도 대상자 선택</Title>
          <IconButton icon="close" onPress={onDismiss} size={RFValue(32)} />
        </View>

        <ScrollView style={styles.modalScrollView}>
          <View style={styles.memberGrid}>
            {members?.map((member) => (
              <TouchableOpacity
                key={member.id}
                style={styles.memberGridItem}
                onPress={() => onSelectMember(member)}
              >
                <Avatar.Text
                  size={RFValue(40)}
                  label={member.name.charAt(0)}
                  labelStyle={styles.avatarLabel}
                  style={styles.avatarCricle}
                />
                <Text style={styles.memberName}>{member.name}</Text>
              </TouchableOpacity>
            ))}
            {members?.length === 0 && (
              <Text style={styles.emptyText}>
                모든 방 구성원에 대한 기도를 작성했습니다.
              </Text>
            )}
          </View>
        </ScrollView>

        <Button
          mode="contained"
          onPress={onCustomNamePress}
          style={styles.addCustomButton}
          contentStyle={styles.buttonContent}
        >
          <View style={styles.buttonInnerContainer}>
            <IconButton
              icon="plus"
              size={RFValue(24)}
              iconColor={color.white}
              style={styles.plusIcon}
            />
            <Text style={styles.buttonText}>직접 입력</Text>
          </View>
        </Button>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: "white",
    margin: RFValue(20),
    borderRadius: RFValue(10),
    padding: RFValue(20),
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: RFValue(16),
  },
  modalTitle: {
    fontSize: RFValue(18),
    fontWeight: "bold",
  },
  modalScrollView: {
    maxHeight: RFValue(400),
  },
  memberGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  memberGridItem: {
    width: "33%",
    alignItems: "center",
    padding: RFValue(10),
    marginBottom: RFValue(16),
  },
  memberName: {
    marginTop: RFValue(8),
    textAlign: "center",
    fontSize: RFValue(14),
  },
  emptyText: {
    textAlign: "center",
    padding: RFValue(8),
    color: color.black,
    fontStyle: "italic",
    fontSize: RFValue(14),
  },
  addCustomButton: {
    marginTop: RFValue(8),
    borderRadius: RFValue(20),
    paddingVertical: RFValue(4),
    backgroundColor: color.secondary,
  },
  buttonContent: {
    height: RFValue(40),
  },
  buttonInnerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  plusIcon: {
    margin: 0,
    padding: 0,
  },
  buttonText: {
    color: color.white,
    fontSize: RFValue(16),
    fontWeight: "bold",
    marginLeft: RFValue(8), // 아이콘과 텍스트 사이 간격 조정
  },
  avatarCricle: {
    backgroundColor: color.secondary,
  },
  avatarLabel: {
    fontSize: RFValue(16),
  },
});

export default PrayerMemberSelectionModal;
