// PrayerList.tsx
import React, { useRef, useEffect, useMemo } from "react";
import {
  FlatList,
  Dimensions,
  StyleSheet,
  Platform,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
} from "react-native-reanimated";
import { RFValue } from "react-native-responsive-fontsize";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PrayerContent } from "../../../../../src/domain/prayers/types/prayerContent";
import PrayerCard from "./PrayerCard";
import type { Room } from "@/domain/rooms/types/room";

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
  const scrollY = useSharedValue(0);
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

  // 카드 높이: Platform별로 다르게 설정 (Android는 스냅 동작 차이로 인해 살짝 작게)
  const CARD_HEIGHT_RATIO = Platform.OS === "ios" ? 0.88 : 0.84;
  const ITEM_HEIGHT = Math.floor(CARDLIST_AVAILABLE_HEIGHT * CARD_HEIGHT_RATIO);

  // TitleCard 바로 아래 최소 간격으로 배치
  const topPadding = MIN_TOP_GAP;

  // 하단 패딩: 남은 공간 활용하되 최소값 보장
  const bottomPadding = Math.max(
    CARDLIST_AVAILABLE_HEIGHT - ITEM_HEIGHT - topPadding,
    MIN_BOTTOM_PADDING
  );

  // 스크롤 이벤트 핸들러 (UI 스레드에서 실행)
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  // 각 카드가 중앙에 오도록 정확한 스냅 오프셋 계산
  const snapToOffsets = useMemo(() => {
    return prayerContents.map((_, index) => {
      // FlatList의 중앙에 카드 중심이 오도록 offset 계산
      const cardCenter = topPadding + (ITEM_HEIGHT * index) + (ITEM_HEIGHT / 2);
      const listCenter = CARDLIST_AVAILABLE_HEIGHT / 2;
      return cardCenter - listCenter;
    });
  }, [prayerContents.length, ITEM_HEIGHT, topPadding, CARDLIST_AVAILABLE_HEIGHT]);

  // 초기 렌더링 후 첫 카드를 중앙에 정렬
  useEffect(() => {
    if (flatListRef.current && prayerContents.length > 0 && snapToOffsets.length > 0) {
      // snapToOffsets 계산에 따라 첫 번째 offset으로 스크롤
      const timer = setTimeout(() => {
        try {
          const firstOffset = snapToOffsets[0];
          flatListRef.current?.scrollToOffset({
            offset: Math.max(0, firstOffset),  // 음수 방지
            animated: false,
          });
        } catch (error) {
          console.log('초기 스크롤 위치 설정 실패:', error);
        }
      }, 150);  // 150ms 지연

      return () => clearTimeout(timer);
    }
  }, [prayerContents.length, snapToOffsets]);  // 데이터 길이 및 offset 변경 시 재실행

  // 모든 카드에 대한 단일 렌더링 함수
  const renderItem: any = ({
    item,
    index,
  }: {
    item: PrayerContent;
    index: number;
  }) => {
    return (
      <PrayerCard
        item={item}
        scrollY={scrollY}
        index={index}
        itemHeight={ITEM_HEIGHT}
        onEdit={onEdit}
        onDelete={onDelete}
        cardHeight={ITEM_HEIGHT}
      />
    );
  };

  // 항목 레이아웃 계산 (모든 항목이 동일한 높이)
  const getItemLayout = (_data: any, index: number) => ({
    length: ITEM_HEIGHT,
    offset: topPadding + (ITEM_HEIGHT * index),
    index,
  });

  return (
    <Animated.FlatList
      ref={flatListRef}
      data={prayerContents}
      keyExtractor={(item, index) => {
        const prayerItem = item as PrayerContent;
        return String(prayerItem.id || `item-${index}`);
      }}
      renderItem={renderItem}
      showsVerticalScrollIndicator={true}
      decelerationRate={Platform.OS === "ios" ? 0.98 : 0.96}
      snapToOffsets={snapToOffsets}
      disableIntervalMomentum={true}
      onScroll={scrollHandler}
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
