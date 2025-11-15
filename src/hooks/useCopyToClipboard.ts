import { useCallback } from "react";
import * as Clipboard from "expo-clipboard";
import Toast from "react-native-toast-message";

interface CopyOptions {
  successTitle?: string;
  successMessage?: string;
}

interface UseCopyToClipboardReturn {
  copyToClipboard: (text: string, options?: CopyOptions) => void;
}

/**
 * 클립보드 복사 기능을 제공하는 Hook
 * 복사 완료 시 Toast 메시지를 자동으로 표시합니다.
 */
export function useCopyToClipboard(): UseCopyToClipboardReturn {
  const copyToClipboard = useCallback((text: string, options?: CopyOptions) => {
    Clipboard.setString(text);
    Toast.show({
      type: "success",
      text1: options?.successTitle || "복사 완료",
      text2: options?.successMessage,
      position: "top",
      visibilityTime: 2000,
      autoHide: true,
      topOffset: 60,
    });
  }, []);

  return { copyToClipboard };
}
