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
