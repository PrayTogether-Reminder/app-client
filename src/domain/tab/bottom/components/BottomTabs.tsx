import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import React from "react";
import { Separator, Tabs, View } from "tamagui";
import {
  BottomTabActiveStatus,
  BottomTabActiveType,
} from "../types/bottomTabActiveType";
import TabItem from "./BottomTabItem";
import { backgroundColor } from "../../../../common/styles/color";

import { useBottomTabActive } from "../hooks/bottomTabActiveHooks";
import { useWindowDimensions } from "react-native";

export default function BottomTabs() {
  const { bottomTabActive, setTabActive } = useBottomTabActive();
  const { width } = useWindowDimensions();
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
          <TabItem
            activeStatus={BottomTabActiveStatus.ROOMS}
            iconFamily="FontAwesome6"
            iconName="house-chimney"
            color="black"
            size={width * 0.07}
          />

          <Separator vertical height="50%" marginHorizontal="$2" />

          <TabItem
            activeStatus={BottomTabActiveStatus.PROFILES}
            iconFamily="FontAwesome6"
            iconName="user-gear"
            color="black"
            size={width * 0.07}
          />
        </Tabs.List>
      </View>
    </Tabs>
  );
}
