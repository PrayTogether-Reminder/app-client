import { Fragment } from "react";
import { Tabs } from "tamagui";
import type { BottomTabActiveType } from "../types/bottomTabActiveType";
import { backgroundColor } from "../../../../common/styles/color";
import * as ExpoIcons from "@expo/vector-icons";

type TabDialogTriggerProps = {
  activeStatus: BottomTabActiveType;
  iconFamily: keyof typeof ExpoIcons;
  iconName: string;
  size?: number;
  color?: string;
  setOpen: (value: boolean) => void;
};

const TabDialogTrigger = ({
  activeStatus,
  iconFamily,
  iconName,
  size = 24,
  color = "black",
  setOpen,
}: TabDialogTriggerProps) => {
  const IconComponent = ExpoIcons[iconFamily];

  return (
    <Fragment>
      <Tabs.Tab
        value={activeStatus}
        flex={1}
        flexDirection="column"
        alignItems="center"
        pressStyle={{
          backgroundColor: backgroundColor.default,
          scale: 0.9,
          opacity: 0.7,
        }}
        onPress={() => setOpen(true)}
      >
        <IconComponent name={iconName} size={size} color={color} />
      </Tabs.Tab>
    </Fragment>
  );
};

export default TabDialogTrigger;
