// 직접 입력으로 기도 내용 추가 튜토리얼 슬라이드
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
  MockDialog,
} from "../mock/MockComponents";
import { FingerAnimation } from "../FingerAnimation";

interface DirectInputSlideProps {
  isActive: boolean;
}

const ICON_SIZE_SMALL = RFValue(14);
const ICON_SIZE_MEDIUM = RFValue(18);
const MARGIN_TOP_8 = RFValue(8);

type AnimationStep =
  | "tap-pencil-icon"
  | "show-input"
  | "type-name"
  | "type-content"
  | "tap-add";

export const DirectInputSlide: React.FC<DirectInputSlideProps> = ({
  isActive,
}) => {
  const [step, setStep] = useState<AnimationStep>("tap-pencil-icon");
  const [showDirectInput, setShowDirectInput] = useState(false);
  const [typedName, setTypedName] = useState("");
  const [typedContent, setTypedContent] = useState("");

  // 하이라이트 상태들
  const [highlightPencilIcon, setHighlightPencilIcon] = useState(false);
  const [highlightAddButton, setHighlightAddButton] = useState(false);

  // 요소 위치 측정을 위한 refs
  const containerRef = useRef<View>(null);
  const pencilIconRef = useRef<View>(null);
  const addButtonRef = useRef<View>(null);

  // 측정된 위치 저장
  const [pencilIconPosition, setPencilIconPosition] = useState({ x: 0, y: 0 });
  const [addButtonPosition, setAddButtonPosition] = useState({ x: 0, y: 0 });

  const dialogOpacity = useSharedValue(1);

  const CYCLE_DURATION = 12000;
  const NAME_TEXT = "할머니";
  const CONTENT_TEXT = "건강하게 해주세요";

  // 화살표 타이밍 상수
  const ARROW_PAUSE = 400;
  const ARROW_MOVE = 800;
  const ARROW_TAP = 300;
  const ARROW_ARRIVAL = ARROW_PAUSE + ARROW_MOVE;

  // 요소 위치 측정 함수들
  const measurePencilIcon = useCallback(() => {
    if (pencilIconRef.current && containerRef.current) {
      pencilIconRef.current.measureLayout(
        containerRef.current as any,
        (x, y, width, height) => {
          setPencilIconPosition({
            x: x + width / 2,
            y: y + height / 2,
          });
        },
        () => {}
      );
    }
  }, []);

  const measureAddButton = useCallback(() => {
    if (addButtonRef.current && containerRef.current) {
      addButtonRef.current.measureLayout(
        containerRef.current as any,
        (x, y, width, height) => {
          setAddButtonPosition({
            x: x + width / 2,
            y: y + height / 2,
          });
        },
        () => {}
      );
    }
  }, []);

  // 다이얼로그가 열리면 위치 측정
  useEffect(() => {
    const timer = setTimeout(() => {
      measurePencilIcon();
      measureAddButton();
    }, 100);
    return () => clearTimeout(timer);
  }, [measurePencilIcon, measureAddButton]);

  // 애니메이션 사이클
  useEffect(() => {
    if (!isActive) return;

    const timeouts: ReturnType<typeof setTimeout>[] = [];

    const startCycle = () => {
      // 초기화
      setStep("tap-pencil-icon");
      setShowDirectInput(false);
      setTypedName("");
      setTypedContent("");
      setHighlightPencilIcon(false);
      setHighlightAddButton(false);

      // ===== Step 1: 펜 아이콘 탭 =====
      timeouts.push(
        setTimeout(() => {
          setHighlightPencilIcon(true);
        }, ARROW_ARRIVAL)
      );

      const showInputStart = ARROW_ARRIVAL + ARROW_TAP + 300;
      timeouts.push(
        setTimeout(() => {
          setHighlightPencilIcon(false);
          setShowDirectInput(true);
          setStep("show-input");
        }, showInputStart)
      );

      // ===== Step 2: 이름 타이핑 =====
      const typeNameStart = showInputStart + 500;
      timeouts.push(
        setTimeout(() => {
          setStep("type-name");
          let charIndex = 0;
          const typeInterval = setInterval(() => {
            if (charIndex < NAME_TEXT.length) {
              setTypedName(NAME_TEXT.slice(0, charIndex + 1));
              charIndex++;
            } else {
              clearInterval(typeInterval);
            }
          }, 100);
        }, typeNameStart)
      );

      // ===== Step 3: 내용 타이핑 =====
      const typeContentStart = typeNameStart + NAME_TEXT.length * 100 + 500;
      timeouts.push(
        setTimeout(() => {
          setStep("type-content");
          let charIndex = 0;
          const typeInterval = setInterval(() => {
            if (charIndex < CONTENT_TEXT.length) {
              setTypedContent(CONTENT_TEXT.slice(0, charIndex + 1));
              charIndex++;
            } else {
              clearInterval(typeInterval);
            }
          }, 80);
        }, typeContentStart)
      );

      // ===== Step 4: 추가 버튼 탭 =====
      const tapAddStart = typeContentStart + CONTENT_TEXT.length * 80 + 500;
      timeouts.push(
        setTimeout(() => {
          setStep("tap-add");
        }, tapAddStart)
      );

      timeouts.push(
        setTimeout(() => {
          setHighlightAddButton(true);
        }, tapAddStart + ARROW_ARRIVAL)
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

  const dialogStyle = useAnimatedStyle(() => ({
    opacity: dialogOpacity.value,
  }));

  const getTargetPosition = () => {
    switch (step) {
      case "tap-pencil-icon":
        return pencilIconPosition;
      case "tap-add":
        return addButtonPosition;
      default:
        return { x: 0, y: 0 };
    }
  };

  const shouldShowFinger = () => {
    return step === "tap-pencil-icon" || step === "tap-add";
  };

  const targetPosition = getTargetPosition();
  const resetKey = step === "tap-pencil-icon" ? 1 : 2;

  return (
    <View style={styles.container}>
      <View
        ref={containerRef}
        style={styles.phoneContainer}
        onLayout={measurePencilIcon}
      >
        <MockPhone>
          <MockHeader title="우리 가족 기도방" showBack />

          {/* 기도 카드 */}
          <View style={styles.content}>
            <View style={styles.titleCard}>
              <View style={styles.titleCardAccent} />
              <Text style={styles.titleCardText}>3월 2주차</Text>
            </View>
          </View>

          <MockBottomButton icon="bell" text="기도 알림" />

          {/* 다이얼로그 */}
          <Animated.View style={[StyleSheet.absoluteFill, dialogStyle]}>
            <MockDialog
              title="기도 내용 추가"
              buttons={[
                { text: "취소" },
                { text: "추가", primary: true },
              ]}
              highlightButton={highlightAddButton}
              buttonRef={addButtonRef}
            >
              <View style={styles.dialogContent}>
                <Text style={styles.dialogLabel}>기도 대상</Text>
                <View style={styles.memberSelectRow}>
                  {showDirectInput ? (
                    // 직접 입력 모드
                    <View style={styles.directInputContainer}>
                      <Text style={styles.directInputText}>
                        {typedName}
                        {(step === "type-name" || step === "show-input") && (
                          <Text style={styles.cursor}>|</Text>
                        )}
                      </Text>
                    </View>
                  ) : (
                    // 선택 모드
                    <View style={styles.memberSelectButton}>
                      <Text style={styles.memberSelectPlaceholder}>
                        선택하세요
                      </Text>
                    </View>
                  )}
                  <View
                    ref={pencilIconRef}
                    style={[
                      styles.pencilIconButton,
                      highlightPencilIcon && styles.pencilIconHighlight,
                    ]}
                    onLayout={measurePencilIcon}
                  >
                    <MaterialCommunityIcons
                      name={showDirectInput ? "account-multiple" : "pencil"}
                      size={ICON_SIZE_SMALL}
                      color={color.primary}
                    />
                  </View>
                </View>

                <Text style={[styles.dialogLabel, { marginTop: MARGIN_TOP_8 }]}>
                  기도 내용
                </Text>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputText}>
                    {typedContent}
                    {step === "type-content" && (
                      <Text style={styles.cursor}>|</Text>
                    )}
                  </Text>
                </View>
              </View>
            </MockDialog>
          </Animated.View>
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
        <Text style={styles.title}>직접 입력</Text>
        <Text style={styles.description}>
          <Text style={styles.highlight}>펜 아이콘</Text>을 눌러{"\n"}
          <Text style={styles.highlight}>방에 없는 사람도</Text> 직접 이름을 입력해{"\n"}
          기도 내용을 추가할 수 있어요
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
  dialogContent: {
    marginVertical: RFValue(4),
  },
  dialogLabel: {
    fontSize: RFValue(9),
    color: color.gray,
    marginBottom: RFValue(2),
  },
  memberSelectRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: RFValue(6),
    marginVertical: RFValue(4),
  },
  memberSelectButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: color.gray + "60",
    borderRadius: RFValue(4),
    padding: RFValue(8),
  },
  memberSelectPlaceholder: {
    fontSize: RFValue(10),
    color: color.gray,
  },
  directInputContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: color.secondary,
    borderRadius: RFValue(4),
    padding: RFValue(8),
    backgroundColor: "#fff",
  },
  directInputText: {
    fontSize: RFValue(10),
    color: color.secondary,
    fontWeight: "bold",
  },
  pencilIconButton: {
    width: RFValue(32),
    height: RFValue(32),
    borderRadius: RFValue(4),
    backgroundColor: color.secondary,
    alignItems: "center",
    justifyContent: "center",
  },
  pencilIconHighlight: {
    backgroundColor: color.third,
    transform: [{ scale: 1.1 }],
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: color.gray + "60",
    borderRadius: RFValue(4),
    padding: RFValue(8),
    minHeight: RFValue(50),
    marginVertical: RFValue(4),
  },
  inputText: {
    fontSize: RFValue(10),
    color: color.secondary,
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

export default DirectInputSlide;
