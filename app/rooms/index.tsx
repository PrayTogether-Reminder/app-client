import { Fragment, useState } from "react";
import { View } from "tamagui";
import CreatePrayerRoomDialog from "../../src/domain/rooms/components/dialog/create.prayer.room";
import BottomTabs from "../../src/domain/tab/bottom/components/bottom.tabs";
import Top1Body10Bottom1 from "../../src/common/layout/tob1.body10.bottom1";
import RoonList from "../../src/domain/rooms/components/room.list";

export default function RoomsScreen() {
  const [dialogOpen, setDialogOpen] = useState(false);
  return (
    <Fragment>
      <Top1Body10Bottom1
        {...{
          top: <View />,
          body: <RoonList />,
          bottom: <BottomTabs />,
        }}
      ></Top1Body10Bottom1>
      <CreatePrayerRoomDialog open={dialogOpen} setOpen={setDialogOpen} />
    </Fragment>
  );
}
