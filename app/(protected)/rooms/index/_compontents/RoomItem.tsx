import React, { useState } from "react";
import { StyleSheet, View, useWindowDimensions } from "react-native";
import { Text } from "react-native-paper";
import { RFValue } from "react-native-responsive-fontsize";
import Entypo from "@expo/vector-icons/Entypo";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { AccentCard } from "@/common/components/card";
import ConfirmationModal from "@/common/components/modal/ConfirmationModal";
import { color } from "@/common/styles/color";
import { Room } from "@/domain/rooms/types/room";
import RoomInfoSheet from "./sheets/RoomOptionSheet";

interface RoomItemProps {
  room: Room;
  onRoomPress: (room: Room) => void;
  onNotificationToggle: (room: Room) => void;
  onLeaveRoom: (room: Room) => void;
}

const RoomItem = ({
  room,
  onRoomPress,
  onNotificationToggle,
  onLeaveRoom,
}: RoomItemProps) => {
  console.log("RoomItem rendering = " + room.id);
  const [showMenu, setShowMenu] = useState(false);
  const { width } = useWindowDimensions();
  const [showLeaveModal, setShowLeaveModal] = useState(false);

  const handleLongPress = () => {
    setShowMenu(true);
  };

  const handleRoomPress = () => {
    onRoomPress(room);
  };

  const handleNotificationToggle = () => {
    onNotificationToggle(room);
  };

  const handleLeaveRoom = () => {
    setShowLeaveModal(true);
  };

  const confirmLeaveRoom = () => {
    onLeaveRoom(room);
    setShowLeaveModal(false);
    setShowMenu(false);
  };

  const cancelLeaveRoom = () => {
    setShowLeaveModal(false);
  };

  return (
    <>
      <AccentCard
        onPress={handleRoomPress}
        onLongPress={handleLongPress}
        borderWidth={8}
        style={styles.card}
      >
        <View style={styles.contentContainer}>
          <View style={styles.headerRow}>
            <Text style={styles.title}>{room.name}</Text>
            <Entypo
              name="chevron-right"
              size={width * 0.07}
              color={color.black}
          />
          </View>

          <View style={styles.infoRow}>
            <View style={styles.memberRow}>
            <MaterialCommunityIcons
              name="hand-heart"
              size={RFValue(18)}
              color={color.grayLight}
            />
              <Text style={styles.memberText}>
                현재 {room.memberCnt}명
              </Text>
            </View>
          </View>
        </View>
      </AccentCard>

      <RoomInfoSheet
        showMenu={showMenu}
        setShowMenu={setShowMenu}
        room={room}
        onNotificationToggle={handleNotificationToggle}
        onLeaveRoom={handleLeaveRoom}
      />
      <ConfirmationModal
        visible={showLeaveModal}
        onDismiss={cancelLeaveRoom}
        onConfirm={confirmLeaveRoom}
        icon="exit-to-app"
        title="방 나가기"
        content="정말로 방을 나가시겠습니까?"
        confirmText="나가기"
        cancelText="취소"
      />
    </>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: RFValue(16),
  },
  contentContainer: {
    gap: RFValue(8),
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: RFValue(18),
    fontWeight: "bold",
    lineHeight: RFValue(24),
  },
  infoRow: {
    flexDirection: "row",
    gap: RFValue(16),
  },
  memberRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: RFValue(8),
  },
  memberText: {
    fontSize: RFValue(14),
    color: "gray",
    lineHeight: RFValue(20),
  },
});

export default RoomItem;
