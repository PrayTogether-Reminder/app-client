import { useBottomTabActiveStore } from "../stores/BottomTabActiveStore";

export const useBottomTabActive = () => {
  const bottomTabActiveStore = useBottomTabActiveStore();

  return {
    //state
    bottomTabActive: bottomTabActiveStore.bottomTabActive,

    //actions
    setTabActive: bottomTabActiveStore.setTabActive,
  };
};
