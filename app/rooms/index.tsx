import { Fragment } from "react";
import { View } from "tamagui";
import Top1Body10Bottom1 from "../../src/common/layout/Top1Body10Bottom1";
import RoomList from "../../src/domain/rooms/components/RoomList";
import RoomCreationFloatingButton from "../../src/domain/rooms/components/buttons/RoomCreationFloatingButton";
import BottomTabs from "../../src/domain/tab/bottom/components/BottomTabs";

export default function RoomsScreen() {
  return (
    <Fragment>
      <Top1Body10Bottom1
        {...{
          tops: [<View />],
          bodies: [<RoomList />, <RoomCreationFloatingButton />],
          bottoms: [<BottomTabs />],
        }}
      ></Top1Body10Bottom1>
    </Fragment>
  );
}
