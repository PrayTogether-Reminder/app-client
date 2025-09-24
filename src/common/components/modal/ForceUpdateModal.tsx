import React from "react";
import { AlertModal } from "./AlertModal";
import { UPDATE_MESSAGES } from "@/constants/updateMessages";

interface ForceUpdateModalProps {
  visible: boolean;
  onAction: () => void;  // 스토어로 이동
  iconColor: string;
}

export function ForceUpdateModal({
  visible,
  onAction,
  iconColor
}: ForceUpdateModalProps) {
  return (
    <AlertModal
      visible={visible}
      onDismiss={onAction}  // X나 뒤로가기도 스토어로
      onConfirm={onAction}  // 확인 버튼도 스토어로
      icon="alert-circle"
      title={UPDATE_MESSAGES.FORCE_UPDATE_TITLE}
      content={UPDATE_MESSAGES.FORCE_UPDATE_MESSAGE}
      confirmText={UPDATE_MESSAGES.BUTTON_UPDATE}
      iconColor={iconColor}
    />
  );
}