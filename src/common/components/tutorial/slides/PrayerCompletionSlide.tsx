// 기도 완료 알림 튜토리얼 슬라이드
import React, { useEffect, useState, useRef, useCallback } from "react";
import { View, StyleSheet, Text } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
} from "react-native-reanimated";
import { RFValue } from "react-native-responsive-fontsize";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { color } from "../../../styles/color";
import {
  MockPhone,
  MockHeader,
  MockBottomButton,
} from "../mock/MockComponents";
import { FingerAnimation } from "../FingerAnimation";

interface PrayerCompletionSlideProps {
  isActive: boolean;
}

const ICON_SIZE_SMALL = RFValue(14);
const ICON_SIZE_MEDIUM = RFValue(20);

type AnimationStep =
  | "tap-bell"
  | "show-modal"
  | "tap-confirm"
  | "show-success";

export const PrayerCompletionSlide: React.FC<PrayerCompletionSlideProps> = ({
  isActive,
}) => {
  const [step, setStep] = useState<AnimationStep>("tap-bell");
  const [showModal, setShowModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // 하이라이트 상태들
  const [highlightBell, setHighlightBell] = useState(false);
  const [highlightConfirm, setHighlightConfirm] = useState(false);

  // 요소 위치 측정을 위한 refs
  const containerRef = useRef<View>(null);
  const bellButtonRef = useRef<View>(null);
  const confirmButtonRef = useRef<View>(null);

  // 측정된 위치 저장
  const [bellButtonPosition, setBellButtonPosition] = useState({ x: 0, y: 0 });
  const [confirmButtonPosition, setConfirmButtonPosition] = useState({ x: 0, y: 0 });

  const modalOpacity = useSharedValue(0);
  const successOpacity = useSharedValue(0);
  const successScale = useSharedValue(0.5);

  const CYCLE_DURATION = 10000;

  // 화살표 타이밍 상수
  const ARROW_PAUSE = 400;
  const ARROW_MOVE = 800;
  const ARROW_TAP = 300;
  const ARROW_ARRIVAL = ARROW_PAUSE + ARROW_MOVE;

  // 요소 위치 측정 함수들
  const measureBellButton = useCallback(() => {
    if (bellButtonRef.current && containerRef.current) {
      bellButtonRef.current.measureLayout(
        containerRef.current as any,
        (x, y, width, height) => {
          setBellButtonPosition({
            x: x + width / 2,
            y: y + height / 2,
          });
        },
        () => {}
      );
    }
  }, []);

  const measureConfirmButton = useCallback(() => {
    if (confirmButtonRef.current && containerRef.current) {
      confirmButtonRef.current.measureLayout(
        containerRef.current as any,
        (x, y, width, height) => {
          setConfirmButtonPosition({
            x: x + width / 2,
            y: y + height / 2,
          });
        },
        () => {}
      );
    }
  }, []);

  // 모달이 열리면 확인 버튼 위치 측정
  useEffect(() => {
    if (showModal) {
      const timer = setTimeout(measureConfirmButton, 100);
      return () => clearTimeout(timer);
    }
  }, [showModal, measureConfirmButton]);

  // 애니메이션 사이클
  useEffect(() => {
    if (!isActive) return;

    let timeouts: ReturnType<typeof setTimeout>[] = [];

    const startCycle = () => {
      // 초기화
      setStep("tap-bell");
      setShowModal(false);
      setShowSuccess(false);
      setHighlightBell(false);
      setHighlightConfirm(false);
      modalOpacity.value = 0;
      successOpacity.value = 0;
      successScale.value = 0.5;

      // ===== Step 1: 기도 알림 버튼 탭 =====
      timeouts.push(
        setTimeout(() => {
          setHighlightBell(true);
        }, ARROW_ARRIVAL)
      );

      const showModalStart = ARROW_ARRIVAL + ARROW_TAP + 300;
      timeouts.push(
        setTimeout(() => {
          setHighlightBell(false);
          setShowModal(true);
          setStep("show-modal");
          modalOpacity.value = withTiming(1, { duration: 300 });
        }, showModalStart)
      );

      // ===== Step 2: 확인 버튼 탭 =====
      const tapConfirmStart = showModalStart + 800;
      timeouts.push(
        setTimeout(() => {
          setStep("tap-confirm");
        }, tapConfirmStart)
      );

      timeouts.push(
        setTimeout(() => {
          setHighlightConfirm(true);
        }, tapConfirmStart + ARROW_ARRIVAL)
      );

      // ===== Step 3: 성공 메시지 표시 =====
      const showSuccessStart = tapConfirmStart + ARROW_ARRIVAL + ARROW_TAP + 300;
      timeouts.push(
        setTimeout(() => {
          setHighlightConfirm(false);
          setShowModal(false);
          modalOpacity.value = withTiming(0, { duration: 200 });
          setShowSuccess(true);
          setStep("show-success");
          successOpacity.value = withTiming(1, { duration: 300 });
          successScale.value = withSequence(
            withTiming(1.1, { duration: 200 }),
            withTiming(1, { duration: 150 })
          );
        }, showSuccessStart)
      );

      // 사이클 반복
      timeouts.push(
        setTimeout(() => {
          startCycle();
        }, CYCLE_DURATION)
      );
    };

    startCycle();

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [isActive]);

  const modalStyle = useAnimatedStyle(() => ({
    opacity: modalOpacity.value,
  }));

  const successStyle = useAnimatedStyle(() => ({
    opacity: successOpacity.value,
    transform: [{ scale: successScale.value }],
  }));

  const getTargetPosition = () => {
    switch (step) {
      case "tap-bell":
        return bellButtonPosition;
      case "tap-confirm":
        return confirmButtonPosition;
      default:
        return { x: 0, y: 0 };
    }
  };

  const shouldShowFinger = () => {
    return step === "tap-bell" || step === "tap-confirm";
  };

  const targetPosition = getTargetPosition();
  const resetKey = step === "tap-bell" ? 1 : 2;

  return (
    <View style={styles.container}>
      <View
        ref={containerRef}
        style={styles.phoneContainer}
        onLayout={measureBellButton}
      >
        <MockPhone>
          <MockHeader title="우리 가족 기도방" showBack />

          {/* 기도 카드 목록 */}
          <View style={styles.content}>
            <View style={styles.titleCard}>
              <View style={styles.titleCardAccent} />
              <Text style={styles.titleCardText}>3월 2주차</Text>
            </View>

            <View style={styles.prayerCard}>
              <View style={styles.prayerCardHeader}>
                <Text style={styles.prayerCardName}>엄마</Text>
              </View>
              <View style={styles.prayerCardDivider} />
              <Text style={styles.prayerCardContent}>
                건강하게 해주세요
              </Text>
            </View>

            <View style={styles.prayerCard}>
              <View style={styles.prayerCardHeader}>
                <Text style={styles.prayerCardName}>아빠</Text>
              </View>
              <View style={styles.prayerCardDivider} />
              <Text style={styles.prayerCardContent}>
                하나님을 더 사랑하게 해주세요
              </Text>
            </View>
          </View>

          {/* 하단 버튼 */}
          <View
            ref={bellButtonRef}
            onLayout={measureBellButton}
          >
            <MockBottomButton
              icon="bell"
              text="기도 알림"
              highlight={highlightBell}
            />
          </View>

          {/* 확인 모달 */}
          {showModal && (
            <Animated.View style={[styles.modalOverlay, modalStyle]}>
              <View style={styles.modal}>
                <MaterialCommunityIcons
                  name="bell-ring"
                  size={ICON_SIZE_MEDIUM * 2}
                  color={color.secondary}
                  style={styles.modalIcon}
                />
                <Text style={styles.modalTitle}>기도 완료 알림</Text>
                <Text style={styles.modalContent}>
                  기도 완료 알림을 전송하시겠습니까?
                </Text>
                <View style={styles.modalButtons}>
                  <View style={styles.modalButtonCancel}>
                    <Text style={styles.modalButtonCancelText}>취소</Text>
                  </View>
                  <View
                    ref={confirmButtonRef}
                    style={[
                      styles.modalButtonConfirm,
                      highlightConfirm && styles.modalButtonHighlight,
                    ]}
                    onLayout={measureConfirmButton}
                  >
                    <Text style={styles.modalButtonConfirmText}>확인</Text>
                  </View>
                </View>
              </View>
            </Animated.View>
          )}

          {/* 성공 메시지 */}
          {showSuccess && (
            <Animated.View style={[styles.successOverlay, successStyle]}>
              <View style={styles.successBox}>
                <MaterialCommunityIcons
                  name="check-circle"
                  size={ICON_SIZE_MEDIUM * 2.5}
                  color={color.secondary}
                />
                <Text style={styles.successText}>
                  기도 알림을 보냈습니다!
                </Text>
              </View>
            </Animated.View>
          )}
        </MockPhone>

        {/* 손가락 애니메이션 */}
        {isActive && (
          <View style={styles.fingerWrapper}>
            <FingerAnimation
              targetPosition={targetPosition}
              resetKey={resetKey}
              visible={shouldShowFinger() && targetPosition.x > 0}
            />
          </View>
        )}
      </View>

      {/* 설명 */}
      <View style={styles.textContainer}>
        <Text style={styles.title}>기도 알림</Text>
        <Text style={styles.description}>
          기도를 마친 후{"\n"}
          <Text style={styles.highlight}>기도 알림</Text> 버튼을 눌러{"\n"}
          함께 기도하는 분들에게 알려주세요
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: RFValue(20),
  },
  phoneContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  fingerWrapper: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9999,
    pointerEvents: "none",
  },
  content: {
    flex: 1,
    paddingTop: RFValue(8),
    paddingHorizontal: RFValue(10),
  },
  titleCard: {
    backgroundColor: "#fff",
    borderRadius: RFValue(8),
    height: RFValue(36),
    marginBottom: RFValue(8),
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  titleCardAccent: {
    width: RFValue(6),
    height: "100%",
    backgroundColor: color.secondary,
  },
  titleCardText: {
    fontSize: RFValue(12),
    fontWeight: "bold",
    color: color.secondary,
    paddingHorizontal: RFValue(10),
  },
  prayerCard: {
    backgroundColor: "#fff",
    borderRadius: RFValue(10),
    padding: RFValue(10),
    marginBottom: RFValue(6),
    borderLeftWidth: RFValue(4),
    borderLeftColor: color.secondary,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  prayerCardHeader: {
    marginBottom: RFValue(6),
  },
  prayerCardName: {
    fontSize: RFValue(13),
    fontWeight: "bold",
    color: color.secondary,
  },
  prayerCardDivider: {
    height: 1,
    backgroundColor: color.secondary + "30",
    marginBottom: RFValue(6),
  },
  prayerCardContent: {
    fontSize: RFValue(10),
    color: "#333",
    lineHeight: RFValue(14),
  },
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: RFValue(20),
  },
  modal: {
    backgroundColor: "#fff",
    borderRadius: RFValue(12),
    padding: RFValue(16),
    width: "100%",
    alignItems: "center",
  },
  modalIcon: {
    marginBottom: RFValue(8),
  },
  modalTitle: {
    fontSize: RFValue(14),
    fontWeight: "bold",
    color: color.secondary,
    marginBottom: RFValue(6),
  },
  modalContent: {
    fontSize: RFValue(11),
    color: color.gray,
    textAlign: "center",
    marginBottom: RFValue(12),
  },
  modalButtons: {
    flexDirection: "row",
    gap: RFValue(8),
    width: "100%",
  },
  modalButtonCancel: {
    flex: 1,
    paddingVertical: RFValue(8),
    borderRadius: RFValue(6),
    borderWidth: 1,
    borderColor: color.gray + "60",
    alignItems: "center",
  },
  modalButtonCancelText: {
    fontSize: RFValue(11),
    color: color.gray,
    fontWeight: "bold",
  },
  modalButtonConfirm: {
    flex: 1,
    paddingVertical: RFValue(8),
    borderRadius: RFValue(6),
    backgroundColor: color.secondary,
    alignItems: "center",
  },
  modalButtonHighlight: {
    transform: [{ scale: 1.05 }],
  },
  modalButtonConfirmText: {
    fontSize: RFValue(11),
    color: "#fff",
    fontWeight: "bold",
  },
  successOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  successBox: {
    backgroundColor: "#fff",
    borderRadius: RFValue(12),
    padding: RFValue(20),
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  successText: {
    fontSize: RFValue(13),
    fontWeight: "bold",
    color: color.secondary,
    marginTop: RFValue(8),
  },
  textContainer: {
    alignItems: "center",
    paddingVertical: RFValue(16),
  },
  title: {
    fontSize: RFValue(22),
    fontWeight: "bold",
    color: color.primary,
    marginBottom: RFValue(10),
  },
  description: {
    fontSize: RFValue(15),
    color: color.gray,
    textAlign: "center",
    lineHeight: RFValue(24),
  },
  highlight: {
    color: color.secondary,
    fontWeight: "bold",
  },
});

export default PrayerCompletionSlide;
