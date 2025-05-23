// stores/useAlertStore.ts
import { create } from "zustand";
import { AlertStore } from "../types/alertStore";
import type { AlertConfig } from "../types/alertConfig";

export const useAlertStore = create<AlertStore>((set, get) => ({
  isVisible: false,
  config: null,

  // Actions
  showAlert: (config) => {
    set({
      isVisible: true,
      config,
    });
  },

  hideAlert: () => {
    const { config } = get();
    set({ isVisible: false });

    // 애니메이션 완료 후 콜백 실행 및 config 초기화
    setTimeout(() => {
      if (config?.onConfirm) {
        config.onConfirm();
      }
      set({ config: null });
    }, 300);
  },
}));

export const showAlert = (config: AlertConfig) => {
  useAlertStore.getState().showAlert(config);
};
