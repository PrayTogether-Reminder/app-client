import { Fragment, useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Top1Body10Bottom1Layout } from "@/common/components/layout";
import PrayerRoomTop from "./_components/PrayerRoomTop";
import PrayerRoomBody from "./_components/PrayerRoomBody";
import PrayerRoomBottom from "./_components/PrayerRoomBottom";
import RoomMembersModal from "./_components/RoomMembersModal";
import path from "@/common/constants/path";
import { useSelectedRoomStore } from "@/domain/rooms/stores/useSelectedRoomStore";
import { useRoomQuery } from "@/domain/rooms/hooks/queries/useRoomQueries";

export default function PrayerRoomScreen(): React.ReactElement {
  const router = useRouter();
  const params = useLocalSearchParams();
  const roomId = Number(params.id);

  // 알림 등 deep link로 진입 시 store에 room이 없을 수 있으므로 API로 조회
  const selectedRoom = useSelectedRoomStore((s) => s.selectedRoom);
  const selectRoom = useSelectedRoomStore((s) => s.selectRoom);
  const { data: fetchedRoom } = useRoomQuery(
    selectedRoom?.id === roomId ? null : roomId
  );

  useEffect(() => {
    if (fetchedRoom) {
      selectRoom(fetchedRoom);
    }
  }, [fetchedRoom, selectRoom]);

  const [rightMenueVisible, setRightMenueVisible] = useState(false);

  // Right menu open/close functions
  const openRightMenu = () => {
    console.log("open Right Menu");
    setRightMenueVisible(true);
  };

  const closeRightMenu = () => {
    console.log("close Right Menu");
    setRightMenueVisible(false);
  };

  // Invite - 새 화면으로 이동
  const openInvite = () => {
    console.log("open Invite Friends");
    closeRightMenu(); // 메뉴 닫고
    router.push(path.showInviteFriends(roomId)); // 기도방 초대 화면으로 이동
  };

  return (
    <Fragment>
      <RoomMembersModal
        visible={rightMenueVisible}
        closeRightMenu={closeRightMenu}
        openInvite={openInvite}
      />
      <Top1Body10Bottom1Layout
        showBackButton={false}
        keyboardAvoiding
        scrollable={false}
        contentPadding={false}
        tops={[<PrayerRoomTop openRightMenu={openRightMenu} />]}
        bodies={[<PrayerRoomBody roomId={roomId} />]}
        bottoms={[<PrayerRoomBottom />]}
      />
    </Fragment>
  );
}
