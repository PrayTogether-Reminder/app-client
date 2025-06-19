import React from "react";
import { useAlertStore } from "@/common/components/modal/stores/useAlertStore";
import { AlertModal } from "@/common/components/modal/AlertModal";

export function GlobalAlertModal() {
  const { isVisible, config, hideAlert } = useAlertStore();

  if (!config) return null;

  return (
    <AlertModal
      visible={isVisible}
      onDismiss={hideAlert}
      icon={config.icon}
      title={config.title}
      content={config.message}
      confirmText={config.confirmText}
      iconColor={config.iconColor}
    />
  );
}
