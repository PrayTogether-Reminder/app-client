import { AlertConfig } from "./alertConfig";

export interface AlertState {
  isVisible: boolean;
  config: AlertConfig | null;
}

export interface AlertAction {
  showAlert: (config: AlertConfig) => void;
  hideAlert: () => void;
}

export type AlertStore = AlertState & AlertAction;
