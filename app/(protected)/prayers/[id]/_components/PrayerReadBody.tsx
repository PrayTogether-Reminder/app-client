import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { PrayerContent } from "../../../../../src/domain/prayers/types/prayerContent";
import TitleCard from "./TitleCard";
import PrayerCardList from "./PrayerCardList";
import EmptyState from "./EmptyState";
import { useSelectedPrayerTitleStore } from "../../../../../src/domain/prayers/stores/useSelectedPrayerTitleStore";
import { useSelectedRoomStore } from "../../../../../src/domain/rooms/stores/useSelectedRoomStore";
import { usePrayerContentsQuery } from "@/domain/prayers/hooks/queries/usePrayerQueries";
import FetchError from "@/common/components/error/FetchError";
import LoadingScreen from "@/common/components/loading/LoadingScreen";
import OverlayLoading from "@/common/components/loading/OverlayLoading";

interface PrayerReadBodyProps {
  onEdit?: (prayerContent: PrayerContent) => void;
  onDelete?: (prayerContent: PrayerContent) => void;
}

function PrayerReadBody({ onEdit, onDelete }: PrayerReadBodyProps) {
  const { selectedPrayerTitle } = useSelectedPrayerTitleStore();
  const titleText = selectedPrayerTitle?.title ?? "기도 제목을 알 수 없습니다.";
  const { selectedRoom } = useSelectedRoomStore();
  const {
    data: prayerContents,
    isLoading,
    isError,
    error,
    refetch,
  } = usePrayerContentsQuery(
    selectedRoom?.id ?? null,
    selectedPrayerTitle?.id ?? null
  );

  if (isLoading && !prayerContents) {
    return <OverlayLoading />;
  }

  if (isError) {
    return (
      <FetchError error={error} onRetry={refetch} isRetrying={isLoading} />
    );
  }

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
  },
});

export default PrayerReadBody;
