import React, { useState } from "react";
import { BottomActionButton } from "@/common/components/button";
import PrayerTitleCreationDialog from "./dialogs/PrayerTitleCreationDialog";

interface PrayerRoomBottomButtonProps {}

const PrayerRoomBottomButton: React.FC<PrayerRoomBottomButtonProps> = ({}) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const handlePress = () => {
    setDialogOpen(true);
  };

  return (
    <>
      <BottomActionButton
        onPress={handlePress}
        icon="pencil"
        text="기도제목 작성하기"
      />

      <PrayerTitleCreationDialog
        open={dialogOpen}
        setOpen={setDialogOpen}
      />
    </>
  );
};

export default PrayerRoomBottomButton;
