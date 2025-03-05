import React, { useEffect, useRef, useState } from "react";
import { Dialog, Fieldset, Input, Button, Label, Unspaced } from "tamagui";
import Feather from "@expo/vector-icons/Feather";
import { keyboardHideDelFocus } from "../../../../common/services/keyboard/keyboardService";
import useCloseOnBack from "../../../../common/services/back-handler/useCloseOnBack";

type RoomCreationDialogProp = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export default function RoomCreationDialog({
  open,
  setOpen,
}: RoomCreationDialogProp) {
  if (open) console.log("room createion dialog open");
  else if (!open) console.log("room createion dialog close");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const titleRef = useRef<Input>(null);
  const descriptionRef = useRef<Input>(null);

  const handleTitleChange = (title: string) => {
    setTitle(() => title);
  };
  const handleDescriptionChange = (description: string) => {
    setDescription(() => description);
  };

  useCloseOnBack(open, setOpen);

  keyboardHideDelFocus([titleRef, descriptionRef]);

  return (
    <Dialog modal open={open} onOpenChange={setOpen} disableRemoveScroll>
      <Dialog.Portal>
        <Dialog.Overlay
          key="overlay"
          backgroundColor="#BEBFC5"
          opacity={0.6}
          animation="quick"
          enterStyle={{ opacity: 0.3 }}
          exitStyle={{ opacity: 0 }}
        />

        <Dialog.Content
          position="absolute"
          width="70%"
          height="auto"
          elevate
          key="content"
          animateOnly={["transform", "opacity"]}
          animation={[
            "quick",
            {
              opacity: {
                overshootClamping: true,
              },
            },
          ]}
          enterStyle={{ x: 0, y: -40, opacity: 0, scale: 0.5 }}
          exitStyle={{ x: 0, y: -40, opacity: 0, scale: 0.5 }}
          gap="$4"
        >
          <Dialog.Title>기도방 생성</Dialog.Title>

          <Fieldset height="$8" gap="$1" alignItems="center">
            <Label width="$5" fontSize="$6" justifyContent="flex-end">
              방 제목
            </Label>
            <Input
              ref={titleRef}
              placeholder="방 제목이 무엇인가요?"
              value={title}
              onChangeText={handleTitleChange}
              flex={1}
              width="100%"
            />
          </Fieldset>

          <Fieldset height="$14" flexDirection="column" alignItems="center">
            <Label width="$5" fontSize="$6" justifyContent="flex-end">
              방 설명
            </Label>
            <Input
              ref={descriptionRef}
              placeholder="어떤 기도를 위한 방인가요?"
              value={description}
              onChangeText={handleDescriptionChange}
              flex={1}
              width="100%"
              multiline
            />
          </Fieldset>

          <Dialog.Close asChild>
            <Button
              alignSelf="center"
              width="50%"
              marginTop="$2"
              marginBottom="$4"
              theme="accent"
              aria-label="생성"
            >
              생성
            </Button>
          </Dialog.Close>

          <Unspaced>
            <Dialog.Close asChild>
              <Button
                position="absolute"
                top="$3"
                right="$3"
                size="$2"
                circular
                icon={<Feather name="x" size={24} color="black" />}
              />
            </Dialog.Close>
          </Unspaced>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  );
}
