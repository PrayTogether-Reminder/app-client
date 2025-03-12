import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import React from "react";
import { View, StyleSheet, useWindowDimensions } from "react-native";
import { Surface, Divider, useTheme } from "react-native-paper";
import { RFValue } from "react-native-responsive-fontsize";
import {
  BottomTabActiveStatus,
  BottomTabActiveType,
} from "../types/bottomTabActiveType";
import TabItem from "./BottomTabItem";
import { backgroundColor } from "../../../../common/styles/color";
import { useBottomTabActive } from "../hooks/useBootomTabActive";

export default function BottomTabs() {
  const { bottomTabActive, setTabActive } = useBottomTabActive();
  const { width } = useWindowDimensions();
  const theme = useTheme();

  const handleTabPress = (value: BottomTabActiveType) => {
    setTabActive(value);
  };

  return (
    <Surface style={styles.container} elevation={4}>
      <View style={styles.tabBar}>
        <TabItem
          activeStatus={BottomTabActiveStatus.ROOMS}
          iconFamily="FontAwesome6"
          iconName="house-chimney"
          color="black"
          size={width * 0.07}
          active={bottomTabActive.status === BottomTabActiveStatus.ROOMS}
          onPress={() => handleTabPress(BottomTabActiveStatus.ROOMS)}
        />

        <Divider style={styles.divider} />

        <TabItem
          activeStatus={BottomTabActiveStatus.PROFILES}
          iconFamily="FontAwesome6"
          iconName="user-gear"
          color="black"
          size={width * 0.07}
          active={bottomTabActive.status === BottomTabActiveStatus.PROFILES}
          onPress={() => handleTabPress(BottomTabActiveStatus.PROFILES)}
        />
      </View>
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: backgroundColor.default,
  },
  tabBar: {
    height: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: RFValue(16),
  },
  divider: {
    height: "50%",
    width: StyleSheet.hairlineWidth,
    marginHorizontal: RFValue(8),
  },
});
