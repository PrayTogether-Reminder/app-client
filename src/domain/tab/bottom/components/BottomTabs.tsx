import { House, UserRoundCog } from "@tamagui/lucide-icons";
import React from "react";
import { Separator, Tabs, View } from "tamagui";
import {
  BottomTabActiveStatus,
  BottomTabActiveType,
} from "../types/BottomTabActiveType";
import TabItem from "./BottomTabItem";
import { backgroundColor } from "../../../../common/styles/color";

import { useBottomTabActive } from "../hooks/BottomTabActiveHooks";

export default function BottomTabs() {
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
          backgroundColor={backgroundColor.default}
          height="100%"
          flexDirection="row"
          justifyContent="center"
          alignItems="center"
          paddingHorizontal="$4"
          borderRadius={0}
        >
          <TabItem activeStatus={BottomTabActiveStatus.ROOMS} icon={House} />

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
