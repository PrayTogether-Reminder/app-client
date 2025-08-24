import React, { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
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
  const [editedTitle, setEditedTitle] = useState(title);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const originalTitle = useRef(title);

  useEffect(() => {
    if (visible) {
      setEditedTitle(title);
      originalTitle.current = title;
    }
  }, [title, visible]);


  const handleSave = () => {
    if (!editedTitle.trim()) {
      showAlert({
        title: "입력 확인",
        message: "기도 제목을 입력해주세요.",
      });
      return;
    }

    onSave(editedTitle.trim());
    onDismiss();
  };

  const handleCancel = () => {
    // 항상 확인 팝업 표시
    setShowCancelConfirm(true);
  };

  const confirmCancel = () => {
    setEditedTitle(title);
    setShowCancelConfirm(false);
    onDismiss();
  };

  const cancelCancel = () => {
    setShowCancelConfirm(false);
  };

  return (
    <>
    <Portal>
      <Modal
        visible={visible}
        onDismiss={() => {
          console.log('Modal onDismiss called');
          handleCancel();
        }}
        dismissable={true}
        dismissableBackButton={true}
        contentContainerStyle={styles.modalContainer}
        style={styles.modal}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={styles.content}>
            <Text style={styles.title}>기도 제목 수정</Text>

            <View style={styles.fieldset}>
              <TextInput
                placeholder="기도 제목을 입력하세요"
                value={editedTitle}
                onChangeText={setEditedTitle}
                style={styles.input}
                mode="outlined"
                autoFocus
              />
            </View>

            <View style={styles.buttonContainer}>
              <Button
                mode="outlined"
                onPress={handleCancel}
                style={styles.cancelButton}
                labelStyle={styles.buttonLabel}
              >
                취소
              </Button>
              <Button
                mode="contained"
                onPress={handleSave}
                style={styles.saveButton}
                labelStyle={styles.buttonLabel}
              >
                저장
              </Button>
            </View>

            <IconButton
              icon={() => <Feather name="x" size={RFValue(24)} color="black" />}
              onPress={handleCancel}
              style={styles.closeButton}
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

const windowWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  modal: {
    justifyContent: "flex-start",
    paddingTop: RFValue(100),
  },
  modalContainer: {
    backgroundColor: "white",
    width: windowWidth < 600 ? "85%" : "70%",
    alignSelf: "center",
    borderRadius: RFValue(8),
    padding: RFValue(16),
    elevation: 5,
  },
  content: {
    gap: RFValue(16),
    position: "relative",
  },
  title: {
    fontSize: RFValue(18),
    fontWeight: "bold",
    marginBottom: RFValue(8),
  },
  fieldset: {
    marginVertical: RFValue(4),
  },
  input: {
    width: "100%",
    backgroundColor: "white",
    fontSize: RFValue(16),
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: RFValue(12),
    marginTop: RFValue(8),
    marginBottom: RFValue(16),
  },
  cancelButton: {
    width: windowWidth < 400 ? "35%" : "30%",
  },
  saveButton: {
    width: windowWidth < 400 ? "35%" : "30%",
  },
  buttonLabel: {
    fontSize: RFValue(16),
  },
  closeButton: {
    position: "absolute",
    top: 0,
    right: 0,
  },
});