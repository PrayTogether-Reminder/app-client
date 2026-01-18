// 친구 초대 튜토리얼 슬라이드
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
  MockCard,
  MockBottomButton,
  MockSearchInput,
  MockMemberItem,
} from "../mock/MockComponents";
import { FingerAnimation } from "../FingerAnimation";

interface InviteFriendsSlideProps {
  isActive: boolean;
}

// RFValue는 UI 스레드에서 호출하면 안 되므로 미리 계산
const ICON_SIZE_MEDIUM = RFValue(18);
const BORDER_RADIUS_12 = RFValue(12);
const PADDING_2 = RFValue(2);
const HIGHLIGHT_BG_COLOR = color.secondary + "40";

type AnimationStep =
  | "tap-menu"
  | "show-side-menu"
  | "tap-invite"
  | "show-invite-screen"
  | "type-search"
  | "tap-member"
  | "tap-invite-button"
  | "done";

export const InviteFriendsSlide: React.FC<InviteFriendsSlideProps> = ({
  isActive,
}) => {
  const [step, setStep] = useState<AnimationStep>("tap-menu");
  const [showSideMenu, setShowSideMenu] = useState(false);
  const [showInviteScreen, setShowInviteScreen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedMember, setSelectedMember] = useState(false);

  // 하이라이트 상태들
  const [highlightMenu, setHighlightMenu] = useState(false);
  const [highlightInviteButton, setHighlightInviteButton] = useState(false);
  const [highlightMemberItem, setHighlightMemberItem] = useState(false);
  const [highlightBottomButton, setHighlightBottomButton] = useState(false);

  // 요소 위치 측정을 위한 refs
  const containerRef = useRef<View>(null);
  const menuRef = useRef<View>(null);
  const inviteButtonRef = useRef<View>(null);
  const memberItemRef = useRef<View>(null);
  const bottomButtonRef = useRef<View>(null);

  // 측정된 위치 저장
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [inviteButtonPosition, setInviteButtonPosition] = useState({ x: 0, y: 0 });
  const [memberItemPosition, setMemberItemPosition] = useState({ x: 0, y: 0 });
  const [bottomButtonPosition, setBottomButtonPosition] = useState({ x: 0, y: 0 });

  const menuHighlight = useSharedValue(0);
  const sideMenuOpacity = useSharedValue(0);

  const CYCLE_DURATION = 12000;
  const SEARCH_TEXT = "김철수";

  // 화살표 타이밍 상수 (FingerAnimation과 동기화)
  const ARROW_PAUSE = 400;
  const ARROW_MOVE = 800;
  const ARROW_TAP = 300;
  const ARROW_ARRIVAL = ARROW_PAUSE + ARROW_MOVE; // 1200ms

  // 요소 위치 측정 함수들
  const measureMenu = useCallback(() => {
    if (menuRef.current && containerRef.current) {
      menuRef.current.measureLayout(
        containerRef.current as any,
        (x, y, width, height) => {
          setMenuPosition({ x: x + width / 2, y: y + height / 2 });
        },
        () => {}
      );
    }
  }, []);

  const measureInviteButton = useCallback(() => {
    if (inviteButtonRef.current && containerRef.current) {
      inviteButtonRef.current.measureLayout(
        containerRef.current as any,
        (x, y, width, height) => {
          setInviteButtonPosition({ x: x + width / 2, y: y + height / 2 });
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

  const measureBottomButton = useCallback(() => {
    if (bottomButtonRef.current && containerRef.current) {
      bottomButtonRef.current.measureLayout(
        containerRef.current as any,
        (x, y, width, height) => {
          setBottomButtonPosition({ x: x + width / 2, y: y + height / 2 });
        },
        () => {}
      );
    }
  }, []);

  // 사이드 메뉴가 열리면 초대 버튼 위치 측정
  useEffect(() => {
    if (showSideMenu) {
      const timer = setTimeout(measureInviteButton, 100);
      return () => clearTimeout(timer);
    }
  }, [showSideMenu, measureInviteButton]);

  // 초대 화면이 열리면 멤버 아이템 및 하단 버튼 위치 측정
  useEffect(() => {
    if (showInviteScreen && searchText.length > 0) {
      const timer = setTimeout(() => {
        measureMemberItem();
        measureBottomButton();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [showInviteScreen, searchText, measureMemberItem, measureBottomButton]);

  useEffect(() => {
    if (!isActive) {
      setStep("tap-menu");
      setShowSideMenu(false);
      setShowInviteScreen(false);
      setSearchText("");
      setSelectedMember(false);
      setHighlightMenu(false);
      setHighlightInviteButton(false);
      setHighlightMemberItem(false);
      setHighlightBottomButton(false);
      return;
    }

    let timeouts: ReturnType<typeof setTimeout>[] = [];

    const startCycle = () => {
      // 초기화
      setStep("tap-menu");
      setShowSideMenu(false);
      setShowInviteScreen(false);
      setSearchText("");
      setSelectedMember(false);
      setHighlightMenu(false);
      setHighlightInviteButton(false);
      setHighlightMemberItem(false);
      setHighlightBottomButton(false);
      menuHighlight.value = 0;
      sideMenuOpacity.value = 0;

      // ===== Step 1: 메뉴 아이콘 탭 =====
      // 화살표 도착 후 하이라이트
      timeouts.push(
        setTimeout(() => {
          setHighlightMenu(true);
          menuHighlight.value = withSequence(
            withTiming(1, { duration: 200 }),
            withTiming(0, { duration: 200 })
          );
        }, ARROW_ARRIVAL)
      );

      // 사이드 메뉴 표시
      const sideMenuStart = ARROW_ARRIVAL + ARROW_TAP + 300;
      timeouts.push(
        setTimeout(() => {
          setHighlightMenu(false);
          setStep("show-side-menu");
          setShowSideMenu(true);
          sideMenuOpacity.value = withTiming(1, { duration: 300 });
        }, sideMenuStart)
      );

      // ===== Step 2: 방 초대 버튼 탭 =====
      const tapInviteStart = sideMenuStart + 500;
      timeouts.push(
        setTimeout(() => {
          setStep("tap-invite");
        }, tapInviteStart)
      );

      // 초대 버튼 하이라이트
      timeouts.push(
        setTimeout(() => {
          setHighlightInviteButton(true);
        }, tapInviteStart + ARROW_ARRIVAL)
      );

      // 초대 화면 표시
      const inviteScreenStart = tapInviteStart + ARROW_ARRIVAL + ARROW_TAP + 300;
      timeouts.push(
        setTimeout(() => {
          setHighlightInviteButton(false);
          setStep("show-invite-screen");
          setShowSideMenu(false);
          setShowInviteScreen(true);
        }, inviteScreenStart)
      );

      // ===== Step 3: 검색 타이핑 (화살표 없음) =====
      const typeStart = inviteScreenStart + 500;
      timeouts.push(
        setTimeout(() => {
          setStep("type-search");
          let charIndex = 0;
          const typeInterval = setInterval(() => {
            if (charIndex < SEARCH_TEXT.length) {
              setSearchText(SEARCH_TEXT.slice(0, charIndex + 1));
              charIndex++;
            } else {
              clearInterval(typeInterval);
            }
          }, 100);
        }, typeStart)
      );

      // ===== Step 4: 멤버 선택 =====
      const tapMemberStart = typeStart + SEARCH_TEXT.length * 100 + 500;
      timeouts.push(
        setTimeout(() => {
          setStep("tap-member");
        }, tapMemberStart)
      );

      // 멤버 아이템 하이라이트
      timeouts.push(
        setTimeout(() => {
          setHighlightMemberItem(true);
        }, tapMemberStart + ARROW_ARRIVAL)
      );

      // 멤버 선택 완료
      const memberSelectedTime = tapMemberStart + ARROW_ARRIVAL + ARROW_TAP + 200;
      timeouts.push(
        setTimeout(() => {
          setHighlightMemberItem(false);
          setSelectedMember(true);
        }, memberSelectedTime)
      );

      // ===== Step 5: 초대 버튼 탭 =====
      const tapBottomStart = memberSelectedTime + 500;
      timeouts.push(
        setTimeout(() => {
          setStep("tap-invite-button");
        }, tapBottomStart)
      );

      // 하단 버튼 하이라이트
      timeouts.push(
        setTimeout(() => {
          setHighlightBottomButton(true);
        }, tapBottomStart + ARROW_ARRIVAL)
      );

      // ===== Step 6: 완료 =====
      timeouts.push(
        setTimeout(() => {
          setStep("done");
          setHighlightBottomButton(false);
        }, tapBottomStart + ARROW_ARRIVAL + ARROW_TAP + 300)
      );

      timeouts.push(
        setTimeout(() => {
          setShowInviteScreen(false);
        }, tapBottomStart + ARROW_ARRIVAL + ARROW_TAP + 400)
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

  const menuHighlightStyle = useAnimatedStyle(() => ({
    backgroundColor:
      menuHighlight.value > 0 ? HIGHLIGHT_BG_COLOR : "transparent",
    borderRadius: BORDER_RADIUS_12,
    padding: PADDING_2,
  }));

  const sideMenuStyle = useAnimatedStyle(() => ({
    opacity: sideMenuOpacity.value,
  }));

  // 현재 타겟 위치 계산 (실제 탭 단계에서만 유효한 위치 반환)
  const getTargetPosition = () => {
    switch (step) {
      case "tap-menu":
        return menuPosition;
      case "tap-invite":
        return inviteButtonPosition;
      case "tap-member":
        return memberItemPosition;
      case "tap-invite-button":
        return bottomButtonPosition;
      default:
        return { x: 0, y: 0 };
    }
  };

  // 손가락 애니메이션을 보여줄 단계인지 확인 (실제 탭 단계에서만 표시)
  const shouldShowFinger = () => {
    const fingerSteps = ["tap-menu", "tap-invite", "tap-member", "tap-invite-button"];
    return fingerSteps.includes(step);
  };

  const targetPosition = getTargetPosition();
  const resetKey =
    step === "tap-menu" ? 1 :
    step === "tap-invite" ? 2 :
    step === "tap-member" ? 3 :
    step === "tap-invite-button" ? 4 : 5;

  // 기도방 화면 렌더링
  const renderRoomScreen = () => (
    <>
      {/* 헤더 */}
      <View style={styles.header}>
        <MaterialCommunityIcons
          name="arrow-left"
          size={ICON_SIZE_MEDIUM}
          color={color.primary}
        />
        <Text style={styles.headerTitle}>우리 가족 기도방</Text>
        <Animated.View
          ref={menuRef}
          style={[
            menuHighlightStyle,
            highlightMenu && styles.menuHighlightActive,
          ]}
          onLayout={measureMenu}
        >
          <MaterialCommunityIcons
            name="menu"
            size={ICON_SIZE_MEDIUM}
            color={color.primary}
          />
        </Animated.View>
      </View>

      {/* 기도제목 목록 */}
      <View style={styles.content}>
        <MockCard title="3월 1주차" subtitle="5명의 기도" />
        <MockCard title="3월 2주차" subtitle="2명의 기도" />
      </View>

      {/* 하단 버튼 */}
      <MockBottomButton icon="pencil" text="기도제목 작성하기" />

      {/* 사이드 메뉴 */}
      {showSideMenu && (
        <Animated.View style={[styles.sideMenuContainer, sideMenuStyle]}>
          <View style={styles.sideMenu}>
            <Text style={styles.sideMenuHeader}>현재 인원: 4명</Text>
            {["나", "아빠", "엄마", "동생"].map((name, idx) => (
              <Text key={idx} style={styles.sideMenuMember}>
                {name}
              </Text>
            ))}
            <View
              ref={inviteButtonRef}
              style={[
                styles.inviteButtonContainer,
                highlightInviteButton && styles.inviteButtonHighlight,
              ]}
              onLayout={measureInviteButton}
            >
              <View style={styles.inviteButton}>
                <Text style={styles.inviteButtonText}>방 초대</Text>
              </View>
            </View>
          </View>
        </Animated.View>
      )}
    </>
  );

  // 초대 화면 렌더링
  const renderInviteScreen = () => (
    <>
      {/* 헤더 */}
      <MockHeader title="기도방 초대" showBack />

      {/* 검색 */}
      <MockSearchInput
        placeholder="이름으로 검색"
        value={searchText}
        highlight={step === "type-search"}
      />

      {/* 검색 결과 */}
      <View style={styles.content}>
        {searchText.length > 0 && (
          <>
            <View
              ref={memberItemRef}
              style={highlightMemberItem && styles.memberItemHighlight}
              onLayout={measureMemberItem}
            >
              <MockMemberItem
                name="김철수"
                selected={selectedMember}
                highlight={highlightMemberItem}
              />
            </View>
            <MockMemberItem name="김철호" />
          </>
        )}
      </View>

      {/* 하단 버튼 */}
      <View
        ref={bottomButtonRef}
        style={highlightBottomButton && styles.bottomButtonHighlight}
        onLayout={measureBottomButton}
      >
        <MockBottomButton
          icon="account-multiple-plus"
          text={selectedMember ? "기도방 초대 (1명)" : "기도방 초대 (0명)"}
          highlight={highlightBottomButton}
        />
      </View>
    </>
  );

  return (
    <View style={styles.container}>
      <View
        ref={containerRef}
        style={styles.phoneContainer}
        onLayout={measureMenu}
      >
        <MockPhone>
          {showInviteScreen ? renderInviteScreen() : renderRoomScreen()}
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
        <Text style={styles.title}>방 초대</Text>
        <Text style={styles.description}>
          <Text style={styles.highlight}>메뉴 아이콘</Text>을 눌러 멤버 목록을 열고{"\n"}
          <Text style={styles.highlight}>방 초대</Text> 버튼으로 친구를 초대해보세요
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
  menuHighlightActive: {
    backgroundColor: color.secondary + "40",
  },
  content: {
    flex: 1,
    paddingTop: RFValue(10),
  },
  sideMenuContainer: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    width: "50%",
  },
  sideMenu: {
    flex: 1,
    backgroundColor: color.primary,
    padding: RFValue(12),
  },
  sideMenuHeader: {
    fontSize: RFValue(11),
    fontWeight: "bold",
    color: color.black,
    paddingBottom: RFValue(8),
    borderBottomWidth: 1,
    borderBottomColor: "#fff",
    marginBottom: RFValue(8),
  },
  sideMenuMember: {
    fontSize: RFValue(10),
    color: color.black,
    paddingVertical: RFValue(6),
    borderBottomWidth: 0.5,
    borderBottomColor: "#fff",
  },
  inviteButtonContainer: {
    position: "absolute",
    bottom: RFValue(12),
    left: RFValue(12),
    right: RFValue(12),
  },
  inviteButtonHighlight: {
    transform: [{ scale: 1.05 }],
  },
  inviteButton: {
    backgroundColor: color.third,
    borderRadius: RFValue(6),
    paddingVertical: RFValue(10),
    alignItems: "center",
  },
  inviteButtonText: {
    fontSize: RFValue(11),
    fontWeight: "bold",
    color: color.primary,
  },
  memberItemHighlight: {
    transform: [{ scale: 1.02 }],
  },
  bottomButtonHighlight: {
    transform: [{ scale: 1.02 }],
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

export default InviteFriendsSlide;
