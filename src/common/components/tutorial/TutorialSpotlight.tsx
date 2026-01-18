// 튜토리얼 스포트라이트 컴포넌트 - 첫 방문자에게 튜토리얼 버튼 강조
import React, { useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Text,
  Dimensions,
  Platform,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
} from "react-native-reanimated";
import { RFValue } from "react-native-responsive-fontsize";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { color } from "../../styles/color";
import { useTutorialStore } from "./useTutorialStore";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export const TutorialSpotlight: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { showSpotlight, openTutorial, hideSpotlight } = useTutorialStore();

  const overlayOpacity = useSharedValue(0);
  const pulseScale = useSharedValue(1);
  const tooltipOpacity = useSharedValue(0);

  useEffect(() => {
    if (showSpotlight) {
      // 오버레이 페이드인
      overlayOpacity.value = withTiming(1, { duration: 300 });
      // 툴팁 페이드인
      tooltipOpacity.value = withTiming(1, { duration: 400, easing: Easing.out(Easing.ease) });
      // 펄스 애니메이션
      pulseScale.value = withRepeat(
        withSequence(
          withTiming(1.2, { duration: 800, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 800, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        false
      );
    }
  }, [showSpotlight]);

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
  }));

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  const tooltipStyle = useAnimatedStyle(() => ({
    opacity: tooltipOpacity.value,
  }));

  const handlePress = () => {
    openTutorial();
  };

  const handleDismiss = () => {
    hideSpotlight();
  };

  if (!showSpotlight) return null;

  // 헤더 높이 계산 (Top1Body10 레이아웃 기준: RFValue(70))
  // TopHeader의 headerAction marginTop: iOS -RFValue(40), Android 0
  const headerHeight = RFValue(70);
  const buttonMarginTop = Platform.OS === "ios" ? -RFValue(40) : 0;
  const spotlightTop = insets.top + headerHeight / 2 + buttonMarginTop / 2 - RFValue(22);
  const spotlightRight = RFValue(8);

  return (
    <TouchableWithoutFeedback onPress={handleDismiss}>
      <Animated.View style={[styles.container, overlayStyle]}>
        {/* 어두운 배경 */}
        <View style={styles.overlay} />

        {/* 스포트라이트 영역 */}
        <View
          style={[
            styles.spotlightArea,
            {
              top: spotlightTop,
              right: spotlightRight,
            },
          ]}
        >
          {/* 펄스 효과 */}
          <Animated.View style={[styles.pulseRing, pulseStyle]} />

          {/* 스포트라이트 버튼 */}
          <TouchableWithoutFeedback onPress={handlePress}>
            <View style={styles.spotlightButton}>
              <MaterialCommunityIcons
                name="help-circle-outline"
                size={RFValue(24)}
                color={color.primary}
              />
            </View>
          </TouchableWithoutFeedback>
        </View>

        {/* 툴팁 */}
        <Animated.View
          style={[
            styles.tooltip,
            tooltipStyle,
            {
              top: spotlightTop + RFValue(50),
              right: RFValue(16),
            },
          ]}
        >
          <View style={styles.tooltipArrow} />
          <View style={styles.tooltipContent}>
            <Text style={styles.tooltipTitle}>앱 사용법이 궁금하신가요?</Text>
            <Text style={styles.tooltipText}>
              여기를 눌러 튜토리얼을 확인해보세요!
            </Text>
          </View>
        </Animated.View>

        {/* 하단 안내 */}
        <View style={styles.bottomHint}>
          <Text style={styles.bottomHintText}>화면을 터치하면 닫힙니다</Text>
        </View>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9999,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.75)",
  },
  spotlightArea: {
    position: "absolute",
    width: RFValue(44),
    height: RFValue(44),
    alignItems: "center",
    justifyContent: "center",
  },
  pulseRing: {
    position: "absolute",
    width: RFValue(56),
    height: RFValue(56),
    borderRadius: RFValue(28),
    backgroundColor: color.secondary + "40",
  },
  spotlightButton: {
    width: RFValue(44),
    height: RFValue(44),
    borderRadius: RFValue(22),
    backgroundColor: color.third,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#fff",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
  },
  tooltip: {
    position: "absolute",
    maxWidth: SCREEN_WIDTH - RFValue(32),
  },
  tooltipArrow: {
    position: "absolute",
    top: -RFValue(8),
    right: RFValue(12),
    width: 0,
    height: 0,
    borderLeftWidth: RFValue(8),
    borderRightWidth: RFValue(8),
    borderBottomWidth: RFValue(8),
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "#fff",
  },
  tooltipContent: {
    backgroundColor: "#fff",
    borderRadius: RFValue(12),
    padding: RFValue(16),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  tooltipTitle: {
    fontSize: RFValue(14),
    fontWeight: "bold",
    color: color.secondary,
    marginBottom: RFValue(6),
  },
  tooltipText: {
    fontSize: RFValue(12),
    color: color.gray,
    lineHeight: RFValue(18),
  },
  bottomHint: {
    position: "absolute",
    bottom: RFValue(40),
    left: 0,
    right: 0,
    alignItems: "center",
  },
  bottomHintText: {
    fontSize: RFValue(12),
    color: "rgba(255, 255, 255, 0.6)",
  },
});

export default TutorialSpotlight;
