import { StyleSheet, View } from "react-native";
import { TouchableRipple, useTheme } from "react-native-paper";
import { RFValue } from "react-native-responsive-fontsize";
import type { BottomTabActiveType } from "../types/bottomTabActiveType";
import { backgroundColor } from "../../../../common/styles/color";
import * as ExpoIcons from "@expo/vector-icons";

type TabItemProps = {
  activeStatus: BottomTabActiveType;
  iconFamily: keyof typeof ExpoIcons;
  iconName: string;
  size?: number;
  color?: string;
  active?: boolean;
  onPress?: () => void;
};

const TabItem = ({
  activeStatus,
  iconFamily,
  iconName,
  size = 24,
  color = "black",
  active = false,
  onPress,
}: TabItemProps) => {
  const IconComponent = ExpoIcons[iconFamily];
  const theme = useTheme();

  return (
    <TouchableRipple
      style={styles.tab}
      rippleColor="rgba(0, 0, 0, .10)"
      onPress={onPress}
      underlayColor={backgroundColor.default}
    >
      <View style={[styles.tabContent, active && styles.activeTab]}>
        <IconComponent name={iconName} size={RFValue(size)} color={color} />
      </View>
    </TouchableRipple>
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
  activeTab: {
    // Add styling for active state if needed
  },
});

export default TabItem;
