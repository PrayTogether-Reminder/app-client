import React from "react";
import { Dialog, Portal, Button, TextInput } from "react-native-paper";
import { StyleSheet } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

interface PrayerCustomNameDialogProps {
  visible: boolean;
  onDismiss: () => void;
  customNameRef: React.MutableRefObject<{ customName: string }>; // ref 타입으로 변경
  onChangeText: (text: string) => void;
  onCancel: () => void;
  onAdd: () => void;
}

const PrayerCustomNameDialog = ({
  visible,
  onDismiss,
  customNameRef,
  onChangeText,
  onCancel,
  onAdd,
}: PrayerCustomNameDialogProps) => {
  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss} style={styles.dialog}>
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
    </Portal>
  );
};

const styles = StyleSheet.create({
  dialog: {
    borderRadius: RFValue(10),
    paddingHorizontal: RFValue(5),
    paddingVertical: RFValue(10),
  },
  dialogTitle: {
    fontSize: RFValue(16),
    fontWeight: "bold",
  },
  textInput: {
    fontSize: RFValue(14),
    marginTop: RFValue(5),
  },
  dialogActions: {
    marginTop: RFValue(10),
    paddingHorizontal: RFValue(10),
  },
  buttonLabel: {
    fontSize: RFValue(14),
  },
});

export default PrayerCustomNameDialog;
