import { useBottomTabActiveStore } from "../stores/bottomTabActiveStore";

export const useBottomTabActive = () => {
  const bottomTabActiveStore = useBottomTabActiveStore();

  return {
    //state
    bottomTabActive: bottomTabActiveStore.bottomTabActive,

    //actions
    setTabActive: bottomTabActiveStore.setTabActive,
  };
};
