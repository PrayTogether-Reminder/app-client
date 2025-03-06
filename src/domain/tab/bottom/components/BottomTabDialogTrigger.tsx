import { Fragment } from "react";
import { StyleSheet, View } from "react-native";
import { TouchableRipple, useTheme } from "react-native-paper";
import { RFValue } from "react-native-responsive-fontsize";
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
      <TouchableRipple
        style={styles.tab}
        rippleColor="rgba(0, 0, 0, .10)"
        onPress={() => setOpen(true)}
        underlayColor={backgroundColor.default}
      >
        <View style={styles.tabContent}>
          <IconComponent name={iconName} size={RFValue(size)} color={color} />
        </View>
      </TouchableRipple>
    </Fragment>
  );
};

const styles = StyleSheet.create({
  tab: {
    flex: 1,
    justifyContent: "center",
  },
  tabContent: {
    flexDirection: "column",
    alignItems: "center",
    paddingVertical: RFValue(8),
  },
});

export default TabDialogTrigger;
