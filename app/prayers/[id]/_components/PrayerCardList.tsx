// PrayerList.tsx
import React, { useRef } from "react";
import {
  FlatList,
  Animated,
  Dimensions,
  StyleSheet,
  Platform,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { PrayerContent } from "../../../../src/domain/prayers/types/prayerContent";
import PrayerCard from "./PrayerCard";

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);
const { height } = Dimensions.get("window");

interface PrayerCardListProps {
  prayerContents: PrayerContent[];
  onEdit?: (prayer: PrayerContent) => void;
  onDelete?: (prayer: PrayerContent) => void;
}

export default function PrayerCardList({
  prayerContents,
  onEdit,
  onDelete,
}: PrayerCardListProps) {
  const flatListRef = useRef<FlatList>(null);
  const scrollY = useRef(new Animated.Value(0)).current;

  // 화면 높이에 기반한 일관된 높이 계산
  const SCREEN_HEIGHT = height;
  const ITEM_HEIGHT = Math.floor(SCREEN_HEIGHT * 0.7);

  // 상단/하단 패딩 계산
  const topPadding = RFValue(20);
  const bottomPadding = (SCREEN_HEIGHT - ITEM_HEIGHT) / 2 + RFValue(30);

  // 애니메이션 범위 계산
  const getInputRange = (index: number) => [
    (index - 1) * ITEM_HEIGHT,
    index * ITEM_HEIGHT,
    (index + 1) * ITEM_HEIGHT,
  ];

  // 스크롤 이벤트 핸들러
  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: true }
  );

  // 모든 카드에 대한 단일 렌더링 함수
  const renderItem: any = ({
    item,
    index,
  }: {
    item: PrayerContent;
    index: number;
  }) => {
    // 애니메이션 범위 계산
    const inputRange = getInputRange(index);

    // 모든 카드에 스케일 애니메이션 적용
    const scale = scrollY.interpolate<number>({
      inputRange,
      outputRange: [0.85, 1, 0.85],
      extrapolate: "clamp",
    });

    return (
      <PrayerCard
        item={item}
        scale={scale}
        onEdit={onEdit}
        onDelete={onDelete}
        cardHeight={ITEM_HEIGHT}
      />
    );
  };

  // 항목 레이아웃 계산 (모든 항목이 동일한 높이)
  const getItemLayout = (_data: any, index: number) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  });

  return (
    <AnimatedFlatList
      ref={flatListRef}
      data={prayerContents}
      renderItem={renderItem}
      showsVerticalScrollIndicator={true}
      decelerationRate={Platform.OS === "ios" ? "normal" : 0.92}
      snapToAlignment="center"
      snapToInterval={ITEM_HEIGHT}
      onScroll={handleScroll}
      scrollEventThrottle={16}
      getItemLayout={getItemLayout}
      initialScrollIndex={0}
      contentContainerStyle={{
        paddingTop: topPadding,
        paddingBottom: bottomPadding,
      }}
    />
  );
}
