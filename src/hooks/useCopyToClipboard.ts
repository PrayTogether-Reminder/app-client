import { useCallback } from "react";
import * as Clipboard from "expo-clipboard";
import Toast from "react-native-toast-message";

interface CopyOptions {
  successTitle?: string;
  successMessage?: string;
}

interface ToastOptions {
  type?: "success" | "error" | "info";
  text1: string;
  text2?: string;
}

interface UseCopyToClipboardReturn {
  copyToClipboard: (text: string, options?: CopyOptions) => Promise<void>;
  showToast: (options: ToastOptions) => void;
}

/**
 * 클립보드 복사 기능을 제공하는 Hook
 * 복사 완료 시 Toast 메시지를 자동으로 표시합니다.
 */
export function useCopyToClipboard(): UseCopyToClipboardReturn {
  const showToast = useCallback((options: ToastOptions) => {
    Toast.show({
      type: options.type || "success",
      text1: options.text1,
      text2: options.text2,
      position: "top",
      visibilityTime: 2000,
      autoHide: true,
      topOffset: 60,
    });
  }, []);

  const copyToClipboard = useCallback(async (text: string, options?: CopyOptions) => {
    try {
      await Clipboard.setStringAsync(text);
      showToast({
        type: "success",
        text1: options?.successTitle || "복사 완료",
        text2: options?.successMessage,
      });
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
      showToast({
        type: "error",
        text1: "복사 실패",
        text2: "다시 시도해주세요",
      });
    }
  }, [showToast]);

  return { copyToClipboard, showToast };
}
