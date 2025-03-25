import { useEffect } from "react";
import { BackHandler } from "react-native";

export function useCloseOnBack(callback: () => void) {
  useEffect(() => {
    const backAction = () => {
      callback();
      return true; // 기본 동작 방지
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove(); // 컴포넌트 언마운트 시 이벤트 리스너 제거
  }, []);
}
