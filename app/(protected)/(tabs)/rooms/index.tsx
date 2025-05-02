// app/(tabs)/rooms/index.tsx
import { Fragment } from "react";
import { View } from "react-native";
import Top1Body10 from "../../../../src/common/layout/Top1Body10";
import RoomList from "../../rooms/index/_compontents/RoomList";
import RoomCreationFloatingButton from "../../rooms/index/_compontents/buttons/RoomCreationFloatingButton";

export default function RoomsScreen() {
  return (
    <Fragment>
      <Top1Body10
        {...{
          tops: [<View />],
          bodies: [<RoomList />, <RoomCreationFloatingButton />],
        }}
      />
    </Fragment>
  );
}
