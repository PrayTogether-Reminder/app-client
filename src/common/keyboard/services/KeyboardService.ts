import { Keyboard } from "react-native";
import { RefObject, useEffect } from "react";

export const keyboardHideDelFocus = (refs: RefObject<any>[]) => {
  useEffect(() => {
    // const keyboardDidShowListener = Keyboard.addListener(
    //   "keyboardDidShow",
    //   () => {}
    // );

    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        refs.forEach((ref) => ref.current?.blur());
      }
    );

    return () => {
      // keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, [refs]);
};
