// 5. PrayerCarousel.tsx
import React, { useState, useRef, useEffect } from "react";
import { View, StyleSheet, Dimensions, FlatList, Text } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { color } from "../../../common/styles/color";
import { PrayerCreationItem } from "../types/PrayerCreationItem";
import PrayerCard from "./PrayerContentCard";

const { width } = Dimensions.get("window");

interface PrayerCarouselProps {
  prayerList: PrayerCreationItem[];
  onDeletePrayer: (prayer: PrayerCreationItem) => void;
  onEditPrayer: (prayer: PrayerCreationItem) => void;
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
}

export default function PrayerCarousel({
  prayerList,
  onDeletePrayer,
  onEditPrayer,
  currentIndex,
  setCurrentIndex,
}: PrayerCarouselProps) {
  const prayerListRef = useRef<FlatList>(null);

  // 스크롤 이벤트 핸들러
  const handleScroll = (event: any) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffset / width);
    if (index !== currentIndex) {
      setCurrentIndex(index);
    }
  };

  useEffect(() => {
    if (prayerListRef.current && prayerList.length > 0) {
      try {
        prayerListRef.current.scrollToIndex({
          index: currentIndex < prayerList.length ? currentIndex : 0,
          animated: false,
        });
      } catch (error) {
        console.log("스크롤 이동 실패:", error);
      }
    }
  }, [prayerList]);

  if (prayerList.length === 0) {
    return (
      <View style={styles.emptyListContainer}>
        <Text style={styles.emptyListText}>아직 작성된 기도문이 없습니다.</Text>
        <Text style={styles.emptyListSubText}>
          위 양식을 작성하고 추가해보세요.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.carouselContainer}>
      <FlatList
        initialScrollIndex={currentIndex}
        ref={prayerListRef}
        data={prayerList}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled={true}
        disableIntervalMomentum={true}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        snapToInterval={width}
        contentContainerStyle={styles.scrollViewContent}
        keyExtractor={(item, index) => `${item.memberName}-${index}`}
        renderItem={({ item }) => (
          <View style={styles.cardContainer}>
            <PrayerCard
              memberName={item.memberName}
              content={item.content}
              onDelete={() => onDeletePrayer(item)}
              onEdit={() => onEditPrayer(item)}
            />
          </View>
        )}
        getItemLayout={(data, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
      />

      {/* 페이지 카운터 (1/2 형식) */}
      {prayerList.length > 0 && (
        <View style={styles.counterContainer}>
          <Text style={styles.counterText}>
            {currentIndex + 1}/{prayerList.length}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  emptyListContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: RFValue(40),
    backgroundColor: `${color.secondary}10`,
    borderRadius: RFValue(8),
  },
  emptyListText: {
    fontSize: RFValue(16),
    color: color.secondary,
    marginBottom: RFValue(8),
  },
  emptyListSubText: {
    fontSize: RFValue(14),
    color: color.secondary,
    opacity: 0.7,
  },
  carouselContainer: {
    width: "100%",
  },
  scrollViewContent: {
    alignItems: "center",
    marginLeft: -RFValue(20),
  },
  cardContainer: {
    width: width,
    alignItems: "center",
  },
  counterContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: RFValue(4),
  },
  counterText: {
    fontSize: RFValue(14),
    fontWeight: "bold",
    color: color.secondary,
  },
});
