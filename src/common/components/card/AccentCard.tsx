import React, { useRef } from "react";
import { View, Pressable, StyleSheet, Animated, ViewStyle } from "react-native";
import { Card } from "react-native-paper";
import { RFValue } from "react-native-responsive-fontsize";
import { backgroundColor, color } from "@/common/styles/color";

interface AccentCardProps {
  children: React.ReactNode;
  onPress?: () => void;
  onLongPress?: () => void;
  borderWidth?: number;
  borderColor?: string;
  animated?: boolean;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
  contentPadding?: number;
}

/**
 * 왼쪽 보더 액센트가 있는 공통 카드 컴포넌트
 *
 * @param children - 카드 내부에 표시할 컨텐츠
 * @param onPress - 카드 클릭 이벤트 핸들러
 * @param onLongPress - 카드 길게 누르기 이벤트 핸들러
 * @param borderWidth - 왼쪽 보더 두께 (기본값: 6)
 * @param borderColor - 왼쪽 보더 색상 (기본값: color.secondary)
 * @param animated - Press 애니메이션 활성화 여부 (기본값: true)
 * @param style - 카드에 적용할 추가 스타일
 * @param contentStyle - Card.Content에 적용할 추가 스타일
 * @param contentPadding - Card.Content의 padding (기본값: 16)
 */
export default function AccentCard({
  children,
  onPress,
  onLongPress,
  borderWidth = 6,
  borderColor = color.secondary,
  animated = true,
  style,
  contentStyle,
  contentPadding = 16,
}: AccentCardProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Press 애니메이션 핸들러
  const handlePressIn = () => {
    if (!animated) return;
    Animated.spring(scaleAnim, {
      toValue: 0.92,
      useNativeDriver: true,
      speed: 50,
      bounciness: 15,
    }).start();
  };

  const handlePressOut = () => {
    if (!animated) return;
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 15,
    }).start();
  };

  // 카드 스타일
  const cardStyle = [
    styles.card,
    {
      borderLeftWidth: RFValue(borderWidth),
      borderLeftColor: borderColor,
    },
    style,
  ];

  // 컨텐츠 스타일
  const contentStyleMerged = [
    { padding: RFValue(contentPadding) },
    contentStyle,
  ];

  // 카드 컴포넌트
  const cardComponent = (
    <Card style={cardStyle}>
      <Card.Content style={contentStyleMerged}>
        {children}
      </Card.Content>
    </Card>
  );

  // Press 이벤트가 있는 경우 Pressable로 감싸기
  if (onPress || onLongPress) {
    return (
      <Pressable
        onPress={onPress}
        onLongPress={onLongPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        android_ripple={null}
      >
        {animated ? (
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            {cardComponent}
          </Animated.View>
        ) : (
          cardComponent
        )}
      </Pressable>
    );
  }

  // Press 이벤트가 없는 경우 그냥 카드만 반환
  return cardComponent;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: backgroundColor.white,
    borderRadius: RFValue(12),
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
});
