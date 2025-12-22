import { useState, useEffect, useRef, ReactNode } from "react";
import {
  StyleSheet,
  View,
  Animated,
  Dimensions,
  PanResponder,
  TouchableWithoutFeedback,
} from "react-native";
import { Surface, Portal, Modal } from "react-native-paper";
import { RFValue } from "react-native-responsive-fontsize";
import { color } from "@/common/styles/color";

interface CommonBottomSheetProps {
  visible: boolean;
  onDismiss: () => void;
  children: ReactNode;
  height?: string | number; // 기본값 "80%"
}

export default function CommonBottomSheet({
  visible,
  onDismiss,
  children,
  height = "80%",
}: CommonBottomSheetProps) {
  const [animation] = useState(new Animated.Value(0));
  const { height: screenHeight } = Dimensions.get("window");
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
        const dragRatio = Math.min(
          gestureState.dy / (screenHeight * 0.7),
          1
        );
        animation.setValue(1 - dragRatio);
      }
    },
    onPanResponderRelease: (_, gestureState) => {
      // 스와이프 거리가 충분하면 닫기, 아니면 원래 위치로
      if (gestureState.dy > screenHeight * 0.3 || gestureState.vy > 0.5) {
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
        toValue: visible ? 1 : 0,
        friction: 15, // 마찰력 증가 (값이 클수록 천천히 멈춤)
        tension: 10, // 장력 감소 (값이 작을수록 천천히 움직임)
        useNativeDriver: true,
      }).start();
    } else {
      mountedRef.current = true;
    }
  }, [visible]);

  const translateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [screenHeight, 0],
  });

  const closeSheet = () => {
    onDismiss();
  };

  // height를 숫자나 퍼센트로 처리
  const sheetHeight:
    | number
    | `${number}%`
    | "auto" =
    typeof height === "string"
      ? (height as `${number}%` | "auto")
      : `${(height / screenHeight) * 100}%`;

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={closeSheet}
        contentContainerStyle={styles.modalContent}
        dismissable={true}
      >
        <TouchableWithoutFeedback>
          <View style={styles.modalContainer}>
            <Animated.View
              style={[
                styles.sheetContainer,
                { height: sheetHeight, transform: [{ translateY }] },
              ]}
              {...panResponder.panHandlers}
            >
              <Surface style={styles.surface}>
                {/* Handle Bar */}
                <View style={styles.handleContainer}>
                  <View style={styles.handle} />
                </View>

                {/* 컨텐츠 영역 */}
                <View style={styles.contentContainer}>{children}</View>
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
    backgroundColor: color.grayDark,
  },
  contentContainer: {
    flex: 1,
    padding: RFValue(16),
  },
});
