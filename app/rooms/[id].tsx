import { Fragment, useState, useRef } from "react";
import Top1Body10Bottom1 from "../../src/common/layout/Top1Body10Bottom1";
import PrayerRoomTop from "./_components/[id]/PrayerRoomTop";
import PrayerRoomBody from "./_components/[id]/PrayerRoomBody";
import PrayerRoomBottom from "./_components/[id]/PrayerRoomBottom";
import RoomMembersModal from "./_components/[id]/RoomMembersModal";
import RoomInviteDialog from "./_components/[id]/RoomInviteDialog";

export default function PrayerRoomScreen(): JSX.Element {
  const [rightMenueVisible, setRightMenueVisible] = useState(false);
  const [inviteVisible, setInviteVisible] = useState(false);
  const emailRef = useRef({ email: "" });

  // Right menu open/close functions
  const openRightMenu = () => {
    console.log("open Right Menu");
    setRightMenueVisible(true);
  };

  const closeRightMenu = () => {
    console.log("close Right Menu");
    setRightMenueVisible(false);
  };

  // Invite dialog open/close functions
  const openInvite = () => {
    console.log("open Invite");
    setInviteVisible(true);
  };

  const closeInvite = () => {
    console.log("close Invite");
    emailRef.current.email = "";
    setInviteVisible(false);
  };

  return (
    <Fragment>
      <RoomMembersModal
        visible={rightMenueVisible}
        closeRightMenu={closeRightMenu}
        openInvite={openInvite}
      />
      <RoomInviteDialog
        visible={inviteVisible}
        closeInvite={closeInvite}
        emailRef={emailRef}
      />
      <Top1Body10Bottom1
        tops={[<PrayerRoomTop openRightMenu={openRightMenu} />]}
        bodies={[<PrayerRoomBody />]}
        bottoms={[<PrayerRoomBottom />]}
      />
    </Fragment>
  );
}
