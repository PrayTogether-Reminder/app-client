import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { PrayerContent } from "../types/response/prayerContent";
import TitleCard from "./TitleCard";
import PrayerCardList from "./PrayerCardList";
import EmptyState from "./EmptyState";
import { useSelectedPrayerTitleStore } from "../../prayers/stores/useSelectedPrayerTitleStore";
import { useSelectedRoomStore } from "../../rooms/stores/useSelectedRoomStore";
import { usePrayerContentsQuery } from "../hooks/queries/usePrayerReadQuery";

interface PrayerReadBodyProps {
  onEdit?: (prayerContent: PrayerContent) => void;
  onDelete?: (prayerContent: PrayerContent) => void;
}

function PrayerReadBody({ onEdit, onDelete }: PrayerReadBodyProps) {
  const { selectedPrayerTitle } = useSelectedPrayerTitleStore();
  const titleText = selectedPrayerTitle?.title ?? "기도 제목을 알 수 없습니다.";
  const { selectedRoom } = useSelectedRoomStore();
  const { data: prayerContents, isLoading } = usePrayerContentsQuery(
    selectedRoom?.id ?? null,
    selectedPrayerTitle?.id ?? null
  );

  // 데이터 로딩이 완료된 후에 비어있는지 확인
  if (!prayerContents || prayerContents.length === 0) {
    return <EmptyState />; // 에러 또는 데이터가 없는 경우
  }

  return (
    <View style={styles.container}>
      {/* 제목 카드 컴포넌트 */}
      <TitleCard title={titleText} />

      {/* 기도문 목록 컴포넌트 */}
      <PrayerCardList
        prayerContents={prayerContents}
        onEdit={onEdit}
        onDelete={onDelete}
      />
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
