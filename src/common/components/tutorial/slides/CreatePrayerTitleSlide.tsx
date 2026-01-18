// 기도제목 작성 튜토리얼 슬라이드
import React, { useEffect, useState, useRef, useCallback } from "react";
import { View, StyleSheet, Text } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  Easing,
} from "react-native-reanimated";
import { RFValue } from "react-native-responsive-fontsize";
import { color } from "../../../styles/color";
import {
  MockPhone,
  MockHeader,
  MockCard,
  MockBottomButton,
  MockDialog,
} from "../mock/MockComponents";
import { FingerAnimation } from "../FingerAnimation";

interface CreatePrayerTitleSlideProps {
  isActive: boolean;
}

type AnimationStep =
  | "tap-button"
  | "show-dialog"
  | "type-title"
  | "tap-create"
  | "show-card";

export const CreatePrayerTitleSlide: React.FC<CreatePrayerTitleSlideProps> = ({
  isActive,
}) => {
  const [step, setStep] = useState<AnimationStep>("tap-button");
  const [showDialog, setShowDialog] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [showNewCard, setShowNewCard] = useState(false);
  const [highlightBottomButton, setHighlightBottomButton] = useState(false);
  const [highlightCreateButton, setHighlightCreateButton] = useState(false);

  // 요소 위치 측정을 위한 refs
  const containerRef = useRef<View>(null);
  const bottomButtonRef = useRef<View>(null);
  const createButtonRef = useRef<View>(null);

  // 측정된 위치 저장
  const [bottomButtonPosition, setBottomButtonPosition] = useState({ x: 0, y: 0 });
  const [createButtonPosition, setCreateButtonPosition] = useState({ x: 0, y: 0 });

  const dialogOpacity = useSharedValue(0);
  const buttonHighlight = useSharedValue(0);
  const newCardOpacity = useSharedValue(0);
  const newCardScale = useSharedValue(0.8);

  const FULL_TEXT = "3월 2주차";
  const CYCLE_DURATION = 10000;

  // 하단 버튼 위치 측정
  const measureBottomButton = useCallback(() => {
    if (bottomButtonRef.current && containerRef.current) {
      bottomButtonRef.current.measureLayout(
        containerRef.current as any,
        (x, y, width, height) => {
          setBottomButtonPosition({
            x: x + width / 2,
            y: y + height / 2,
          });
        },
        () => {}
      );
    }
  }, []);

  // 생성 버튼 위치 측정
  const measureCreateButton = useCallback(() => {
    if (createButtonRef.current && containerRef.current) {
      createButtonRef.current.measureLayout(
        containerRef.current as any,
        (x, y, width, height) => {
          setCreateButtonPosition({
            x: x + width / 2,
            y: y + height / 2,
          });
        },
        () => {}
      );
    }
  }, []);

  // 다이얼로그가 열리면 생성 버튼 위치 측정
  useEffect(() => {
    if (showDialog) {
      const timer = setTimeout(measureCreateButton, 100);
      return () => clearTimeout(timer);
    }
  }, [showDialog, measureCreateButton]);

  useEffect(() => {
    if (!isActive) {
      setStep("tap-button");
      setShowDialog(false);
      setTypedText("");
      setShowNewCard(false);
      return;
    }

    let timeouts: ReturnType<typeof setTimeout>[] = [];

    const startCycle = () => {
      // 초기화
      setStep("tap-button");
      setShowDialog(false);
      setTypedText("");
      setShowNewCard(false);
      setHighlightBottomButton(false);
      setHighlightCreateButton(false);
      dialogOpacity.value = 0;
      buttonHighlight.value = 0;
      newCardOpacity.value = 0;
      newCardScale.value = 0.8;

      // 화살표 타이밍 상수 (FingerAnimation과 동기화)
      const ARROW_PAUSE = 400;
      const ARROW_MOVE = 800;
      const ARROW_TAP = 300;
      const ARROW_ARRIVAL = ARROW_PAUSE + ARROW_MOVE; // 1200ms

      // Step 1: 하단 버튼 하이라이트 (화살표 도착 시)
      timeouts.push(
        setTimeout(() => {
          setHighlightBottomButton(true);
          buttonHighlight.value = withSequence(
            withTiming(1, { duration: 200 }),
            withTiming(0, { duration: 200 })
          );
        }, ARROW_ARRIVAL)
      );

      // Step 2: 다이얼로그 표시 (탭 효과 후)
      timeouts.push(
        setTimeout(() => {
          setHighlightBottomButton(false);
          setShowDialog(true);
          setStep("show-dialog");
          dialogOpacity.value = withTiming(1, { duration: 300 });
        }, ARROW_ARRIVAL + ARROW_TAP + 300)
      );

      // Step 3: 제목 타이핑
      timeouts.push(
        setTimeout(() => {
          setStep("type-title");
          let charIndex = 0;
          const typeInterval = setInterval(() => {
            if (charIndex < FULL_TEXT.length) {
              setTypedText(FULL_TEXT.slice(0, charIndex + 1));
              charIndex++;
            } else {
              clearInterval(typeInterval);
            }
          }, 100);
        }, 2500)
      );

      // Step 4: 생성 버튼으로 화살표 이동 시작
      const tapCreateStart = 4500;
      timeouts.push(
        setTimeout(() => {
          setStep("tap-create");
        }, tapCreateStart)
      );

      // Step 4.5: 화살표 도착 후 생성 버튼 하이라이트
      timeouts.push(
        setTimeout(() => {
          setHighlightCreateButton(true);
        }, tapCreateStart + ARROW_ARRIVAL)
      );

      // Step 5: 화살표 먼저 숨기기
      timeouts.push(
        setTimeout(() => {
          setStep("show-card");
          setHighlightCreateButton(false);
        }, tapCreateStart + ARROW_ARRIVAL + ARROW_TAP + 300)
      );

      // Step 6: 다이얼로그 닫고 카드 표시
      timeouts.push(
        setTimeout(() => {
          setShowDialog(false);
          dialogOpacity.value = withTiming(0, { duration: 200 });
          setShowNewCard(true);
          newCardOpacity.value = withTiming(1, { duration: 300 });
          newCardScale.value = withTiming(1, {
            duration: 300,
            easing: Easing.out(Easing.back(1.5)),
          });
        }, tapCreateStart + ARROW_ARRIVAL + ARROW_TAP + 400)
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
      timeouts.forEach((t) => clearTimeout(t));
    };
  }, [isActive]);

  const dialogStyle = useAnimatedStyle(() => ({
    opacity: dialogOpacity.value,
  }));

  const buttonHighlightStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 1 + buttonHighlight.value * 0.05 }],
  }));

  const newCardStyle = useAnimatedStyle(() => ({
    opacity: newCardOpacity.value,
    transform: [{ scale: newCardScale.value }],
  }));

  // 현재 타겟 위치 계산
  const getTargetPosition = () => {
    switch (step) {
      case "tap-button":
        return bottomButtonPosition;
      case "tap-create":
        return createButtonPosition;
      default:
        return { x: 0, y: 0 };
    }
  };

  const shouldShowFinger = step === "tap-button" || step === "tap-create";
  const targetPosition = getTargetPosition();

  return (
    <View style={styles.container}>
      <View
        ref={containerRef}
        style={styles.phoneContainer}
        onLayout={measureBottomButton}
      >
        <MockPhone>
          {/* 헤더 */}
          <MockHeader title="우리 가족 기도방" showBack rightIcon="menu" />

          {/* 기도제목 목록 */}
          <View style={styles.content}>
            <MockCard title="3월 1주차" subtitle="5명의 기도" />

            {/* 새로 추가되는 카드 */}
            {showNewCard && (
              <Animated.View style={newCardStyle}>
                <MockCard title="3월 2주차" subtitle="0명의 기도" highlight />
              </Animated.View>
            )}
          </View>

          {/* 하단 버튼 */}
          <Animated.View
            ref={bottomButtonRef}
            style={buttonHighlightStyle}
            onLayout={measureBottomButton}
          >
            <MockBottomButton
              icon="pencil"
              text="기도제목 작성하기"
              highlight={highlightBottomButton}
            />
          </Animated.View>

          {/* 다이얼로그 */}
          {showDialog && (
            <Animated.View style={[StyleSheet.absoluteFill, dialogStyle]}>
              <MockDialog
                title="기도 제목 작성"
                buttons={[
                  { text: "취소" },
                  { text: "생성", primary: true },
                ]}
                highlightButton={highlightCreateButton}
                buttonRef={createButtonRef}
              >
                <View style={styles.dialogContent}>
                  <Text style={styles.dialogLabel}>기도 제목</Text>
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputText}>
                      {typedText}
                      {step === "type-title" && (
                        <Text style={styles.cursor}>|</Text>
                      )}
                    </Text>
                    {!typedText && (
                      <Text style={styles.placeholder}>무엇을 위해 기도하시나요?</Text>
                    )}
                  </View>
                </View>
              </MockDialog>
            </Animated.View>
          )}
        </MockPhone>

        {/* 손가락 애니메이션 - 항상 렌더링하고 visible로 제어 */}
        {isActive && (
          <View style={styles.fingerWrapper}>
            <FingerAnimation
              targetPosition={targetPosition}
              resetKey={step === "tap-button" ? 1 : 2}
              visible={shouldShowFinger && targetPosition.x > 0}
            />
          </View>
        )}
      </View>

      {/* 설명 */}
      <View style={styles.textContainer}>
        <Text style={styles.title}>기도 제목 작성</Text>
        <Text style={styles.description}>
          하단의{" "}
          <Text style={styles.highlight}>기도제목 작성하기</Text> 버튼을 눌러{"\n"}
          새 기도제목을 만들어보세요
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
    paddingTop: RFValue(10),
  },
  dialogContent: {
    marginVertical: RFValue(8),
  },
  dialogLabel: {
    fontSize: RFValue(10),
    color: color.gray,
    marginBottom: RFValue(4),
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: color.secondary,
    borderRadius: RFValue(4),
    padding: RFValue(10),
    minHeight: RFValue(36),
  },
  inputText: {
    fontSize: RFValue(11),
    color: color.secondary,
  },
  placeholder: {
    fontSize: RFValue(10),
    color: color.gray + "80",
    position: "absolute",
    left: RFValue(10),
    top: RFValue(10),
  },
  cursor: {
    color: color.secondary,
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

export default CreatePrayerTitleSlide;
