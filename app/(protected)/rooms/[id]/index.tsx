import { Fragment, useState } from "react";
import { StyleSheet } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import Top1Body10Bottom1 from "@/common/components/layout/Top1Body10Bottom1";
import PrayerRoomTop from "./_components/PrayerRoomTop";
import PrayerRoomBody from "./_components/PrayerRoomBody";
import PrayerRoomBottom from "./_components/PrayerRoomBottom";
import RoomMembersModal from "./_components/RoomMembersModal";
import path from "@/common/constants/path";

export default function PrayerRoomScreen(): React.ReactElement {
  const router = useRouter();
  const params = useLocalSearchParams();
  const roomId = Number(params.id);

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
      <Top1Body10Bottom1
        tops={[<PrayerRoomTop openRightMenu={openRightMenu} />]}
        bodies={[<PrayerRoomBody roomId={roomId} />]}
        bottoms={[<PrayerRoomBottom />]}
      />
    </Fragment>
  );
}
