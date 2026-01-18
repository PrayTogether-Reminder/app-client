// app/(tabs)/rooms/index.tsx
import { Fragment, useEffect } from "react";
import Top1Body10 from "../../../../src/common/components/layout/Top1Body10";
import { TopHeader } from "../../../../src/common/components/header/TopHeader";
import {
  useTutorialStore,
  TutorialSpotlight,
} from "../../../../src/common/components/tutorial";
import RoomList from "../../rooms/index/_compontents/RoomList";
import RoomCreationFloatingButton from "../../rooms/index/_compontents/buttons/RoomCreationFloatingButton";

export default function RoomsScreen() {
  const openTutorial = useTutorialStore((state) => state.openTutorial);
  const checkTutorialStatus = useTutorialStore(
    (state) => state.checkTutorialStatus
  );

  // 컴포넌트 마운트 시 튜토리얼 상태 확인
  useEffect(() => {
    checkTutorialStatus();
  }, []);

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
      <TutorialSpotlight />
    </Fragment>
  );
}
