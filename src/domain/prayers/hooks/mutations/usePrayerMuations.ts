import { useMutation, useQueryClient } from "@tanstack/react-query";
import { prayerService } from "../../services/prayerServices";
import { Alert } from "react-native";
import { CreatePrayerParams } from "./../../types/params/createPrayerParams";
import { UpdatePrayerParams } from "../../types/params/updatePrayerParams";
import QUERY_KEYS from "@/common/constants/queryKeys";
import { ApiError } from "@/common/apis/api";
import { CreatePrayerCompletionRequest } from "../../types/request/createPrayerCompletionRequest";
import { queryClient } from "@/common/hooks/queries/customQueryClientProvider";

// 기도(제목+내용) 작성
export const usePrayerCreationMutation = () => {
  return useMutation({
    mutationFn: ({ roomId, title, prayerList }: CreatePrayerParams) =>
      prayerService.create(roomId, title, prayerList),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [
          QUERY_KEYS.rooms,
          variables.roomId,
          QUERY_KEYS.prayerTitles,
          QUERY_KEYS.infinite,
        ],
      });
      Alert.alert(data.message);
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

// 기도 완료 알림
export const usePrayerCompletionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ roomId }: CreatePrayerCompletionRequest) => {
      return prayerService.completePrayer({
        roomId,
      });
    },
    onError: (error: ApiError, variables, context) => {
      Alert.alert(error.message);
    },
    onSuccess: (data, variables) => {
      Alert.alert(data.message);
    },
  });
};
