import { Fragment } from "react";
import Top1Body10Bottom1 from "../../src/common/layout/Top1Body10Bottom1";
import PrayerRoomHeader from "../../src/domain/prayerRoom/components/PrayerRoomHeader";
import PrayerRoomBody from "../../src/domain/prayerRoom/components/PrayerRoomBody";
import PrayerRoomBottom from "../../src/domain/prayerRoom/components/PrayerRoomBottom";

export default function PrayerRoomScreen(): JSX.Element {
  return (
    <Fragment>
      <Top1Body10Bottom1
        tops={[<PrayerRoomHeader />]}
        bodies={[<PrayerRoomBody />]}
        bottoms={[<PrayerRoomBottom />]}
      />
    </Fragment>
  );
}
