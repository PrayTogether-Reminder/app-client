import Feather from "@expo/vector-icons/Feather";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  ScrollView,
  View,
  Animated,
  Dimensions,
  PanResponder,
  TouchableWithoutFeedback,
} from "react-native";
import {
  Surface,
  Text,
  Button,
  Portal,
  Modal,
  useTheme,
} from "react-native-paper";
import { RFValue } from "react-native-responsive-fontsize";
import { color } from "../../../../../../src/common/styles/color";
import { Room } from "../../../../../../src/domain/rooms/types/room";

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
  const theme = useTheme();
  const [animation] = useState(new Animated.Value(0));
  const { height } = Dimensions.get("window");
  const mountedRef = useRef(false);

  // 스와이프 기능을 위한 PanResponder 설정
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: (_, gestureState) => {
      // 아래로 스와이프할 때만 PanResponder 활성화
      return gestureState.dy > 0;
    },
    onPanResponderMove: (_, gestureState) => {
      // 아래로 드래그 시 애니메이션 값 조정
      if (gestureState.dy > 0) {
        // 드래그 거리를 0~1 사이의 값으로 변환
        const dragRatio = Math.min(gestureState.dy / (height * 0.7), 1);
        animation.setValue(1 - dragRatio);
      }
    },
    onPanResponderRelease: (_, gestureState) => {
      // 스와이프 거리가 충분하면 닫기, 아니면 원래 위치로
      if (gestureState.dy > height * 0.3 || gestureState.vy > 0.5) {
        closeSheet();
      } else {
        // 원래 위치로 복귀
        Animated.spring(animation, {
          toValue: 1,
          useNativeDriver: true,
        }).start();
      }
    },
  });

  useEffect(() => {
    if (mountedRef.current) {
      Animated.spring(animation, {
        toValue: showMenu ? 1 : 0,
        friction: 15, // 마찰력 증가 (값이 클수록 천천히 멈춤)
        tension: 10, // 장력 감소 (값이 작을수록 천천히 움직임)
        useNativeDriver: true,
      }).start();
    } else {
      mountedRef.current = true;
    }
  }, [showMenu]);

  const translateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [height, 0],
  });

  const handleNotificationToggle = () => {
    onNotificationToggle(room);
  };

  const handleLeaveRoom = () => {
    onLeaveRoom(room);
  };

  const closeSheet = () => {
    setShowMenu(false);
  };

  return (
    <Portal>
      <Modal
        visible={showMenu}
        onDismiss={closeSheet} // 뒤로 가기 버튼과 Modal 외부 클릭 시 자동으로 호출됨
        contentContainerStyle={styles.modalContent}
        dismissable={true} // 모달 외부 터치로 닫기 허용
      >
        <TouchableWithoutFeedback>
          <View style={styles.modalContainer}>
            <Animated.View
              style={[styles.sheetContainer, { transform: [{ translateY }] }]}
              {...panResponder.panHandlers} // 스와이프 기능 적용
            >
              <Surface style={styles.surface}>
                <View style={styles.handleContainer}>
                  <View style={styles.handle} />
                </View>

                <View style={styles.contentContainer}>
                  <Text style={styles.title}>{room.name}</Text>

                  <ScrollView
                    style={styles.scrollView}
                    showsVerticalScrollIndicator={true}
                  >
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

                    <Button
                      mode="contained"
                      onPress={handleLeaveRoom}
                      icon={({ size, color }) => (
                        <MaterialIcons name="logout" size={24} color={color} />
                      )}
                      style={[styles.button, styles.exitButton]}
                      buttonColor={color.exit}
                    >
                      방 나가기
                    </Button>
                  </View>
                </View>
              </Surface>
            </Animated.View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  modalContent: {
    margin: 0,
    justifyContent: "flex-end",
    height: "100%",
  },
  modalContainer: {
    height: "100%",
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  sheetContainer: {
    width: "100%",
    height: "80%",
    borderTopLeftRadius: RFValue(16),
    borderTopRightRadius: RFValue(16),
    overflow: "hidden",
  },
  surface: {
    height: "100%",
    borderTopLeftRadius: RFValue(16),
    borderTopRightRadius: RFValue(16),
    elevation: 8,
  },
  handleContainer: {
    padding: RFValue(8),
    alignItems: "center",
  },
  handle: {
    width: RFValue(40),
    height: RFValue(5),
    borderRadius: RFValue(3),
    backgroundColor: "#DDDDDD",
  },
  contentContainer: {
    flex: 1,
    padding: RFValue(16),
    gap: RFValue(16),
  },
  title: {
    fontSize: RFValue(24),
    fontWeight: "bold",
    textAlign: "center",
  },
  scrollView: {
    height: "65%",
  },
  description: {
    fontSize: RFValue(18),
    textAlign: "center",
  },
  buttonContainer: {
    gap: RFValue(16),
  },
  button: {
    padding: RFValue(4),
  },
  exitButton: {
    marginTop: RFValue(8),
  },
});
