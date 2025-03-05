import { Tabs } from "tamagui";
import type { BottomTabActiveType } from "../types/bottomTabActiveType";
import { backgroundColor } from "../../../../common/styles/color";
import * as ExpoIcons from "@expo/vector-icons";

type TabItemProps = {
  activeStatus: BottomTabActiveType;
  iconFamily: keyof typeof ExpoIcons;
  iconName: string;
  size?: number;
  color?: string;
};

const TabItem = ({
  activeStatus,
  iconFamily,
  iconName,
  size = 24,
  color = "black",
}: TabItemProps) => {
  const IconComponent = ExpoIcons[iconFamily];

  return (
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
    >
      <IconComponent name={iconName} size={size} color={color} />
    </Tabs.Tab>
  );
};

export default TabItem;
