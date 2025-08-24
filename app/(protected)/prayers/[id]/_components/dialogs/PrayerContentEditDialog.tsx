import React, { useState, useEffect } from "react";
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
import { PrayerContent } from "@/domain/prayers/types/prayerContent";

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
  const [editedContent, setEditedContent] = useState(content.content);

  useEffect(() => {
    setEditedContent(content.content);
  }, [content]);

  const handleSave = () => {
    if (!editedContent.trim()) {
      showAlert({
        title: "입력 확인",
        message: "기도 내용을 입력해주세요.",
      });
      return;
    }

    onSave(editedContent);
  };

  const handleCancel = () => {
    setEditedContent(content.content);
    onDismiss();
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={handleCancel}
        contentContainerStyle={styles.modalContainer}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={styles.content}>
            <Text style={styles.title}>기도 내용 수정</Text>

            <View style={styles.fieldset}>
              <Text style={styles.label}>{content.memberName}님의 기도</Text>
              <TextInput
                placeholder="기도 내용을 입력하세요"
                value={editedContent}
                onChangeText={setEditedContent}
                style={styles.inputMultiline}
                mode="outlined"
                multiline
                numberOfLines={8}
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
  );
}

const windowWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: "white",
    width: windowWidth < 600 ? "90%" : "70%",
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
  label: {
    fontSize: RFValue(14),
    marginBottom: RFValue(8),
    fontWeight: "600",
  },
  inputMultiline: {
    width: "100%",
    height: RFValue(150),
    backgroundColor: "white",
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