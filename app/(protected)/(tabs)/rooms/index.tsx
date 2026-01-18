// app/(tabs)/rooms/index.tsx
import { Fragment } from "react";
import Top1Body10 from "../../../../src/common/components/layout/Top1Body10";
import { TopHeader } from "../../../../src/common/components/header/TopHeader";
import { useTutorialStore } from "../../../../src/common/components/tutorial";
import RoomList from "../../rooms/index/_compontents/RoomList";
import RoomCreationFloatingButton from "../../rooms/index/_compontents/buttons/RoomCreationFloatingButton";

export default function RoomsScreen() {
  const openTutorial = useTutorialStore((state) => state.openTutorial);

  return (
    <Fragment>
      <Top1Body10
        {...{
          tops: [
            <TopHeader
              title="기도방"
              rightAction={{
                icon: "help-circle-outline",
                onPress: openTutorial,
              }}
            />,
          ],
          bodies: [<RoomList />, <RoomCreationFloatingButton />],
        }}
      />
    </Fragment>
  );
}
