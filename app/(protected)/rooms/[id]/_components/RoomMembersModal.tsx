import React, { useState } from "react";
import { StyleSheet, Dimensions, View, ScrollView } from "react-native";
import { Portal, Modal, Button, Text } from "react-native-paper";
import { RFValue } from "react-native-responsive-fontsize";
import { color } from "../../../../../src/common/styles/color";
import { useSelectedRoomStore } from "../../../../../src/domain/rooms/stores/useSelectedRoomStore";
import { useRoomMembersQuery } from "@/domain/rooms/hooks/queries/useRoomQueries";
import LoadingScreen from "@/common/components/loading/LoadingScreen";
import FetchError from "@/common/components/error/FetchError";
import OverlayLoading from "@/common/components/loading/OverlayLoading";

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
  const {
    data: members = [],
    isError,
    error,
    isLoading,
    refetch,
  } = useRoomMembersQuery(room?.id ?? null);

  // 모달 내용 렌더링 함수
  const renderModalContent = () => {
    if (isLoading && !members.length) {
      return (
        <View style={styles.centeredContent}>
          <LoadingScreen />
        </View>
      );
    }

    if (isError) {
      return (
        <View style={styles.centeredContent}>
          <FetchError error={error} onRetry={refetch} isRetrying={isLoading} />
        </View>
      );
    }

    return (
      <>
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

        {/* 추가 로딩 상태일 때 오버레이 표시 */}
        {isLoading && <OverlayLoading />}
      </>
    );
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={closeRightMenu}
        contentContainerStyle={[styles.modal, { width: drawerWidth }]}
      >
        <View>{renderModalContent()}</View>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    position: "absolute",
    top: "0%",
    right: "0%",
    bottom: "0%",
    backgroundColor: color.primary,
    margin: "0%",
    elevation: 5,
  },
  centeredContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerSection: {
    paddingHorizontal: RFValue(20),
    paddingVertical: RFValue(20),
    borderBottomWidth: 1,
    borderBottomColor: color.white,
  },
  memberCountText: {
    fontSize: RFValue(16),
    fontWeight: "bold",
    color: color.black,
    lineHeight: RFValue(22),
  },
  memberListSection: {
    // flex: 1,
    paddingHorizontal: RFValue(20),
  },
  memberItem: {
    paddingVertical: RFValue(10),
    borderBottomWidth: 0.5,
    borderBottomColor: color.white,
  },
  memberName: {
    fontSize: RFValue(14),
    color: color.black,
    lineHeight: RFValue(20),
  },
  footerSection: {
    padding: RFValue(20),
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
    lineHeight: RFValue(20),
  },
});

export default RoomMembersModal;
