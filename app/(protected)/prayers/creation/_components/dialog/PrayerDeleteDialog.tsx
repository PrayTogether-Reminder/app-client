import React from "react";
import { StyleSheet } from "react-native";
import { Button, Dialog, Portal, Text } from "react-native-paper";
import { RFValue } from "react-native-responsive-fontsize";
import { color } from "../../../../../../src/common/styles/color";

interface PrayerDeleteDialogProps {
  visible: boolean;
  onDismiss: () => void;
  onConfirm: () => void;
  memberName: string | undefined;
}

/**
 * 기도문 삭제 확인 다이얼로그 컴포넌트
 */
const PrayerDeleteDialog = ({
  visible,
  onDismiss,
  onConfirm,
  memberName,
}: PrayerDeleteDialogProps) => {
  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss} style={styles.dialog}>
        <Dialog.Title style={styles.dialogTitle}>삭제 확인</Dialog.Title>
        <Dialog.Content>
          <Text style={styles.dialogContent}>
            {memberName}님 기도문을 삭제 하시겠습니까?
          </Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onDismiss} textColor={color.secondary}>
            취소
          </Button>
          <Button onPress={onConfirm} textColor={color.red}>
            삭제
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

const styles = StyleSheet.create({
  dialog: {
    borderRadius: RFValue(16),
  },
  dialogTitle: {
    fontSize: RFValue(28),
    fontWeight: "bold",
    lineHeight: RFValue(36),
  },
  dialogContent: {
    fontSize: RFValue(16),
    lineHeight: RFValue(22),
  },
});

export default PrayerDeleteDialog;
