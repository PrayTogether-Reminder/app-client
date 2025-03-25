import { useMutation } from "@tanstack/react-query";
import { Alert } from "react-native";
import prayerUpdateService from "../../services/prayerUpdateService";
import type { PrayerUpdateItem } from "../../types/prayerUpdateItem";
import { useQueryClient } from "@tanstack/react-query";
import QUERY_KEYS from "../../../../common/constants/queryKeys";

interface usePrayerUpdateParams {
  roomId: number | null;
  prayerTitleId: number | null;
  title: string;
  prayerList: PrayerUpdateItem[];
}

export const usePrayerUpdateMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      roomId,
      prayerTitleId,
      title,
      prayerList,
    }: usePrayerUpdateParams) =>
      prayerUpdateService.createPrayers(prayerTitleId, title, prayerList),
    onSuccess: (data, param) => {
      Alert.alert(data.message);
      queryClient.invalidateQueries({
        queryKey: [
          QUERY_KEYS.rooms,
          param.roomId,
          QUERY_KEYS.prayerTitles,
          param.prayerTitleId,
          QUERY_KEYS.prayerContents,
        ],
      });
    },
    onError: (error) => {
      Alert.alert(error.message);
    },
  });
};
