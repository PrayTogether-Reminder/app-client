import React from "react";
import { StyleSheet, View, ScrollView, TouchableOpacity, Text as RNText } from "react-native";
import {
  Title,
  Text,
  Button,
  Portal,
  IconButton,
  Modal,
} from "react-native-paper";
import { Avatar } from "../../../../../../src/common/components/avatar";
import { RFValue } from "react-native-responsive-fontsize";
import { color, flexMarker } from '../../../../../../src/common/styles/color';
import { RoomMember } from "../../../../../../src/domain/rooms/types/roomMember";
import { backgroundColor } from "../../../../../../src/common/styles/color";

interface PrayerMemberSelectionModalProps {
  visible: boolean;
  onDismiss: () => void;
  members: RoomMember[];
  onSelectMember: (member: RoomMember) => void;
  onCustomNamePress?: () => void;
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

        {members?.length === 0 ? (
          <View style={styles.emptyStateContainer}>
            <Text style={styles.emptyText}>
              모든 방 구성원에 대한 기도를 작성했습니다.
            </Text>
          </View>
        ) : (
          <ScrollView style={styles.modalScrollView} contentContainerStyle={styles.scrollViewContent}>
            <View style={styles.memberGrid}>
              {members?.map((member) => (
                <View
                  key={member.id}
                  style={styles.memberGridItem}
                >
                  <TouchableOpacity
                    style={styles.touchableArea}
                    onPress={() => onSelectMember(member)}
                  >
                    <Avatar name={member.name} size={40} />
                    <Text style={styles.memberName}>{member.name}</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </ScrollView>
        )}

        {onCustomNamePress && (
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
        )}
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
    minHeight: RFValue(300),
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
    lineHeight: RFValue(24),
  },
  modalScrollView: {
    minHeight: RFValue(150),
    maxHeight: RFValue(400),
  },
  scrollViewContent: {
    paddingBottom: RFValue(10),
  },
  memberGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
  },
  memberGridItem: {
    width: "33%",
    alignItems: "center",
    paddingHorizontal: RFValue(10),
    marginBottom: RFValue(16),
  },
  touchableArea: {
    alignItems: "center",
  },
  memberName: {
    marginTop: RFValue(8),
    textAlign: "center",
    fontSize: RFValue(14),
    color: color.black,
    lineHeight: RFValue(20),
    minHeight: RFValue(40),
  },
  emptyStateContainer: {
    height: RFValue(200),
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: RFValue(30),
  },
  emptyText: {
    textAlign: "center",
    color: color.black,
    fontStyle: "italic",
    fontSize: RFValue(14),
    lineHeight: RFValue(22),
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
    lineHeight: RFValue(22),
  },

});

export default PrayerMemberSelectionModal;
