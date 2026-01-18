import React, { useEffect, useRef } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  withRepeat,
  Easing,
  cancelAnimation,
  runOnJS,
} from "react-native-reanimated";
import { RFValue } from "react-native-responsive-fontsize";
import { Feather } from "@expo/vector-icons";

interface FingerAnimationProps {
  // 타겟 위치 (절대 픽셀 좌표)
  targetPosition: { x: number; y: number };
  // 애니메이션 재시작 트리거
  resetKey?: number;
  // 시작 오프셋 (타겟으로부터 얼마나 떨어진 곳에서 시작할지)
  startOffset?: { x: number; y: number };
  // 화살표 표시 여부
  visible?: boolean;
}

const FINGER_SIZE = RFValue(36);
const ANIMATION_DURATION = 800;
const TAP_DURATION = 150;
const PAUSE_DURATION = 400;
const DEFAULT_OFFSET = { x: -RFValue(30), y: -RFValue(60) };

export const FingerAnimation: React.FC<FingerAnimationProps> = ({
  targetPosition,
  resetKey = 0,
  startOffset = DEFAULT_OFFSET,
  visible = true,
}) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0);

  // 이전 visible 상태 추적
  const prevVisibleRef = useRef(visible);
  // 현재 애니메이션 중인지 추적
  const isAnimatingRef = useRef(false);

  // 화살표 끝(상단 중앙)이 타겟 중앙을 가리키도록 조정
  const endX = targetPosition.x - FINGER_SIZE / 2;
  const endY = targetPosition.y;
  const startX = endX + startOffset.x;
  const startY = endY + startOffset.y;

  // visible이 false가 되면 즉시 fade out
  useEffect(() => {
    if (!visible && prevVisibleRef.current) {
      // visible이 true에서 false로 변경됨 - 즉시 fade out
      cancelAnimation(translateX);
      cancelAnimation(translateY);
      cancelAnimation(scale);
      opacity.value = withTiming(0, { duration: 100 });
      isAnimatingRef.current = false;
    }
    prevVisibleRef.current = visible;
  }, [visible]);

  // 애니메이션 시작 (visible이 true이고 유효한 위치일 때)
  useEffect(() => {
    if (!visible) {
      return;
    }

    if (targetPosition.x === 0 && targetPosition.y === 0) {
      opacity.value = 0;
      return;
    }

    // 이전 애니메이션 취소
    cancelAnimation(translateX);
    cancelAnimation(translateY);
    cancelAnimation(scale);

    // 애니메이션 초기화
    translateX.value = startX;
    translateY.value = startY;
    scale.value = 1;
    opacity.value = withTiming(1, { duration: 200 });
    isAnimatingRef.current = true;

    // 애니메이션 시퀀스: 이동 → 탭 → 대기(길게) → 반복
    // startPosition으로 돌아가기 전에 충분히 대기해서 visible=false 시점에 endPosition에 있도록
    const STAY_AT_END_DURATION = TAP_DURATION * 2 + PAUSE_DURATION * 3; // 1500ms 대기

    translateX.value = withDelay(
      PAUSE_DURATION,
      withRepeat(
        withSequence(
          withTiming(endX, {
            duration: ANIMATION_DURATION,
            easing: Easing.bezier(0.25, 0.1, 0.25, 1),
          }),
          withDelay(
            STAY_AT_END_DURATION,
            withTiming(startX, { duration: 0 })
          )
        ),
        -1,
        false
      )
    );

    translateY.value = withDelay(
      PAUSE_DURATION,
      withRepeat(
        withSequence(
          withTiming(endY, {
            duration: ANIMATION_DURATION,
            easing: Easing.bezier(0.25, 0.1, 0.25, 1),
          }),
          withDelay(
            STAY_AT_END_DURATION,
            withTiming(startY, { duration: 0 })
          )
        ),
        -1,
        false
      )
    );

    // 탭 효과
    scale.value = withDelay(
      PAUSE_DURATION + ANIMATION_DURATION,
      withRepeat(
        withSequence(
          withTiming(0.85, { duration: TAP_DURATION }),
          withTiming(1, { duration: TAP_DURATION }),
          withDelay(PAUSE_DURATION, withTiming(1, { duration: 0 }))
        ),
        -1,
        false
      )
    );

    return () => {
      cancelAnimation(translateX);
      cancelAnimation(translateY);
      cancelAnimation(scale);
      isAnimatingRef.current = false;
    };
  }, [visible, resetKey, targetPosition.x, targetPosition.y]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
    opacity: opacity.value,
  }));

  // 항상 렌더링 (visible=false여도 fade out 애니메이션을 위해)
  return (
    <Animated.View style={[styles.fingerContainer, animatedStyle]}>
      <View style={styles.fingerShadow}>
        {/* 흰색 테두리 효과를 위한 뒷 레이어 */}
        <View style={styles.fingerOutline}>
          <Feather name="arrow-up" size={FINGER_SIZE + 6} color="#FFFFFF" />
        </View>
        {/* 메인 화살표 아이콘 (연한 초록색) */}
        <Feather name="arrow-up" size={FINGER_SIZE} color="#4ADE80" />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  fingerContainer: {
    position: "absolute",
    zIndex: 1000,
    pointerEvents: "none",
  },
  fingerShadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  fingerOutline: {
    position: "absolute",
    top: -3,
    left: -3,
  },
});

export default FingerAnimation;
