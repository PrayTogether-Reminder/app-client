import Entypo from "@expo/vector-icons/Entypo";
import AntDesign from "@expo/vector-icons/AntDesign";
import React, { useState } from "react";
import { useWindowDimensions, Alert } from "react-native";
import { Card, Text, XStack, YStack } from "tamagui";
import useCloseOnBack from "../../../common/services/back-handler/useCloseOnBack";
import { color } from "../../../common/styles/color";
import { Room } from "../types/dto/responses/room";
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
    Alert.alert("방 나가기", "정말로 이 방을 나가시겠습니까?", [
      { text: "취소", style: "cancel" },
      {
        text: "나가기",
        style: "destructive",
        onPress: () => {
          onLeaveRoom(room);
          setShowMenu(false);
        },
      },
    ]);
  };

  useCloseOnBack(showMenu, setShowMenu);

  return (
    <>
      <Card
        elevate
        bordered
        animation="bouncy"
        pressStyle={{ scale: 0.95 }}
        onPress={handleRoomPress}
        onLongPress={handleLongPress}
        marginBottom="$4"
        padding="$4"
        borderLeftColor={color.secondary}
        borderLeftWidth="$2"
      >
        <YStack gap="$2">
          <XStack justifyContent="space-between" alignItems="center">
            <Text fontSize="$6" fontWeight="bold">
              {room.name}
            </Text>
            <Entypo name="chevron-right" size={width * 0.07} color="black" />
            {/* <ChevronRight size="$1" /> */}
          </XStack>

          <XStack gap="$4">
            <XStack gap="$2" alignItems="center">
              <AntDesign name="user" size={width * 0.08} color="black" />
              {/* <Users size="$1" /> */}
              <Text fontSize="$4" color="gray">
                현재 {room.memberCnt}명
              </Text>
            </XStack>
          </XStack>
        </YStack>
      </Card>

      <RoomInfoSheet
        showMenu={showMenu}
        setShowMenu={setShowMenu}
        room={room}
        onNotificationToggle={handleNotificationToggle}
        onLeaveRoom={handleLeaveRoom}
      />
    </>
  );
};

export default RoomItem;
