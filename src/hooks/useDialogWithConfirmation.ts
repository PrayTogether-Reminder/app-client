import { useState, useCallback } from "react";

interface UseDialogWithConfirmationProps {
  onDismiss: () => void;
  checkDirty?: () => boolean;
  onConfirmCancel?: () => void;
}

interface UseDialogWithConfirmationReturn {
  showCancelConfirm: boolean;
  handleCancel: () => void;
  confirmCancel: () => void;
  cancelCancel: () => void;
}

export function useDialogWithConfirmation({
  onDismiss,
  checkDirty,
  onConfirmCancel,
}: UseDialogWithConfirmationProps): UseDialogWithConfirmationReturn {
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const handleCancel = useCallback(() => {
    // 변경사항이 있는지 체크
    const isDirty = checkDirty ? checkDirty() : false;
    
    if (isDirty) {
      setShowCancelConfirm(true);
    } else {
      onDismiss();
    }
  }, [checkDirty, onDismiss]);

  const confirmCancel = useCallback(() => {
    // 추가 정리 작업이 있다면 실행
    if (onConfirmCancel) {
      onConfirmCancel();
    }
    
    setShowCancelConfirm(false);
    onDismiss();
  }, [onConfirmCancel, onDismiss]);

  const cancelCancel = useCallback(() => {
    setShowCancelConfirm(false);
  }, []);

  return {
    showCancelConfirm,
    handleCancel,
    confirmCancel,
    cancelCancel,
  };
}