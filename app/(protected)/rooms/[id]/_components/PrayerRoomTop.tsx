import React from "react";
import { useRouter } from "expo-router";
import { RFValue } from "react-native-responsive-fontsize";
import { TopHeader } from "../../../../../src/common/components/header/TopHeader";
import { useSelectedRoomStore } from "../../../../../src/domain/rooms/stores/useSelectedRoomStore";

interface PrayerRoomTopProps {
  openRightMenu: () => void;
}

const PrayerRoomTop: React.FC<PrayerRoomTopProps> = ({ openRightMenu }) => {
  const router = useRouter();
  const room = useSelectedRoomStore().selectedRoom;

  return (
    <TopHeader
      title={room?.name as string}
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