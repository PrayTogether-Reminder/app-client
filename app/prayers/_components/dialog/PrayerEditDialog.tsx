import React from "react";
import { StyleSheet } from "react-native";
import { Button, Dialog, Portal, Text } from "react-native-paper";
import { RFValue } from "react-native-responsive-fontsize";
import { color } from "../../../../src/common/styles/color";

interface PrayerEditDialogProps {
  visible: boolean;
  onDismiss: () => void;
  onConfirm: () => void;
  memberName: string | undefined;
}

/**
 * 기도문 편집 확인 다이얼로그 컴포넌트
 */
const PrayerEditDialog = ({
  visible,
  onDismiss,
  onConfirm,
  memberName,
}: PrayerEditDialogProps) => {
  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss} style={styles.dialog}>
        <Dialog.Title style={styles.dialogTitle}>기도문 변경</Dialog.Title>
        <Dialog.Content>
          <Text style={styles.dialogContent}>
            {memberName}님의 기도문을 변경하시겠습니까?
          </Text>
          <Text style={styles.dialogSubContent}>
            현재 작성중인 기도문은 지워집니다.
          </Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onDismiss} textColor={color.black}>
            취소
          </Button>
          <Button onPress={onConfirm} textColor={color.secondary}>
            확인
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
  },
  dialogContent: {
    fontSize: RFValue(16),
  },
  dialogSubContent: {
    fontSize: RFValue(13),
    fontWeight: "bold",
    color: color.secondary,
    marginTop: RFValue(4),
    textDecorationLine: "underline",
  },
});

export default PrayerEditDialog;
