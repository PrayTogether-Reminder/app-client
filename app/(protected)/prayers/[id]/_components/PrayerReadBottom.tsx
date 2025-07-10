import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Surface, Button } from "react-native-paper";
import { RFValue } from "react-native-responsive-fontsize";
import { color } from "../../../../../src/common/styles/color";
import { useRouter } from "expo-router";
import { useSelectedPrayerTitleStore } from "../../../../../src/domain/prayers/stores/useSelectedPrayerTitleStore";
import { useSelectedRoomStore } from "../../../../../src/domain/rooms/stores/useSelectedRoomStore";
import ConfirmationModal from "@/common/components/modal/ConfirmationModal";

interface PrayerReadBottomProps {
  onPrayerComplete: (params: { prayerTitleId: number; roomId: number }) => void;
  isPending: boolean;
}

function PrayerReadBottom({ onPrayerComplete, isPending }: PrayerReadBottomProps) {
  const router = useRouter();
  const prayerTitleId = useSelectedPrayerTitleStore().selectedPrayerTitle?.id ?? 0;
  const roomId = useSelectedRoomStore().selectedRoom?.id ?? 0;
  const [visible, setVisible] = useState(false);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const handlePress = () => {
    showModal();
  };

  const handleConfirm = () => {
    onPrayerComplete({ prayerTitleId, roomId });
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
          disabled={isPending}
        >
          기도 알림
        </Button>
      </Surface>

      <ConfirmationModal
        visible={visible}
        onDismiss={hideModal}
        onConfirm={handleConfirm}
        icon="bell-ring"
        title="기도 완료 알림"
        content="기도 완료 알림을 전송하시겠습니까?"
        confirmText="확인"
        cancelText="취소"
        iconColor={color.secondary}
      />
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
});

export default PrayerReadBottom;