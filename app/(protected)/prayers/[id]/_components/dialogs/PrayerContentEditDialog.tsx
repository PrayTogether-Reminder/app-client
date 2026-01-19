import React, { useEffect, useCallback } from "react";
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
import { PrayerContent } from "@/domain/prayers/types/prayerContent";
import ConfirmationModal from "@/common/components/modal/ConfirmationModal";
import { dialogStyles } from "@/styles/dialogStyles";
import { useDialogWithConfirmation } from "@/hooks/useDialogWithConfirmation";
import { useKoreanInput } from "@/hooks/useKoreanInput";

interface PrayerContentEditDialogProps {
  visible: boolean;
  onDismiss: () => void;
  content: PrayerContent;
  onSave: (content: string) => void;
}

export default function PrayerContentEditDialog({
  visible,
  onDismiss,
  content,
  onSave,
}: PrayerContentEditDialogProps) {
  const {
    textInputRef,
    handleChange,
    getValue,
    setValue,
  } = useKoreanInput({ initialValue: content.content, visible });

  const {
    showCancelConfirm,
    handleCancel,
    confirmCancel,
    cancelCancel,
  } = useDialogWithConfirmation({
    onDismiss,
    checkDirty: () => getValue() !== content.content,
    onConfirmCancel: () => setValue(content.content),
  });

  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        if (textInputRef.current) {
          const input = textInputRef.current as any;
          input?.focus?.();
          input?.setNativeProps?.({ 
            selection: { start: 0, end: 0 },
            scrollEnabled: true
          });
          input?.scrollTo?.({ y: 0, animated: false });
        }
      }, 150);
      
      return () => clearTimeout(timer);
    }
  }, [visible]);

  const handleSave = useCallback(() => {
    const trimmedValue = getValue().trim();
    if (!trimmedValue) {
      showAlert({
        title: "입력 확인",
        message: "기도문을 입력해주세요.",
      });
      return;
    }

    onSave(getValue());
  }, [getValue, onSave]);

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
            <Text style={dialogStyles.title}>기도문 수정</Text>

            <View style={dialogStyles.fieldset}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: RFValue(8) }}>
                <Text style={dialogStyles.label}>{content.memberName}님의 기도</Text>
                <Text style={{ fontSize: RFValue(12), color: '#666' }}>최근 작성자: {content.writerName}</Text>
              </View>
              <TextInput
                ref={textInputRef}
                placeholder="기도문을 입력하세요"
                defaultValue={content.content}
                onChangeText={handleChange}
                style={dialogStyles.inputMultiline}
                mode="outlined"
                multiline
                numberOfLines={8}
                scrollEnabled={true}
                textAlignVertical="top"
                autoFocus={false}
                accessibilityLabel="기도문 입력"
                accessibilityHint="수정할 기도문을 입력하세요"
              />
            </View>

            <View style={dialogStyles.buttonContainer}>
              <Button
                mode="outlined"
                onPress={handleCancel}
                style={dialogStyles.cancelButton}
                labelStyle={dialogStyles.buttonLabel}
              >
                취소
              </Button>
              <Button
                mode="contained"
                onPress={handleSave}
                style={dialogStyles.saveButton}
                labelStyle={dialogStyles.buttonLabel}
              >
                저장
              </Button>
            </View>

            <IconButton
              icon={() => <Feather name="x" size={RFValue(24)} color="black" />}
              onPress={handleCancel}
              style={dialogStyles.closeButton}
              size={24}
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