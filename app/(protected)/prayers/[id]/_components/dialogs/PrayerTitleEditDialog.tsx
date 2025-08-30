import React, { useCallback } from "react";
import {
  View,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import {
  Portal,
  Modal,
  Text,
  TextInput,
  Button,
  IconButton,
} from "react-native-paper";
import { RFValue } from "react-native-responsive-fontsize";
import Feather from "@expo/vector-icons/Feather";
import { showAlert } from "@/common/components/modal/stores/useAlertStore";
import ConfirmationModal from "@/common/components/modal/ConfirmationModal";
import { dialogStyles } from "@/styles/dialogStyles";
import { useDialogWithConfirmation } from "@/hooks/useDialogWithConfirmation";
import { useKoreanInput } from "@/hooks/useKoreanInput";

interface PrayerTitleEditDialogProps {
  visible: boolean;
  onDismiss: () => void;
  title: string;
  onSave: (title: string) => void;
}

export default function PrayerTitleEditDialog({
  visible,
  onDismiss,
  title,
  onSave,
}: PrayerTitleEditDialogProps) {
  const {
    textInputRef,
    handleChange,
    getValue,
    setValue,
  } = useKoreanInput({ initialValue: title, visible });

  const {
    showCancelConfirm,
    handleCancel,
    confirmCancel,
    cancelCancel,
  } = useDialogWithConfirmation({
    onDismiss,
    checkDirty: () => getValue() !== title,
    onConfirmCancel: () => setValue(title),
  });


  const handleSave = useCallback(() => {
    const trimmedValue = getValue().trim();
    if (!trimmedValue) {
      showAlert({
        title: "입력 확인",
        message: "기도 제목을 입력해주세요.",
      });
      return;
    }

    onSave(trimmedValue);
    onDismiss();
  }, [getValue, onSave, onDismiss]);

  return (
    <>
    <Portal>
      <Modal
        visible={visible}
        onDismiss={handleCancel}
        dismissable={false}
        dismissableBackButton={true}
        contentContainerStyle={dialogStyles.modalContainer}
        style={dialogStyles.modal}
      >
        <TouchableWithoutFeedback 
          onPress={Keyboard.dismiss}
          accessible={true}
          accessibilityRole="none"
          accessibilityLabel="다이얼로그 배경">
          <View style={dialogStyles.content}>
            <Text style={dialogStyles.title}>기도 제목 수정</Text>

            <View style={dialogStyles.fieldset}>
              <TextInput
                ref={textInputRef}
                placeholder="기도 제목을 입력하세요"
                defaultValue={title}
                onChangeText={handleChange}
                style={dialogStyles.input}
                mode="outlined"
                autoFocus
                accessibilityLabel="기도 제목 입력"
                accessibilityHint="수정할 기도 제목을 입력하세요"
              />
            </View>

            <View style={dialogStyles.buttonContainer}>
              <Button
                mode="outlined"
                onPress={handleCancel}
                style={dialogStyles.cancelButton}
                labelStyle={dialogStyles.buttonLabel}
                accessibilityLabel="취소 버튼"
                accessibilityHint="변경 사항을 취소하고 대화상자를 닫습니다"
              >
                취소
              </Button>
              <Button
                mode="contained"
                onPress={handleSave}
                style={dialogStyles.saveButton}
                labelStyle={dialogStyles.buttonLabel}
                accessibilityLabel="저장 버튼"
                accessibilityHint="변경 사항을 저장합니다"
              >
                저장
              </Button>
            </View>

            <IconButton
              icon={() => <Feather name="x" size={RFValue(24)} color="black" />}
              onPress={handleCancel}
              style={dialogStyles.closeButton}
              size={24}
              accessibilityLabel="닫기 버튼"
              accessibilityHint="대화상자를 닫습니다"
            />
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </Portal>

    {/* 변경 취소 확인 모달 */}
    <ConfirmationModal
      visible={showCancelConfirm}
      onDismiss={cancelCancel}
      onConfirm={confirmCancel}
      icon="alert-circle"
      title="변경 취소"
      content="수정한 내용이 저장되지 않습니다. 취소하시겠습니까?"
      confirmText="취소"
      cancelText="계속 수정"
    />
    </>
  );
}