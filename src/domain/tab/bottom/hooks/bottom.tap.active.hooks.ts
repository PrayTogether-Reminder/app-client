import { useBottomTabActiveStore } from "../stores/bottom.tap.active.store";

export const useBottomTabActive = () => {
  const bottomTabActiveStore = useBottomTabActiveStore();

  return {
    //state
    bottomTabActive: bottomTabActiveStore.bottomTabActive,

    //actions
    setTabActive: bottomTabActiveStore.setTabActive,
  };
};
