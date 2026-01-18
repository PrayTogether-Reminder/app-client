// 기도방 생성 튜토리얼 슬라이드
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
import { AntDesign } from "@expo/vector-icons";
import { color } from "../../../styles/color";
import {
  MockPhone,
  MockHeader,
  MockCard,
  MockDialog,
} from "../mock/MockComponents";
import { FingerAnimation } from "../FingerAnimation";

interface CreateRoomSlideProps {
  isActive: boolean;
}

// RFValue는 UI 스레드에서 호출하면 안 되므로 미리 계산
const ICON_SIZE = RFValue(20);

type AnimationStep =
  | "tap-fab"
  | "show-dialog"
  | "type-title"
  | "type-description"
  | "tap-create"
  | "show-card";

export const CreateRoomSlide: React.FC<CreateRoomSlideProps> = ({ isActive }) => {
  const [step, setStep] = useState<AnimationStep>("tap-fab");
  const [showDialog, setShowDialog] = useState(false);
  const [typedTitle, setTypedTitle] = useState("");
  const [typedDescription, setTypedDescription] = useState("");
  const [showNewCard, setShowNewCard] = useState(false);
  const [highlightCreateButton, setHighlightCreateButton] = useState(false);

  // 요소 위치 측정을 위한 refs
  const containerRef = useRef<View>(null);
  const fabRef = useRef<View>(null);
  const createButtonRef = useRef<View>(null);

  // 측정된 위치 저장
  const [fabPosition, setFabPosition] = useState({ x: 0, y: 0 });
  const [createButtonPosition, setCreateButtonPosition] = useState({ x: 0, y: 0 });

  const fabHighlight = useSharedValue(0);
  const dialogOpacity = useSharedValue(0);
  const newCardOpacity = useSharedValue(0);
  const newCardScale = useSharedValue(0.8);

  const CYCLE_DURATION = 11000;
  const TITLE_TEXT = "새 기도방";
  const DESCRIPTION_TEXT = "함께 기도해요";

  // FAB 위치 측정
  const measureFab = useCallback(() => {
    if (fabRef.current && containerRef.current) {
      fabRef.current.measureLayout(
        containerRef.current as any,
        (x, y, width, height) => {
          setFabPosition({
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
      // 다이얼로그 렌더링 후 측정
      const timer = setTimeout(measureCreateButton, 100);
      return () => clearTimeout(timer);
    }
  }, [showDialog, measureCreateButton]);

  useEffect(() => {
    if (!isActive) {
      setStep("tap-fab");
      setShowDialog(false);
      setTypedTitle("");
      setTypedDescription("");
      setShowNewCard(false);
      return;
    }

    let timeouts: ReturnType<typeof setTimeout>[] = [];

    const startCycle = () => {
      // 초기화
      setStep("tap-fab");
      setShowDialog(false);
      setTypedTitle("");
      setTypedDescription("");
      setShowNewCard(false);
      setHighlightCreateButton(false);
      fabHighlight.value = 0;
      dialogOpacity.value = 0;
      newCardOpacity.value = 0;
      newCardScale.value = 0.8;

      // 화살표 타이밍 상수 (FingerAnimation과 동기화)
      const ARROW_PAUSE = 400;
      const ARROW_MOVE = 800;
      const ARROW_TAP = 300;
      const ARROW_ARRIVAL = ARROW_PAUSE + ARROW_MOVE; // 1200ms

      // Step 1: FAB 탭 - 화살표가 도착할 때 하이라이트
      timeouts.push(
        setTimeout(() => {
          fabHighlight.value = withSequence(
            withTiming(1, { duration: 200 }),
            withTiming(0, { duration: 200 })
          );
        }, ARROW_ARRIVAL)
      );

      // Step 2: 다이얼로그 표시 (화살표 탭 후)
      timeouts.push(
        setTimeout(() => {
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
            if (charIndex < TITLE_TEXT.length) {
              setTypedTitle(TITLE_TEXT.slice(0, charIndex + 1));
              charIndex++;
            } else {
              clearInterval(typeInterval);
            }
          }, 100);
        }, 2500)
      );

      // Step 4: 설명 타이핑
      timeouts.push(
        setTimeout(() => {
          setStep("type-description");
          let charIndex = 0;
          const typeInterval = setInterval(() => {
            if (charIndex < DESCRIPTION_TEXT.length) {
              setTypedDescription(DESCRIPTION_TEXT.slice(0, charIndex + 1));
              charIndex++;
            } else {
              clearInterval(typeInterval);
            }
          }, 100);
        }, 4000)
      );

      // Step 5: 생성 버튼으로 화살표 이동 시작
      const tapCreateStart = 5500;
      timeouts.push(
        setTimeout(() => {
          setStep("tap-create");
        }, tapCreateStart)
      );

      // Step 5.5: 화살표 도착 후 버튼 하이라이트
      timeouts.push(
        setTimeout(() => {
          setHighlightCreateButton(true);
        }, tapCreateStart + ARROW_ARRIVAL)
      );

      // Step 6: 화살표 먼저 숨기기 (탭 완료 후)
      timeouts.push(
        setTimeout(() => {
          setStep("show-card");
          setHighlightCreateButton(false);
        }, tapCreateStart + ARROW_ARRIVAL + ARROW_TAP + 300)
      );

      // Step 7: 다이얼로그 닫고 카드 표시
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

  const fabHighlightStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 1 + fabHighlight.value * 0.15 }],
  }));

  const dialogStyle = useAnimatedStyle(() => ({
    opacity: dialogOpacity.value,
  }));

  const newCardStyle = useAnimatedStyle(() => ({
    opacity: newCardOpacity.value,
    transform: [{ scale: newCardScale.value }],
  }));

  // 현재 타겟 위치 계산
  const getTargetPosition = () => {
    switch (step) {
      case "tap-fab":
        return fabPosition;
      case "tap-create":
        return createButtonPosition;
      default:
        return { x: 0, y: 0 };
    }
  };

  const shouldShowFinger = step === "tap-fab" || step === "tap-create";
  const targetPosition = getTargetPosition();

  return (
    <View style={styles.container}>
      <View
        ref={containerRef}
        style={styles.phoneContainer}
        onLayout={measureFab}
      >
        <MockPhone>
          {/* 헤더 */}
          <MockHeader title="기도방" rightIcon="help-circle-outline" />

          {/* 기도방 목록 */}
          <View style={styles.content}>
            {/* 새로 추가되는 카드 - 맨 위에 */}
            {showNewCard && (
              <Animated.View style={newCardStyle}>
                <MockCard title="새 기도방" subtitle="1명" highlight />
              </Animated.View>
            )}
            <MockCard title="우리 가족 기도방" subtitle="4명" />
            <MockCard title="셀 모임" subtitle="6명" />
          </View>

          {/* FAB */}
          <Animated.View
            ref={fabRef}
            style={[styles.fabContainer, fabHighlightStyle]}
            onLayout={measureFab}
          >
            <View style={styles.fab}>
              <AntDesign name="plus" size={ICON_SIZE} color="#fff" />
            </View>
          </Animated.View>

          {/* 다이얼로그 */}
          {showDialog && (
            <Animated.View style={[StyleSheet.absoluteFill, dialogStyle]}>
              <MockDialog
                title="기도방 생성"
                buttons={[{ text: "생성", primary: true }]}
                highlightButton={highlightCreateButton}
                buttonRef={createButtonRef}
              >
                <View style={styles.dialogContent}>
                  <Text style={styles.dialogLabel}>방 제목</Text>
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputText}>
                      {typedTitle}
                      {step === "type-title" && (
                        <Text style={styles.cursor}>|</Text>
                      )}
                    </Text>
                    {!typedTitle && (
                      <Text style={styles.placeholder}>방 제목이 무엇인가요?</Text>
                    )}
                  </View>

                  <Text style={[styles.dialogLabel, styles.marginTop]}>방 설명</Text>
                  <View style={[styles.inputContainer, styles.multilineInput]}>
                    <Text style={styles.inputText}>
                      {typedDescription}
                      {step === "type-description" && (
                        <Text style={styles.cursor}>|</Text>
                      )}
                    </Text>
                    {!typedDescription && (
                      <Text style={styles.placeholder}>어떤 기도를 위한 방인가요?</Text>
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
              resetKey={step === "tap-fab" ? 1 : 2}
              visible={shouldShowFinger && targetPosition.x > 0}
            />
          </View>
        )}
      </View>

      {/* 설명 */}
      <View style={styles.textContainer}>
        <Text style={styles.title}>기도방 생성</Text>
        <Text style={styles.description}>
          <Text style={styles.highlight}>+ 버튼</Text>을 누르고{"\n"}
          <Text style={styles.highlight}>방 제목과 설명</Text>을 입력 후 생성해보세요
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
  fabContainer: {
    position: "absolute",
    bottom: RFValue(20),
    right: RFValue(16),
  },
  fab: {
    backgroundColor: color.secondary,
    width: RFValue(44),
    height: RFValue(44),
    borderRadius: RFValue(22),
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  dialogContent: {
    marginVertical: RFValue(4),
  },
  dialogLabel: {
    fontSize: RFValue(9),
    color: color.gray,
    marginBottom: RFValue(2),
  },
  marginTop: {
    marginTop: RFValue(8),
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: color.gray + "60",
    borderRadius: RFValue(4),
    padding: RFValue(8),
    minHeight: RFValue(32),
  },
  multilineInput: {
    minHeight: RFValue(50),
  },
  inputText: {
    fontSize: RFValue(10),
    color: color.secondary,
  },
  placeholder: {
    fontSize: RFValue(10),
    color: color.gray + "80",
    position: "absolute",
    left: RFValue(8),
    top: RFValue(8),
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

export default CreateRoomSlide;
