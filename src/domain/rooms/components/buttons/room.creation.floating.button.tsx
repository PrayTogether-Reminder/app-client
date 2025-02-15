import { Button, styled } from "tamagui";
import { color } from "../../../../common/styles/color";
import { Plus } from "@tamagui/lucide-icons";
import { Fragment, useCallback, useState } from "react";
import RoomCreationDialog from "../dialogs/room.creation.dialog";

const FloatingButton = styled(Button, {
  position: "absolute",
  bottom: "$4",
  right: "$4",
  width: "$6",
  height: "$6",
  borderRadius: "$6",
  backgroundColor: color.secondary,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,
  elevation: 5,
});

export default function RoomCreationFloationButton() {
  const handleCreateRoom = useCallback(() => {
    console.log("Create new room");
    setDialogOpen(true);
  }, []);
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <Fragment>
      <FloatingButton
        icon={<Plus size="$1.5" color="white" />}
        onPress={handleCreateRoom}
      />
      <RoomCreationDialog open={dialogOpen} setOpen={setDialogOpen} />
    </Fragment>
  );
}
