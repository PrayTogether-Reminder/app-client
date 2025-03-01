import AntDesign from "@expo/vector-icons/AntDesign";
import { Fragment, useState } from "react";
import { Button, styled } from "tamagui";
import { backgroundColor, color } from "../../../../common/styles/color";
import RoomCreationDialog from "../dialogs/RoomCreationDialog";
import { useWindowDimensions } from "react-native";

const FloatingButton = styled(Button, {
  position: "absolute",
  bottom: "$4",
  right: "$4",
  width: "$6",
  height: "$6",
  borderRadius: "$6",
  padding: "$2",
  backgroundColor: color.secondary,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,
  elevation: 5,
  pressStyle: {
    backgroundColor: color.secondary,
  },
});

export default function RoomCreationFloatingButton() {
  const { width } = useWindowDimensions();
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <Fragment>
      <FloatingButton
        icon={<AntDesign name="plus" size={width * 0.09} color="white" />}
        onPress={() => setDialogOpen(true)}
      />

      <RoomCreationDialog open={dialogOpen} setOpen={setDialogOpen} />
    </Fragment>
  );
}
