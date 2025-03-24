import React from "react";
import { View, StyleSheet } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { PrayerContent } from "../types/response/prayerContent";
import TitleCard from "./TitleCard";
import PrayerCardList from "./PrayerCardList";
import EmptyState from "./EmptyState";
import { useSelectedPrayerTitleStore } from "../../prayerTitles/stores/useSelectedPrayerTitleStore";

interface PrayerReadBodyProps {
  prayers: PrayerContent[];
  onEdit?: (prayerContent: PrayerContent) => void;
  onDelete?: (prayerContent: PrayerContent) => void;
}

function PrayerReadBody({
  prayers = [],
  onEdit,
  onDelete,
}: PrayerReadBodyProps) {
  // 항상 훅을 호출 (조건부 호출 금지)
  const { selectedPrayerTitle } = useSelectedPrayerTitleStore();

  // 훅 호출 이후에 조건부 렌더링
  if (prayers.length === 0) {
    return <EmptyState />;
  }

  // 타이틀이 있는지 확인
  const titleText = selectedPrayerTitle?.title ?? "기도 제목을 알 수 없습니다.";

  return (
    <View style={styles.container}>
      {/* 제목 카드 컴포넌트 */}
      <TitleCard title={titleText} />

      {/* 기도문 목록 컴포넌트 */}
      <PrayerCardList prayers={prayers} onEdit={onEdit} onDelete={onDelete} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
    padding: RFValue(16),
    backgroundColor: "#f5f5f5",
  },
});

export default PrayerReadBody;
