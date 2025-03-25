import React, { useState } from "react";
import { StyleSheet, View, Text, Dimensions } from "react-native";
import { Surface, Button, Portal, Modal, IconButton } from "react-native-paper";
import { RFValue } from "react-native-responsive-fontsize";
import { color } from "../../../common/styles/color";
import { useRouter } from "expo-router";
import { usePrayerNotificationMutation } from "../hooks/mutations/usePrayerNotificationMutations";
import { useSelectedPrayerTitleStore } from "../../prayers/stores/useSelectedPrayerTitleStore";
import { useSelectedRoomStore } from "../../rooms/stores/useSelectedRoomStore";
import { NOTIFICATION_TYPE } from "../constants/notificationType";

const { width } = Dimensions.get("window");

function PrayerReadBottom() {
  const router = useRouter();
  const prayerTitleId =
    useSelectedPrayerTitleStore().selectedPrayerTitle?.id ?? null;
  const roomId = useSelectedRoomStore().selectedRoom?.id ?? null;
  const [visible, setVisible] = useState(false);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const { mutate: nofityPrayerCompletion } = usePrayerNotificationMutation();

  const handlePress = () => {
    showModal();
  };

  const handleConfirm = () => {
    nofityPrayerCompletion({
      prayerTitleId,
      roomId,
      type: NOTIFICATION_TYPE.PRAYER_COMPLETION,
    });
    hideModal();
  };

  return (
    <>
      <Surface style={styles.bottomButtonContainer}>
        <Button
          mode="contained"
          uppercase={false}
          style={styles.bottomButton}
          labelStyle={styles.bottomButtonText}
          icon="bell"
          onPress={handlePress}
        >
          기도 알림
        </Button>
      </Surface>

      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={styles.modalContainer}
        >
          <View style={styles.modalHeader}>
            <IconButton
              icon="close"
              size={RFValue(20)}
              onPress={hideModal}
              style={styles.closeButton}
            />
          </View>

          <View style={styles.modalContent}>
            <View style={styles.titleContainer}>
              <IconButton
                icon="bell-ring"
                size={RFValue(24)}
                iconColor={color.secondary}
                style={styles.titleIcon}
              />
              <Text style={styles.modalTitle}>기도 완료 알림</Text>
            </View>
            <Text style={styles.modalText}>
              기도 완료 알림을 전송하시겠습니까?
            </Text>
          </View>

          <View style={styles.modalActions}>
            <Button
              mode="outlined"
              onPress={hideModal}
              style={styles.cancelButton}
              labelStyle={styles.cancelButtonLabel}
              contentStyle={styles.buttonContent}
            >
              취소
            </Button>
            <Button
              mode="contained"
              onPress={handleConfirm}
              style={styles.confirmButton}
              labelStyle={styles.confirmButtonLabel}
              contentStyle={styles.buttonContent}
            >
              확인
            </Button>
          </View>
        </Modal>
      </Portal>
    </>
  );
}

const styles = StyleSheet.create({
  bottomButtonContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    elevation: 0,
    backgroundColor: "transparent",
  },
  bottomButton: {
    borderRadius: 30,
    width: "70%",
    paddingVertical: 5,
    backgroundColor: color.secondary,
    elevation: 4,
  },
  bottomButtonText: {
    fontSize: RFValue(16),
    fontWeight: "500",
  },
  modalContainer: {
    backgroundColor: "white",
    borderRadius: 16,
    width: width * 0.85,
    alignSelf: "center",
    overflow: "hidden",
    elevation: 5,
  },
  modalHeader: {
    alignItems: "flex-end",
    paddingTop: 8,
    paddingRight: 8,
  },
  closeButton: {
    margin: 0,
    backgroundColor: "rgba(0, 0, 0, 0.03)",
  },
  modalContent: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    alignItems: "center",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
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
    marginLeft: 4,
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
    paddingHorizontal: 16,
    paddingBottom: 20,
    paddingTop: 8,
  },
  buttonContent: {
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  cancelButton: {
    flex: 1,
    marginRight: 8,
    borderRadius: 12,
    borderColor: "#ddd",
    borderWidth: 1.5,
  },
  confirmButton: {
    flex: 1,
    marginLeft: 8,
    borderRadius: 12,
    backgroundColor: color.secondary,
    elevation: 2,
  },
  cancelButtonLabel: {
    fontSize: RFValue(15),
    color: "#666",
    fontWeight: "600",
  },
  confirmButtonLabel: {
    fontSize: RFValue(15),
    color: "white",
    fontWeight: "600",
  },
});

export default PrayerReadBottom;
