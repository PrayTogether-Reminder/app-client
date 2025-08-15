import React from "react";
import { Dialog, Portal, Button, TextInput, Modal } from "react-native-paper";
import { StyleSheet, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

interface PrayerCustomNameDialogProps {
  visible: boolean;
  onDismiss: () => void;
  onChangeText: (text: string) => void;
  onCancel: () => void;
  onAdd: () => void;
}

const PrayerCustomNameDialog = ({
  visible,
  onDismiss,
  onChangeText,
  onCancel,
  onAdd,
}: PrayerCustomNameDialogProps) => {
  return (
    <Portal>
      {/* 방법 1: Modal을 사용하여 커스텀 대화상자 만들기 */}
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={styles.modalContainer}
      >
        <View style={styles.dialog}>
          <View style={styles.titleContainer}>
            <TextInput
              label="기도 대상자 직접 입력"
              mode="outlined"
              style={styles.textInput}
              onChangeText={onChangeText}
            />
          </View>
          <View style={styles.dialogActions}>
            <Button onPress={onCancel} labelStyle={styles.buttonLabel}>
              취소
            </Button>
            <Button onPress={onAdd} labelStyle={styles.buttonLabel}>
              추가
            </Button>
          </View>
        </View>
      </Modal>

      {/* 방법 2: 기존 Dialog 사용 (위치 조정은 제한적) */}
      {/* 
      <Dialog visible={visible} onDismiss={onDismiss} style={styles.dialogStyle}>
        <Dialog.Title style={styles.dialogTitle}>
          기도 대상자 직접 입력
        </Dialog.Title>
        <Dialog.Content>
          <TextInput
            label="이름"
            onChangeText={onChangeText}
            mode="outlined"
            style={styles.textInput}
          />
        </Dialog.Content>
        <Dialog.Actions style={styles.dialogActions}>
          <Button onPress={onCancel} labelStyle={styles.buttonLabel}>
            취소
          </Button>
          <Button onPress={onAdd} labelStyle={styles.buttonLabel}>
            추가
          </Button>
        </Dialog.Actions>
      </Dialog>
      */}
    </Portal>
  );
};

const styles = StyleSheet.create({
  // Modal 스타일 (방법 1)
  modalContainer: {
    position: "absolute",
    top: "20%", // 화면 상단에서 20% 위치에 표시
    left: 20,
    right: 20,
    backgroundColor: "white",
    borderRadius: RFValue(10),
    padding: RFValue(16),
  },
  dialog: {
    width: "100%",
  },
  titleContainer: {
    marginBottom: RFValue(16),
  },

  // Dialog 스타일 (방법 2)
  dialogStyle: {
    // Dialog의 내부 스타일만 조정 가능
    // 위치 조정은 불가능
    borderRadius: RFValue(10),
    marginTop: -RFValue(100), // 이 방법으로는 정확한 위치 조정이 어려움
  },
  dialogTitle: {
    fontSize: RFValue(16),
    fontWeight: "bold",
    lineHeight: RFValue(22),
  },
  textInput: {
    fontSize: RFValue(14),
    marginTop: RFValue(5),
  },
  dialogActions: {
    marginTop: RFValue(10),
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  buttonLabel: {
    fontSize: RFValue(14),
    lineHeight: RFValue(20),
  },
});

export default PrayerCustomNameDialog;
