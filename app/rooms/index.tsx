import { Fragment, useState } from "react";
import { View } from "tamagui";
import RoomCreationDialog from "../../src/domain/rooms/components/dialogs/RoomCreationDialog";
import BottomTabs from "../../src/domain/tab/bottom/components/BottomTabs";
import Top1Body10Bottom1 from "../../src/common/layout/Top1Body10Bottom1";
import RoomList from "../../src/domain/rooms/components/RoomList";
import RoomCreationFloationButton from "../../src/domain/rooms/components/buttons/RoomCreationFloationButton";

export default function RoomsScreen() {
  return (
    <Fragment>
      <Top1Body10Bottom1
        {...{
          tops: [<View />],
          bodies: [<RoomList />, <RoomCreationFloationButton />],
          bottoms: [<BottomTabs />],
        }}
      ></Top1Body10Bottom1>
    </Fragment>
  );
}
