import { Fragment, useState } from "react";
import { View } from "tamagui";
import CreatePrayerRoomDialog from "../../src/domain/rooms/components/dialogs/room.creation.dialog";
import BottomTabs from "../../src/domain/tab/bottom/components/bottom.tabs";
import Top1Body10Bottom1 from "../../src/common/layout/tob1.body10.bottom1";
import RoomList from "../../src/domain/rooms/components/room.list";
import RoomCreationFloationButton from "../../src/domain/rooms/components/buttons/room.creation.floating.button";

export default function RoomsScreen() {
  const [dialogOpen, setDialogOpen] = useState(false);
  return (
    <Fragment>
      <Top1Body10Bottom1
        {...{
          tops: [<View />],
          bodies: [<RoomList />, <RoomCreationFloationButton />],
          bottoms: [<BottomTabs />],
        }}
      ></Top1Body10Bottom1>
      <CreatePrayerRoomDialog open={dialogOpen} setOpen={setDialogOpen} />
    </Fragment>
  );
}
