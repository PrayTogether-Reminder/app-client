import { useMutation, useQueryClient } from "@tanstack/react-query";
import { prayerService } from "../../services/prayerServices";
import { Alert } from "react-native";
import { CreatePrayerParams } from "./../../types/params/createPrayerParams";
import { UpdatePrayerParams } from "../../types/params/updatePrayerParams";
import QUERY_KEYS from "@/common/constants/queryKeys";

// 기도(제목+내용) 작성
export const usePrayerCreationMutation = () => {
  return useMutation({
    mutationFn: ({ title, prayerList }: CreatePrayerParams) =>
      prayerService.create(title, prayerList),
    onSuccess: (data) => {
      Alert.alert(data.message);
      // 여기에 성공 시 추가 작업 (예: 캐시 무효화, 알림 표시 등)을 추가할 수 있습니다.
    },
    onError: (error) => {
      Alert.alert(error.message);
    },
  });
};

// 기도(제목+내용) 수정
export const usePrayerUpdateMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      roomId,
      prayerTitleId,
      title,
      prayerList,
    }: UpdatePrayerParams) =>
      prayerService.update(prayerTitleId, title, prayerList),
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
