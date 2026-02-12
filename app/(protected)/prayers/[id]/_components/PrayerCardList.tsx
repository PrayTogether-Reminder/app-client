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
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PrayerContent } from "../../../../../src/domain/prayers/types/prayerContent";
import PrayerCard from "./PrayerCard";
import type { Room } from "@/domain/rooms/types/room";

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
  const insets = useSafeAreaInsets();

  // 전체 화면 높이
  const SCREEN_HEIGHT = height;

  // 레이아웃 구성 요소 높이
  const TOP_SECTION_HEIGHT = RFValue(40);        // PrayerReadTop 헤더
  const BOTTOM_SECTION_HEIGHT = RFValue(50);     // BottomActionButton
  const BODY_PADDING = RFValue(16);              // PrayerReadBody 상하 패딩
  const TITLE_CARD_HEIGHT = RFValue(50);         // TitleCard 높이
  const MIN_TOP_GAP = RFValue(8);                // TitleCard와 카드 사이 최소 간격
  const MIN_BOTTOM_PADDING = RFValue(20);        // 최소 하단 여백

  // 실제 사용 가능한 body 영역 높이 계산
  const AVAILABLE_BODY_HEIGHT =
    SCREEN_HEIGHT
    - insets.top
    - insets.bottom
    - TOP_SECTION_HEIGHT
    - BOTTOM_SECTION_HEIGHT;

  // PrayerReadBody 내부에서 카드 리스트가 실제로 사용 가능한 높이
  const CARDLIST_AVAILABLE_HEIGHT =
    AVAILABLE_BODY_HEIGHT
    - (BODY_PADDING * 2)  // 상하 패딩
    - TITLE_CARD_HEIGHT;  // TitleCard 높이

  // 카드 높이: 사용 가능한 공간의 80% (기존 65%에서 증가)
  const ITEM_HEIGHT = Math.floor(CARDLIST_AVAILABLE_HEIGHT * 0.80);

  // TitleCard 바로 아래 최소 간격으로 배치
  const topPadding = MIN_TOP_GAP;

  // 하단 패딩: 남은 공간 활용하되 최소값 보장
  const bottomPadding = Math.max(
    CARDLIST_AVAILABLE_HEIGHT - ITEM_HEIGHT - topPadding,
    MIN_BOTTOM_PADDING
  );

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
      keyExtractor={(item, index) => {
        const prayerItem = item as PrayerContent;
        return String(prayerItem.id || `item-${index}`);
      }}
      renderItem={renderItem}
      showsVerticalScrollIndicator={true}
      decelerationRate={Platform.OS === "ios" ? 0.98 : 0.96}
      snapToAlignment="center"
      snapToInterval={ITEM_HEIGHT}
      disableIntervalMomentum={true}
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
