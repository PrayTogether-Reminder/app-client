import ConfirmationModal from "@/common/components/modal/ConfirmationModal";
import { backgroundColor, color } from "@/common/styles/color";
import { Room } from "@/domain/rooms/types/room";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import React, { useRef, useState } from "react";
import {
  Animated,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import { Card, Text, useTheme } from "react-native-paper";
import { RFValue } from "react-native-responsive-fontsize";
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
  const theme = useTheme();
  const [showLeaveModal, setShowLeaveModal] = useState(false);

  // 애니메이션을 위한 Animated.Value 생성
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // 터치 시작할 때 실행되는 애니메이션 (축소)
  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.92,
      useNativeDriver: true,
      speed: 50,
      bounciness: 15,
    }).start();
  };

  // 터치 종료할 때 실행되는 애니메이션 (원래 크기로)
  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 15,
    }).start();
  };

  const handleLongPress = () => {
    setShowMenu(true);
    // 길게 눌렀을 때 진동 효과를 추가할 수도 있습니다 (react-native-haptic-feedback 필요)
    // ReactNativeHapticFeedback.trigger('impactMedium');
  };

  const handleRoomPress = () => {
    onRoomPress(room);
  };

  const handleNotificationToggle = () => {
    onNotificationToggle(room);
  };

  const handleLeaveRoom = () => {
    setShowLeaveModal(true); // 모달 표시
  };

  // 실제 방 나가기 확인 처리
  const confirmLeaveRoom = () => {
    onLeaveRoom(room);
    setShowLeaveModal(false);
    setShowMenu(false);
  };

  // 모달 닫기
  const cancelLeaveRoom = () => {
    setShowLeaveModal(false);
  };

  // Animated.View로 감싸서 애니메이션 적용
  return (
    <>
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onLongPress={handleLongPress}
        onPress={handleRoomPress}
        delayLongPress={200}
      >
        <Animated.View style={[{ transform: [{ scale: scaleAnim }] }]}>
          <Card
            style={[styles.card, { borderLeftColor: color.secondary }]}
            mode="elevated"
          >
            <Card.Content>
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
                    <AntDesign
                      name="user"
                      size={width * 0.08}
                      color={color.black}
                    />
                    <Text style={styles.memberText}>
                      현재 {room.memberCnt}명
                    </Text>
                  </View>
                </View>
              </View>
            </Card.Content>
          </Card>
        </Animated.View>
      </Pressable>

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
    backgroundColor: backgroundColor.white,
    marginBottom: RFValue(16),
    borderLeftWidth: RFValue(8),
    elevation: 4,
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
