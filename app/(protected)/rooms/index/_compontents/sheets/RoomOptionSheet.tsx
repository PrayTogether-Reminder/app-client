import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { StyleSheet, ScrollView, View } from "react-native";
import { Text } from "react-native-paper";
import { RFValue } from "react-native-responsive-fontsize";
import { Room } from "../../../../../../src/domain/rooms/types/room";
import { CommonBottomSheet } from "../../../../../../src/common/components/bottomSheet";
import { DangerButton } from "@/common/components/button";

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
  const handleLeaveRoom = () => {
    setShowMenu(false);
    onLeaveRoom(room);
  };

  const closeSheet = () => {
    setShowMenu(false);
  };

  return (
    <CommonBottomSheet visible={showMenu} onDismiss={closeSheet} height="80%">
      <Text style={styles.title}>{room.name}</Text>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={true}>
        <Text style={styles.description}>{room.description}</Text>
      </ScrollView>

      <View style={styles.buttonContainer}>
        {/* <Button
          mode="outlined"
          onPress={handleNotificationToggle}
          icon={({ size, color }) => (
            <Feather
              name={room.isNotification ? "bell-off" : "bell"}
              size={24}
              color={color}
            />
          )}
          style={styles.button}
        >
          알림 {room.isNotification ? "끄기" : "켜기"}
        </Button> */}

        <DangerButton
          onPress={handleLeaveRoom}
          icon={({ size, color }) => (
            <MaterialIcons name="logout" size={24} color={color} />
          )}
          style={styles.exitButton}
        >
          방 나가기
        </DangerButton>
      </View>
    </CommonBottomSheet>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: RFValue(24),
    fontWeight: "bold",
    textAlign: "center",
    lineHeight: RFValue(30),
  },
  scrollView: {
    flex: 1,
    marginVertical: RFValue(16),
  },
  description: {
    fontSize: RFValue(18),
    textAlign: "center",
    lineHeight: RFValue(24),
  },
  buttonContainer: {
    gap: RFValue(16),
  },
  exitButton: {
    marginTop: RFValue(8),
  },
});
