import { useEffect } from "react";
import { BackHandler } from "react-native";

export default function useCloseOnBack(
  open: boolean,
  setOpen: (open: boolean) => void
) {
  useEffect(() => {
    const backAction = () => {
      if (open) {
        setOpen(false);
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [open, setOpen]);
}
