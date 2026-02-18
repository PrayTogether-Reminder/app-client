import React from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { RFValue } from "react-native-responsive-fontsize";
import { TopHeader } from "../../../../../src/common/components/header/TopHeader";
import { useRoomQuery } from "@/domain/rooms/hooks/queries/useRoomQueries";

interface PrayerRoomTopProps {
  openRightMenu: () => void;
}

const PrayerRoomTop: React.FC<PrayerRoomTopProps> = ({ openRightMenu }) => {
  const router = useRouter();
  const roomId = Number(useLocalSearchParams().id);
  const { data: room } = useRoomQuery(roomId);

  return (
    <TopHeader
      title={room?.name ?? ""}
      onBackPress={() => router.back()}
      rightAction={{
        icon: "menu",
        onPress: openRightMenu,
        size: RFValue(24),
      }}
    />
  );
};

export default PrayerRoomTop;