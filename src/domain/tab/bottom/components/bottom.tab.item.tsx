import { Tabs } from "tamagui";
import type { BottomTabActiveType } from "../types/bottom.tab.active.type";
import { backgroundColor } from "../../../../common/styles/color";

type TabItemProps = {
  activeStatus: BottomTabActiveType;
  icon: any;
};

const TabItem = ({ activeStatus, icon: LucideIcon }: TabItemProps) => {
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
      <LucideIcon
        strokeWidth={2}
        size="$3"
        $sm={{ size: "$3" }}
        $md={{ size: "$4" }}
        $lg={{ size: "$5" }}
      />
    </Tabs.Tab>
  );
};

export default TabItem;
