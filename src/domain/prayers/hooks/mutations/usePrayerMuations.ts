import { useMutation, useQueryClient } from "@tanstack/react-query";
import { prayerService } from "../../services/prayerServices";
import { CreatePrayerParams } from "./../../types/params/createPrayerParams";
import { UpdatePrayerParams } from "../../types/params/updatePrayerParams";
import QUERY_KEYS from "@/common/constants/queryKeys";
import { ApiError } from "@/common/apis/api";
import { CreatePrayerCompletionRequest } from "../../types/request/createPrayerCompletionRequest";
import { queryClient } from "@/common/hooks/queries/customQueryClientProvider";
import { showAlert } from "@/common/components/modal/stores/useAlertStore";

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
      showAlert({
        title: "기도 작성 완료",
        message: data.message,
        icon: "check-circle",
      });
    },
    onError: (error: ApiError) => {
      showAlert({
        title: "기도 작성 실패",
        message: error.message,
        icon: "alert-circle",
      });
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
      queryClient.invalidateQueries({
        queryKey: [
          QUERY_KEYS.rooms,
          param.roomId,
          QUERY_KEYS.prayerTitles,
          param.prayerTitleId,
          QUERY_KEYS.prayerContents,
        ],
      });
      showAlert({
        title: "기도 수정 완료",
        message: data.message,
        icon: "check-circle",
      });
    },
    onError: (error: ApiError) => {
      showAlert({
        title: "기도 수정 실패",
        message: error.message,
        icon: "alert-circle",
      });
    },
  });
};

// 기도 완료 알림
export const usePrayerCompletionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ prayerTitleId }: CreatePrayerCompletionRequest) => {
      return prayerService.completePrayer({
        prayerTitleId,
      });
    },
    onError: (error: ApiError, variables, context) => {
      showAlert({
        title: "기도 완료 실패",
        message: error.message,
        icon: "alert-circle",
      });
    },
    onSuccess: (data, variables) => {
      showAlert({
        title: "기도 완료",
        message: data.message,
        icon: "check-circle",
      });
    },
  });
};
