import { Room } from "./room.list";
import React, { useCallback, useState } from "react";
import { Alert } from "react-native";
import useCloseOnBack from "../../../common/services/back-handler/close.on.back";
import { YStack, XStack, Card, Text } from "tamagui";
import { color } from "../../../common/styles/color";
import { Users, ChevronRight } from "@tamagui/lucide-icons";
import RoomInfoSheet from "./sheets/room.option.sheet";

interface RoomItemProps {
  room: Room;
  onRoomPress: (room: Room) => void;
  onNotificationToggle: (room: Room) => void;
  onLeaveRoom: (room: Room) => void;
}

const RoomItem = React.memo(
  ({ room, onRoomPress, onNotificationToggle, onLeaveRoom }: RoomItemProps) => {
    console.log("RoomItem rendering = " + room.id);
    const [showMenu, setShowMenu] = useState(false);

    const handleLongPress = () => {
      setShowMenu(true);
    };

    const handleRoomPress = () => {
      onRoomPress(room);
    };

    const handleNotificationToggle = () => {
      onNotificationToggle(room);
    };

    const handleLeaveRoom = useCallback(() => {
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
    }, [room, onLeaveRoom]);

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
              <ChevronRight size="$1" />
            </XStack>

            <XStack gap="$4">
              <XStack gap="$2" alignItems="center">
                <Users size="$1" />
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
  }
);

export default RoomItem;
