import React from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { RFValue } from "react-native-responsive-fontsize";
import { TopHeader } from "../../../../../src/common/components/header/TopHeader";
import { useRoomQuery } from "@/domain/rooms/hooks/queries/useRoomQueries";

interface PrayerReadTopProps {
  isEditMode: boolean;
  onToggleEditMode: () => void;
}

const PrayerReadTop: React.FC<PrayerReadTopProps> = ({ isEditMode, onToggleEditMode }) => {
  const router = useRouter();
  const roomId = useLocalSearchParams().roomId;
  const { data: room } = useRoomQuery(roomId ? Number(roomId) : null);

  return (
    <TopHeader
      title={room?.name ?? ""}
      onBackPress={() => {
        if (isEditMode) {
          onToggleEditMode(); // 편집 모드 종료
        } else {
          router.back();
        }
      }}
      rightAction={{
        icon: isEditMode ? "check" : "pencil",
        onPress: onToggleEditMode,
        size: RFValue(28),
        isActive: isEditMode,
      }}
    />
  );
};

export default PrayerReadTop;
