import React from "react";
import { StyleSheet, View, Text, Dimensions } from "react-native";
import { Button, Portal, Modal, IconButton } from "react-native-paper";
import { RFValue } from "react-native-responsive-fontsize";
import { color } from "@/common/styles/color";

const { width } = Dimensions.get("window");

interface ConfirmationModalProps {
  visible: boolean;
  onDismiss: () => void;
  onConfirm: () => void;
  icon?: string;
  title: string;
  content: string;
  confirmText?: string;
  cancelText?: string;
  iconColor?: string;
}

function ConfirmationModal({
  visible,
  onDismiss,
  onConfirm,
  icon = "bell-ring",
  title,
  content,
  confirmText = "확인",
  cancelText = "취소",
  iconColor = color.secondary,
}: ConfirmationModalProps) {
  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={styles.modalContainer}
      >
        <View style={styles.modalHeader}>
          <IconButton
            icon="close"
            size={RFValue(20)}
            onPress={onDismiss}
            style={styles.closeButton}
          />
        </View>

        <View style={styles.modalContent}>
          <View style={styles.titleContainer}>
            <IconButton
              icon={icon}
              size={RFValue(24)}
              iconColor={iconColor}
              style={styles.titleIcon}
            />
            <Text style={styles.modalTitle}>{title}</Text>
          </View>
          <Text style={styles.modalText}>{content}</Text>
        </View>

        <View style={styles.modalActions}>
          <Button
            mode="outlined"
            onPress={onDismiss}
            style={styles.cancelButton}
            labelStyle={styles.cancelButtonLabel}
            contentStyle={styles.buttonContent}
          >
            {cancelText}
          </Button>
          <Button
            mode="contained"
            onPress={onConfirm}
            style={styles.confirmButton}
            labelStyle={styles.confirmButtonLabel}
            contentStyle={styles.buttonContent}
          >
            {confirmText}
          </Button>
        </View>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: "white",
    borderRadius: RFValue(16),
    width: width * 0.85,
    alignSelf: "center",
    overflow: "hidden",
    elevation: 5,
  },
  modalHeader: {
    alignItems: "flex-end",
    paddingTop: RFValue(8),
    paddingRight: RFValue(8),
  },
  closeButton: {
    margin: 0,
    backgroundColor: "rgba(0, 0, 0, 0.03)",
  },
  modalContent: {
    paddingHorizontal: RFValue(24),
    paddingBottom: RFValue(24),
    alignItems: "center",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: RFValue(12),
    paddingRight: RFValue(16),
  },
  titleIcon: {
    margin: 0,
    backgroundColor: "transparent",
  },
  modalTitle: {
    fontSize: RFValue(20),
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginLeft: RFValue(4),
  },
  modalText: {
    fontSize: RFValue(16),
    color: "#555",
    textAlign: "center",
    lineHeight: RFValue(22),
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: RFValue(16),
    paddingBottom: RFValue(20),
  },
  buttonContent: {
    paddingVertical: RFValue(4),
  },
  cancelButton: {
    flex: 1,
    marginRight: RFValue(8),
    borderRadius: RFValue(12),
    borderColor: "#ddd",
    borderWidth: RFValue(1.5),
  },
  confirmButton: {
    flex: 1,
    marginLeft: RFValue(8),
    borderRadius: RFValue(12),
    backgroundColor: color.secondary,
    elevation: 2,
  },
  cancelButtonLabel: {
    fontSize: RFValue(18),
    color: "#666",
    fontWeight: "600",
  },
  confirmButtonLabel: {
    fontSize: RFValue(18),
    color: "white",
    fontWeight: "600",
  },
});

export default ConfirmationModal;
