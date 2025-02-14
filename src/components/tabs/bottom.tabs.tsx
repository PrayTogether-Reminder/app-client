import { House, SquarePlus, UserRoundCog } from "@tamagui/lucide-icons";
import React from "react";
import { Separator, Tabs, View } from "tamagui";
import {
  BottomTabActiveStatus,
  BottomTabActiveType,
} from "../../types/bottom.tab.active.type";
import TabItem from "./bottom.tab.item";
import TabItemModal from "./bottom.tap.dialog.trigger";

import { useBottomTabActive } from "../../hooks/bottom.tap.active.hooks";
import TabDialogTrigger from "./bottom.tap.dialog.trigger";

interface BottomTabsProps {
  setDialogOpen: (value: boolean) => void;
}

export default function BottomTabs({ setDialogOpen }: BottomTabsProps) {
  const { bottomTabActive, setTabActive } = useBottomTabActive();
  return (
    <Tabs
      value={bottomTabActive.status}
      defaultValue={BottomTabActiveStatus.ROOMS}
      orientation="horizontal"
      flex={1}
      onValueChange={(value) => setTabActive(value as BottomTabActiveType)}
    >
      <View flex={1}>
        <Tabs.List
          backgroundColor="$background"
          height="100%"
          flexDirection="row"
          justifyContent="center"
          alignItems="center"
          paddingHorizontal="$4"
          borderRadius={0}
        >
          <TabItem activeStatus={BottomTabActiveStatus.ROOMS} icon={House} />

          <Separator vertical height="50%" marginHorizontal="$2" />

          <TabDialogTrigger
            activeStatus={BottomTabActiveStatus.CREATE_ROOM}
            icon={SquarePlus}
            setOpen={setDialogOpen}
          ></TabDialogTrigger>

          <Separator vertical height="50%" marginHorizontal="$2" />

          <TabItem
            activeStatus={BottomTabActiveStatus.PROFILES}
            icon={UserRoundCog}
          />
        </Tabs.List>
      </View>
    </Tabs>
  );
}
