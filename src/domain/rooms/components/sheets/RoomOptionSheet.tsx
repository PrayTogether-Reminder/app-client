import { Bell, BellOff, LogOut } from "@tamagui/lucide-icons";
import { Button, ScrollView, Sheet, Text, YStack } from "tamagui";
import { buttonColor } from "../../../../common/styles/color";
import { Room } from "../../types/dto/responses/room";

interface RoomInfoSheetProp {
  showMenu: boolean;
  setShowMenu: (value: boolean) => void;
  room: Room;
  onNotificationToggle: (value: Room) => void;
  onLeaveRoom: (value: Room) => void;
}

export default function RoomInfoSheet({
  showMenu,
  setShowMenu,
  room,
  onNotificationToggle,
  onLeaveRoom,
}: RoomInfoSheetProp) {
  const handleNotificationToggle = () => {
    onNotificationToggle(room);
  };

  const handleLeaveRoom = () => {
    onLeaveRoom(room);
  };

  return (
    <Sheet
      modal
      open={showMenu}
      onOpenChange={setShowMenu}
      snapPoints={[80]}
      dismissOnSnapToBottom
      animation="fast"
    >
      <Sheet.Frame padding="$4">
        <Sheet.Handle />
        <YStack gap="$4">
          <Text fontSize="$9" fontWeight="bold" alignSelf="center">
            {room.name}
          </Text>

          <ScrollView
            height="65%" // 고정된 높이
            showsVerticalScrollIndicator={true} // 스크롤바 표시
          >
            <Text alignSelf="center" fontSize="$6">
              {room.description}
            </Text>
          </ScrollView>

          {/* 하단 버튼들 */}
          <Button
            icon={room.isNotification ? BellOff : Bell}
            onPress={handleNotificationToggle}
          >
            알림 {room.isNotification ? "끄기" : "켜기"}
          </Button>

          <Button
            icon={LogOut}
            backgroundColor={buttonColor.exit}
            onPress={handleLeaveRoom}
          >
            방 나가기
          </Button>
        </YStack>
      </Sheet.Frame>
    </Sheet>
  );
}
