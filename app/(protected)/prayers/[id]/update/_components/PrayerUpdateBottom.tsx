import React from "react";
import { StyleSheet } from "react-native";
import { Surface, Button, useTheme } from "react-native-paper";
import { RFValue } from "react-native-responsive-fontsize";
import { color } from "../../../../../../src/common/styles/color";
import { useRouter } from "expo-router";
import path from "../../../../../../src/common/constants/path";
import { usePrayerUpdateMutation } from "@/domain/prayers/hooks/mutations/usePrayerMuations";
import { usePrayerUpdateStore } from "../../../../../../src/domain/prayers/stores/usePrayerUpdateStore";
import { useSelectedRoomStore } from "../../../../../../src/domain/rooms/stores/useSelectedRoomStore";
import { useQueryClient } from "@tanstack/react-query";
import QUERY_KEYS from "../../../../../../src/common/constants/queryKeys";
import { useSelectedPrayerTitleStore } from "../../../../../../src/domain/prayers/stores/useSelectedPrayerTitleStore";

interface PrayerUpdateBottomProps {
  title: string;
  disabled: boolean;
}

const PrayerUpdateBottom: React.FC<PrayerUpdateBottomProps> = ({
  title,
  disabled,
}) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutate: UpdatePrayerMutation } = usePrayerUpdateMutation();
  const { prayerList, clear: clearPrayers } = usePrayerUpdateStore();
  const roomId = useSelectedRoomStore().selectedRoom?.id ?? null;
  const prayerTitleId =
    useSelectedPrayerTitleStore().selectedPrayerTitle?.id ?? null;

  // 기도 내용 전체 변경(API 요청)
  const UpdatePrayer = () => {
    UpdatePrayerMutation(
      { roomId, prayerTitleId, title, prayerList },
      {
        onSuccess: () => {
          console.log("prayer title cache clear");
          clearPrayers();
          router.back();
        },
      }
    );
  };

  return (
    <Surface style={styles.container}>
      <Button
        mode="contained"
        uppercase={false}
        style={[styles.button, disabled && styles.button_disabled]}
        labelStyle={styles.buttonText}
        icon="content-save-all"
        onPress={UpdatePrayer}
        disabled={disabled}
      >
        모두 저장하기
      </Button>
    </Surface>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    borderRadius: 30,
    width: "70%",
    paddingVertical: 5,
    backgroundColor: color.secondary,
  },
  button_disabled: {
    backgroundColor: color.gray,
  },
  buttonText: {
    fontSize: RFValue(16),
    fontWeight: "500",
    color: color.white,
  },
});

export default PrayerUpdateBottom;
