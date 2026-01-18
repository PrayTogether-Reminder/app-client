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
  // 이전 resetKey 추적 (resetKey가 변경될 때만 애니메이션 재시작)
  const prevResetKeyRef = useRef(resetKey);
  // 고정된 타겟 위치 (resetKey가 바뀔 때만 업데이트)
  const lockedPositionRef = useRef({ x: 0, y: 0 });

  // resetKey가 변경되면 위치 잠금 업데이트
  if (resetKey !== prevResetKeyRef.current) {
    lockedPositionRef.current = { x: targetPosition.x, y: targetPosition.y };
    prevResetKeyRef.current = resetKey;
  }

  // 초기 위치 설정 (처음 유효한 위치가 들어올 때)
  if (lockedPositionRef.current.x === 0 && targetPosition.x > 0) {
    lockedPositionRef.current = { x: targetPosition.x, y: targetPosition.y };
  }

  // 고정된 위치 사용
  const lockedPosition = lockedPositionRef.current;

  // 화살표 끝(상단 중앙)이 타겟 중앙을 가리키도록 조정
  const endX = lockedPosition.x - FINGER_SIZE / 2;
  const endY = lockedPosition.y;
  const startX = endX + startOffset.x;
  const startY = endY + startOffset.y;

  // visible이 false가 되면 즉시 숨김
  useEffect(() => {
    if (!visible && prevVisibleRef.current) {
      // visible이 true에서 false로 변경됨
      // 위치 애니메이션은 취소하지 않고 opacity만 즉시 0으로 (점프 방지)
      opacity.value = 0;
      isAnimatingRef.current = false;
    }
    prevVisibleRef.current = visible;
  }, [visible]);

  // 애니메이션 시작 (visible이 true이고 유효한 위치일 때)
  useEffect(() => {
    if (!visible) {
      return;
    }

    if (lockedPosition.x === 0 && lockedPosition.y === 0) {
      opacity.value = 0;
      return;
    }

    // 이전 애니메이션 취소
    cancelAnimation(translateX);
    cancelAnimation(translateY);
    cancelAnimation(scale);

    // 애니메이션 초기화 - 먼저 opacity 0 확인 후 위치 설정
    opacity.value = 0;
    translateX.value = startX;
    translateY.value = startY;
    scale.value = 1;
    // 위치가 설정된 후 fade in (약간의 딜레이)
    opacity.value = withDelay(50, withTiming(1, { duration: 150 }));
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
  }, [visible, resetKey]);

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
        <Feather name="arrow-up" size={FINGER_SIZE} color="#22C55E" />
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
});

export default FingerAnimation;
