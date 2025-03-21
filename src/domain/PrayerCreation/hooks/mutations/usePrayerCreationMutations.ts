import { useMutation, UseMutationResult } from "@tanstack/react-query";
import prayerCreationService from "../../services/prayerCreationService";
import type { PrayerCreationItem } from "../../types/PrayerCreationItem";
import { Alert } from "react-native";

interface usePrayerCreationParams {
  title: string;
  prayerList: PrayerCreationItem[];
}

export const usePrayerCreationMutation = () => {
  return useMutation({
    mutationFn: ({ title, prayerList }: usePrayerCreationParams) =>
      prayerCreationService.createPrayers(title, prayerList),
    onSuccess: (data) => {
      Alert.alert(data.message);
      // 여기에 성공 시 추가 작업 (예: 캐시 무효화, 알림 표시 등)을 추가할 수 있습니다.
    },
    onError: (error) => {
      Alert.alert(error.message);
    },
  });
};
