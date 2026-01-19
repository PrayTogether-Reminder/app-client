// 기도문 작성 튜토리얼 슬라이드
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
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { color } from "../../../styles/color";
import {
  MockPhone,
  MockHeader,
  MockCard,
  MockBottomButton,
  MockDialog,
} from "../mock/MockComponents";
import { FingerAnimation } from "../FingerAnimation";

interface CreatePrayerContentSlideProps {
  isActive: boolean;
}

// RFValue는 UI 스레드에서 호출하면 안 되므로 미리 계산
const ICON_SIZE_SMALL = RFValue(14);
const ICON_SIZE_MEDIUM = RFValue(18);
const MARGIN_TOP_8 = RFValue(8);
const BORDER_RADIUS_12 = RFValue(12);
const HIGHLIGHT_BG_COLOR = color.secondary + "40";

type AnimationStep =
  | "tap-pencil"
  | "show-fab"
  | "tap-fab"
  | "show-dialog"
  | "tap-member-select"
  | "show-member-modal"
  | "select-member"
  | "type-content"
  | "tap-add"
  | "show-card";

export const CreatePrayerContentSlide: React.FC<CreatePrayerContentSlideProps> = ({
  isActive,
}) => {
  const [step, setStep] = useState<AnimationStep>("tap-pencil");
  const [isEditMode, setIsEditMode] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState("");
  const [typedContent, setTypedContent] = useState("");
  const [showNewCard, setShowNewCard] = useState(false);

  // 하이라이트 상태들
  const [highlightPencil, setHighlightPencil] = useState(false);
  const [highlightFab, setHighlightFab] = useState(false);
  const [highlightMemberSelect, setHighlightMemberSelect] = useState(false);
  const [highlightMemberItem, setHighlightMemberItem] = useState(false);
  const [highlightAddButton, setHighlightAddButton] = useState(false);

  // 요소 위치 측정을 위한 refs
  const containerRef = useRef<View>(null);
  const pencilRef = useRef<View>(null);
  const fabRef = useRef<View>(null);
  const memberSelectRef = useRef<View>(null);
  const memberItemRef = useRef<View>(null);
  const addButtonRef = useRef<View>(null);

  // 측정된 위치 저장
  const [pencilPosition, setPencilPosition] = useState({ x: 0, y: 0 });
  const [fabPosition, setFabPosition] = useState({ x: 0, y: 0 });
  const [memberSelectPosition, setMemberSelectPosition] = useState({ x: 0, y: 0 });
  const [memberItemPosition, setMemberItemPosition] = useState({ x: 0, y: 0 });
  const [addButtonPosition, setAddButtonPosition] = useState({ x: 0, y: 0 });

  const pencilHighlight = useSharedValue(0);
  const fabOpacity = useSharedValue(0);
  const fabHighlight = useSharedValue(0);
  const dialogOpacity = useSharedValue(0);
  const newCardOpacity = useSharedValue(0);
  const newCardScale = useSharedValue(0.8);

  const CYCLE_DURATION = 15000;
  const CONTENT_TEXT = "건강하게 해주세요";

  // 화살표 타이밍 상수 (FingerAnimation과 동기화)
  const ARROW_PAUSE = 400;
  const ARROW_MOVE = 800;
  const ARROW_TAP = 300;
  const ARROW_ARRIVAL = ARROW_PAUSE + ARROW_MOVE; // 1200ms

  // 요소 위치 측정 함수들
  const measurePencil = useCallback(() => {
    if (pencilRef.current && containerRef.current) {
      pencilRef.current.measureLayout(
        containerRef.current as any,
        (x, y, width, height) => {
          setPencilPosition({ x: x + width / 2, y: y + height / 2 });
        },
        () => {}
      );
    }
  }, []);

  const measureFab = useCallback(() => {
    if (fabRef.current && containerRef.current) {
      fabRef.current.measureLayout(
        containerRef.current as any,
        (x, y, width, height) => {
          setFabPosition({ x: x + width / 2, y: y + height / 2 });
        },
        () => {}
      );
    }
  }, []);

  const measureMemberSelect = useCallback(() => {
    if (memberSelectRef.current && containerRef.current) {
      memberSelectRef.current.measureLayout(
        containerRef.current as any,
        (x, y, width, height) => {
          setMemberSelectPosition({ x: x + width / 2, y: y + height / 2 });
        },
        () => {}
      );
    }
  }, []);

  const measureMemberItem = useCallback(() => {
    if (memberItemRef.current && containerRef.current) {
      memberItemRef.current.measureLayout(
        containerRef.current as any,
        (x, y, width, height) => {
          setMemberItemPosition({ x: x + width / 2, y: y + height / 2 });
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
          setAddButtonPosition({ x: x + width / 2, y: y + height / 2 });
        },
        () => {}
      );
    }
  }, []);

  // 편집 모드가 되면 FAB 위치 측정
  useEffect(() => {
    if (isEditMode) {
      const timer = setTimeout(measureFab, 100);
      return () => clearTimeout(timer);
    }
  }, [isEditMode, measureFab]);

  // 다이얼로그가 열리면 멤버 선택 버튼 및 추가 버튼 위치 측정
  useEffect(() => {
    if (showDialog) {
      const timer = setTimeout(() => {
        measureMemberSelect();
        measureAddButton();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [showDialog, measureMemberSelect, measureAddButton]);

  // 멤버 모달이 열리면 멤버 아이템 위치 측정
  useEffect(() => {
    if (showMemberModal) {
      const timer = setTimeout(measureMemberItem, 100);
      return () => clearTimeout(timer);
    }
  }, [showMemberModal, measureMemberItem]);

  useEffect(() => {
    if (!isActive) {
      // 리셋
      setStep("tap-pencil");
      setIsEditMode(false);
      setShowDialog(false);
      setShowMemberModal(false);
      setSelectedMember("");
      setTypedContent("");
      setShowNewCard(false);
      return;
    }

    let timeouts: ReturnType<typeof setTimeout>[] = [];

    const startCycle = () => {
      // 초기화
      setStep("tap-pencil");
      setIsEditMode(false);
      setShowDialog(false);
      setShowMemberModal(false);
      setSelectedMember("");
      setTypedContent("");
      setShowNewCard(false);
      setHighlightPencil(false);
      setHighlightFab(false);
      setHighlightMemberSelect(false);
      setHighlightMemberItem(false);
      setHighlightAddButton(false);
      pencilHighlight.value = 0;
      fabOpacity.value = 0;
      fabHighlight.value = 0;
      dialogOpacity.value = 0;
      newCardOpacity.value = 0;
      newCardScale.value = 0.8;

      // ===== Step 1: 펜 아이콘 탭 =====
      // 화살표 도착 후 하이라이트
      timeouts.push(
        setTimeout(() => {
          setHighlightPencil(true);
          pencilHighlight.value = withSequence(
            withTiming(1, { duration: 200 }),
            withTiming(0, { duration: 200 })
          );
        }, ARROW_ARRIVAL)
      );

      // 편집 모드 진입 (탭 후)
      const editModeStart = ARROW_ARRIVAL + ARROW_TAP + 300;
      timeouts.push(
        setTimeout(() => {
          setHighlightPencil(false);
          setIsEditMode(true);
          setStep("show-fab");
          fabOpacity.value = withTiming(1, { duration: 300 });
        }, editModeStart)
      );

      // ===== Step 2: FAB 탭 =====
      const tapFabStart = editModeStart + 500;
      timeouts.push(
        setTimeout(() => {
          setStep("tap-fab");
        }, tapFabStart)
      );

      // FAB 하이라이트 (화살표 도착 후)
      timeouts.push(
        setTimeout(() => {
          setHighlightFab(true);
          fabHighlight.value = withSequence(
            withTiming(1, { duration: 200 }),
            withTiming(0, { duration: 200 })
          );
        }, tapFabStart + ARROW_ARRIVAL)
      );

      // 다이얼로그 표시 (탭 후)
      const dialogStart = tapFabStart + ARROW_ARRIVAL + ARROW_TAP + 300;
      timeouts.push(
        setTimeout(() => {
          setHighlightFab(false);
          setShowDialog(true);
          setStep("show-dialog");
          dialogOpacity.value = withTiming(1, { duration: 300 });
        }, dialogStart)
      );

      // ===== Step 3: 기도 대상 선택 =====
      const tapMemberSelectStart = dialogStart + 500;
      timeouts.push(
        setTimeout(() => {
          setStep("tap-member-select");
        }, tapMemberSelectStart)
      );

      // 멤버 선택 버튼 하이라이트
      timeouts.push(
        setTimeout(() => {
          setHighlightMemberSelect(true);
        }, tapMemberSelectStart + ARROW_ARRIVAL)
      );

      // 멤버 모달 표시
      const memberModalStart = tapMemberSelectStart + ARROW_ARRIVAL + ARROW_TAP + 200;
      timeouts.push(
        setTimeout(() => {
          setHighlightMemberSelect(false);
          setStep("show-member-modal");
          setShowMemberModal(true);
        }, memberModalStart)
      );

      // ===== Step 4: 엄마 선택 =====
      const selectMemberStart = memberModalStart + 500;
      timeouts.push(
        setTimeout(() => {
          setStep("select-member");
        }, selectMemberStart)
      );

      // 멤버 아이템 하이라이트
      timeouts.push(
        setTimeout(() => {
          setHighlightMemberItem(true);
        }, selectMemberStart + ARROW_ARRIVAL)
      );

      // 멤버 선택 완료
      const memberSelectedTime = selectMemberStart + ARROW_ARRIVAL + ARROW_TAP + 200;
      timeouts.push(
        setTimeout(() => {
          setHighlightMemberItem(false);
          setSelectedMember("엄마");
          setShowMemberModal(false);
          setStep("type-content");
        }, memberSelectedTime)
      );

      // ===== Step 5: 내용 타이핑 =====
      const typeStart = memberSelectedTime + 300;
      timeouts.push(
        setTimeout(() => {
          let charIndex = 0;
          const typeInterval = setInterval(() => {
            if (charIndex < CONTENT_TEXT.length) {
              setTypedContent(CONTENT_TEXT.slice(0, charIndex + 1));
              charIndex++;
            } else {
              clearInterval(typeInterval);
            }
          }, 80);
        }, typeStart)
      );

      // ===== Step 6: 추가 버튼 탭 =====
      const tapAddStart = typeStart + CONTENT_TEXT.length * 80 + 500;
      timeouts.push(
        setTimeout(() => {
          setStep("tap-add");
        }, tapAddStart)
      );

      // 추가 버튼 하이라이트
      timeouts.push(
        setTimeout(() => {
          setHighlightAddButton(true);
        }, tapAddStart + ARROW_ARRIVAL)
      );

      // ===== Step 7: 화살표 숨기고 다이얼로그 닫기 =====
      timeouts.push(
        setTimeout(() => {
          setStep("show-card");
          setHighlightAddButton(false);
        }, tapAddStart + ARROW_ARRIVAL + ARROW_TAP + 300)
      );

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
        }, tapAddStart + ARROW_ARRIVAL + ARROW_TAP + 400)
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

  const pencilHighlightStyle = useAnimatedStyle(() => ({
    backgroundColor:
      pencilHighlight.value > 0 ? HIGHLIGHT_BG_COLOR : "transparent",
    borderRadius: BORDER_RADIUS_12,
  }));

  const fabStyle = useAnimatedStyle(() => ({
    opacity: fabOpacity.value,
    transform: [{ scale: 1 + fabHighlight.value * 0.15 }],
  }));

  const dialogStyle = useAnimatedStyle(() => ({
    opacity: dialogOpacity.value,
  }));

  const newCardStyle = useAnimatedStyle(() => ({
    opacity: newCardOpacity.value,
    transform: [{ scale: newCardScale.value }],
  }));

  // 현재 타겟 위치 계산 (실제 탭 단계에서만 유효한 위치 반환)
  const getTargetPosition = () => {
    switch (step) {
      case "tap-pencil":
        return pencilPosition;
      case "tap-fab":
        return fabPosition;
      case "tap-member-select":
        return memberSelectPosition;
      case "select-member":
        return memberItemPosition;
      case "tap-add":
        return addButtonPosition;
      default:
        return { x: 0, y: 0 };
    }
  };

  // 손가락 애니메이션을 보여줄 단계인지 확인 (실제 탭 단계에서만 표시)
  const shouldShowFinger = () => {
    const fingerSteps = [
      "tap-pencil",
      "tap-fab",
      "tap-member-select",
      "select-member",
      "tap-add",
    ];
    return fingerSteps.includes(step);
  };

  const targetPosition = getTargetPosition();
  const resetKey =
    step === "tap-pencil" ? 1 :
    step === "tap-fab" ? 2 :
    step === "tap-member-select" ? 3 :
    step === "select-member" ? 4 :
    step === "tap-add" ? 5 : 6;

  return (
    <View style={styles.container}>
      <View
        ref={containerRef}
        style={styles.phoneContainer}
        onLayout={measurePencil}
      >
        <MockPhone>
          {/* 헤더 */}
          <View style={styles.header}>
            <MaterialCommunityIcons
              name="arrow-left"
              size={ICON_SIZE_MEDIUM}
              color={color.primary}
            />
            <Text style={styles.headerTitle}>우리 가족 기도방</Text>
            <Animated.View
              ref={pencilRef}
              style={pencilHighlightStyle}
              onLayout={measurePencil}
            >
              <MaterialCommunityIcons
                name={isEditMode ? "check" : "pencil"}
                size={ICON_SIZE_MEDIUM}
                color={color.primary}
              />
            </Animated.View>
          </View>

          {/* 기도제목 타이틀 카드 */}
          <View style={styles.content}>
            <View style={styles.titleCard}>
              <View style={styles.titleCardAccent} />
              <Text style={styles.titleCardText}>3월 2주차</Text>
            </View>

            {/* 기존 기도문 카드 */}
            <View style={styles.prayerCard}>
              <View style={styles.prayerCardHeader}>
                <Text style={styles.prayerCardName}>아빠</Text>
              </View>
              <View style={styles.prayerCardDivider} />
              <Text style={styles.prayerCardContent}>
                하나님을 더 사랑하게 해주세요
              </Text>
            </View>

            {/* 새로 추가되는 카드 */}
            {showNewCard && (
              <Animated.View style={[styles.prayerCardNew, newCardStyle]}>
                <View style={styles.prayerCardHeader}>
                  <Text style={styles.prayerCardName}>엄마</Text>
                </View>
                <View style={styles.prayerCardDivider} />
                <Text style={styles.prayerCardContent}>{CONTENT_TEXT}</Text>
              </Animated.View>
            )}
          </View>

          {/* FAB - 편집 모드일 때만 */}
          {isEditMode && (
            <Animated.View
              ref={fabRef}
              style={[styles.fabContainer, fabStyle]}
              onLayout={measureFab}
            >
              <View style={styles.fab}>
                <MaterialCommunityIcons
                  name="plus"
                  size={ICON_SIZE_SMALL}
                  color="#fff"
                />
                <Text style={styles.fabLabel}>기도문 추가</Text>
              </View>
            </Animated.View>
          )}

          {/* 하단 버튼 */}
          <MockBottomButton icon="bell" text="기도 알림" />

          {/* 다이얼로그 */}
          {showDialog && (
            <Animated.View style={[StyleSheet.absoluteFill, dialogStyle]}>
              <MockDialog
                title="기도문 추가"
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
                    <View
                      ref={memberSelectRef}
                      style={[
                        styles.memberSelectButton,
                        highlightMemberSelect && styles.memberSelectHighlight,
                      ]}
                      onLayout={measureMemberSelect}
                    >
                      <Text
                        style={[
                          styles.memberSelectText,
                          !selectedMember && styles.memberSelectPlaceholder,
                        ]}
                      >
                        {selectedMember || "선택하세요"}
                      </Text>
                    </View>
                    <View style={styles.pencilIconButton}>
                      <MaterialCommunityIcons
                        name="pencil"
                        size={ICON_SIZE_SMALL}
                        color={color.primary}
                      />
                    </View>
                  </View>

                  <Text style={[styles.dialogLabel, { marginTop: MARGIN_TOP_8 }]}>
                    기도문
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

              {/* 멤버 선택 모달 */}
              {showMemberModal && (
                <View style={styles.memberModalOverlay}>
                  <View style={styles.memberModal}>
                    <Text style={styles.memberModalTitle}>기도 대상 선택</Text>
                    <View style={styles.memberList}>
                      {["엄마", "동생"].map((name, idx) => (
                        <View
                          key={idx}
                          ref={name === "엄마" ? memberItemRef : undefined}
                          style={[
                            styles.memberItem,
                            highlightMemberItem && name === "엄마" && styles.memberItemHighlight,
                          ]}
                          onLayout={name === "엄마" ? measureMemberItem : undefined}
                        >
                          <View style={styles.memberAvatar}>
                            <MaterialCommunityIcons
                              name="account"
                              size={ICON_SIZE_SMALL}
                              color={color.gray}
                            />
                          </View>
                          <Text style={styles.memberName}>{name}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                </View>
              )}
            </Animated.View>
          )}
        </MockPhone>

        {/* 손가락 애니메이션 - 항상 렌더링하고 visible로 제어 */}
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
        <Text style={styles.title}>기도문 작성</Text>
        <Text style={styles.description}>
          <Text style={styles.highlight}>펜 아이콘</Text>을 눌러 편집 모드로 전환 후{"\n"}
          <Text style={styles.highlight}>기도문 추가</Text> 버튼을 눌러 작성해보세요
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
  header: {
    height: RFValue(36),
    backgroundColor: color.third,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: RFValue(12),
  },
  headerTitle: {
    fontSize: RFValue(14),
    fontWeight: "bold",
    color: color.primary,
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
    textShadowColor: "rgba(0, 0, 0, 0.1)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
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
  prayerCardNew: {
    backgroundColor: "#fff",
    borderRadius: RFValue(10),
    padding: RFValue(10),
    marginBottom: RFValue(6),
    borderLeftWidth: RFValue(4),
    borderLeftColor: color.secondary,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
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
  fabContainer: {
    position: "absolute",
    bottom: RFValue(60),
    right: RFValue(10),
  },
  fab: {
    backgroundColor: color.secondary,
    borderRadius: RFValue(16),
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: RFValue(8),
    paddingHorizontal: RFValue(12),
    gap: RFValue(4),
  },
  fabLabel: {
    color: "#fff",
    fontSize: RFValue(9),
    fontWeight: "bold",
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
  pencilIconButton: {
    width: RFValue(32),
    height: RFValue(32),
    borderRadius: RFValue(4),
    backgroundColor: color.secondary,
    alignItems: "center",
    justifyContent: "center",
  },
  memberSelectHighlight: {
    borderColor: color.secondary,
    borderWidth: 2,
    backgroundColor: color.secondary + "10",
  },
  memberSelectText: {
    fontSize: RFValue(10),
    color: color.secondary,
  },
  memberSelectPlaceholder: {
    color: color.gray,
  },
  memberModalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  memberModal: {
    backgroundColor: "#fff",
    borderRadius: RFValue(8),
    padding: RFValue(12),
    width: "80%",
    maxHeight: "60%",
  },
  memberModalTitle: {
    fontSize: RFValue(11),
    fontWeight: "bold",
    color: color.secondary,
    marginBottom: RFValue(8),
    textAlign: "center",
  },
  memberList: {
    gap: RFValue(4),
  },
  memberItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: RFValue(8),
    borderRadius: RFValue(6),
    backgroundColor: "#f5f5f5",
  },
  memberItemHighlight: {
    backgroundColor: color.secondary + "30",
    borderWidth: 1,
    borderColor: color.secondary,
  },
  memberAvatar: {
    width: RFValue(24),
    height: RFValue(24),
    borderRadius: RFValue(12),
    backgroundColor: color.gray + "30",
    justifyContent: "center",
    alignItems: "center",
  },
  memberName: {
    flex: 1,
    marginLeft: RFValue(8),
    fontSize: RFValue(10),
    color: color.secondary,
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: color.gray + "60",
    borderRadius: RFValue(4),
    padding: RFValue(8),
    minHeight: RFValue(50),
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

export default CreatePrayerContentSlide;
