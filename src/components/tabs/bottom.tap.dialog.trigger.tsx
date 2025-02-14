import { Fragment } from "react";
import { Tabs } from "tamagui";
import type { BottomTabActiveType } from "../../types/bottom.tab.active.type";

type TabDialogTriggerProps = {
  activeStatus: BottomTabActiveType;
  icon: any;
  setOpen: (value: boolean) => void;
};

const TabDialogTrigger = ({
  activeStatus,
  icon: LucideIcon,
  setOpen,
}: TabDialogTriggerProps) => {
  return (
    <Fragment>
      <Tabs.Tab
        value={activeStatus}
        flex={1}
        flexDirection="column"
        alignItems="center"
        pressStyle={{ backgroundColor: "white", scale: 0.9, opacity: 0.7 }}
        onPress={() => setOpen(true)}
      >
        <LucideIcon
          strokeWidth={2}
          size="$3"
          $sm={{ size: "$3" }}
          $md={{ size: "$4" }}
          $lg={{ size: "$5" }}
        />
      </Tabs.Tab>
    </Fragment>
  );
};

export default TabDialogTrigger;
