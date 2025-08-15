import React from "react";
import { StyleSheet } from "react-native";
import { Dialog, Portal, Button } from "react-native-paper";
import { RFValue } from "react-native-responsive-fontsize";

interface PrayerCreationCancelDialogProps {
  visible: boolean;
  onDismiss: () => void;
  onConfirm: () => void;
  onCancel: () => void;
}

const PrayerCreationCancelDialog = ({
  visible,
  onDismiss,
  onConfirm,
  onCancel,
}: PrayerCreationCancelDialogProps) => {
  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss} style={styles.dialog}>
        <Dialog.Title style={styles.dialogTitle}>
          기도 제목 작성을 취소하시겠습니까?
        </Dialog.Title>
        <Dialog.Actions style={styles.dialogActions}>
          <Button onPress={onCancel} labelStyle={styles.buttonLabel}>
            돌아가기
          </Button>
          <Button onPress={onConfirm} labelStyle={styles.buttonLabel}>
            확인
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

const styles = StyleSheet.create({
  dialog: {
    borderRadius: RFValue(10),
    padding: RFValue(5),
  },
  dialogTitle: {
    fontSize: RFValue(16),
    fontWeight: "bold",
    marginBottom: RFValue(5),
    lineHeight: RFValue(22),
  },
  dialogActions: {
    marginTop: RFValue(10),
    paddingHorizontal: RFValue(10),
  },
  buttonLabel: {
    fontSize: RFValue(14),
    lineHeight: RFValue(20),
  },
});

export default PrayerCreationCancelDialog;
