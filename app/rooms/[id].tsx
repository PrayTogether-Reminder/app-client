import { Fragment, useState } from "react";
import Top1Body10Bottom1 from "../../src/common/layout/Top1Body10Bottom1";
import PrayerRoomHeader from "../../src/domain/prayerRoom/components/PrayerRoomHeader";
import PrayerRoomBody from "../../src/domain/prayerRoom/components/PrayerRoomBody";
import PrayerRoomBottom from "../../src/domain/prayerRoom/components/PrayerRoomBottom";
import PrayerRoomDrawer from "../../src/domain/inviteRoom/components/InviteDrawer";

export default function PrayerRoomScreen(): JSX.Element {
  const [drawerVisible, setDrawerVisible] = useState(false);

  const toggleDrawer = () => {
    setDrawerVisible(!drawerVisible);
  };

  return (
    <Fragment>
      <PrayerRoomDrawer visible={drawerVisible} onClose={toggleDrawer} />
      <Top1Body10Bottom1
        tops={[<PrayerRoomHeader toggleDrawer={toggleDrawer} />]}
        bodies={[<PrayerRoomBody />]}
        bottoms={[<PrayerRoomBottom />]}
      />
    </Fragment>
  );
}
