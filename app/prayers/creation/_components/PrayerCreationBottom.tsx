import React from "react";
import { StyleSheet } from "react-native";
import { Surface, Button, useTheme } from "react-native-paper";
import { RFValue } from "react-native-responsive-fontsize";
import { color } from "../../../../src/common/styles/color";
import { useRouter } from "expo-router";
import path from "../../../../src/common/constants/path";
import { usePrayerCreationMutation } from "@/domain/prayers/hooks/mutations/usePrayerMuations";
import { usePrayerCreationStore } from "@/domain/prayers/stores/usePrayerCreationStore";
import { useSelectedRoomStore } from "../../../../src/domain/rooms/stores/useSelectedRoomStore";
import { useQueryClient } from "@tanstack/react-query";
import QUERY_KEYS from "../../../../src/common/constants/queryKeys";

interface PrayerCreationBottomProps {
  roomId: number;
  title: string;
  disabled: boolean;
}

const PrayerCreationBottom: React.FC<PrayerCreationBottomProps> = ({
  roomId,
  title,
  disabled,
}) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutate: createPrayerMutation } = usePrayerCreationMutation();
  const { prayerList, clear: clearPrayers } = usePrayerCreationStore();
  const room = useSelectedRoomStore().selectedRoom;

  // 기도 내용 전체 저장(API 요청)
  const createPrayer = () => {
    createPrayerMutation(
      { roomId, title, prayerList },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            // 기도 제목 무한 스크롤 캐시 초기화
            queryKey: [QUERY_KEYS.rooms, room?.id, QUERY_KEYS.infinite],
          });
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
        onPress={createPrayer}
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

export default PrayerCreationBottom;
