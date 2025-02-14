import { Fragment, useState } from "react";
import { View } from "tamagui";
import CreatePrayerRoomDialog from "../../src/components/dialog/create.prayer.room";
import BottomTab from "../../src/components/tabs/bottom.tabs";

export default function RoomsScreen() {
  const [dialogOpen, setDialogOpen] = useState(false);
  return (
    <Fragment>
      <View flex={1} justifyContent="center" alignItems="center">
        <View flex={1} backgroundColor="blue" height="100%" width="100%"></View>
        <View
          flex={10}
          backgroundColor="green"
          height="100%"
          width="100%"
        ></View>
        <View flex={1} backgroundColor="tomato" height="100%" width="100%">
          <BottomTab setDialogOpen={setDialogOpen} />
        </View>
      </View>
      <CreatePrayerRoomDialog open={dialogOpen} setOpen={setDialogOpen} />
    </Fragment>
  );
}
