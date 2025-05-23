export interface AlertConfig {
  title: string;
  message: string;
  icon?: string;
  confirmText?: string;
  iconColor?: string;
  onConfirm?: () => void;
}
