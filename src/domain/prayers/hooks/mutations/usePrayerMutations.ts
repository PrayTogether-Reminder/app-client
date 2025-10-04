import { useMutation, useQueryClient } from "@tanstack/react-query";
import { prayerService } from "../../services/prayerServices";
import { CreatePrayerParams } from "./../../types/params/createPrayerParams";
import { CreatePrayerTitleParams } from "./../../types/params/createPrayerTitleParams";
import QUERY_KEYS from "@/common/constants/queryKeys";
import { ApiError } from "@/common/apis/api";
import { CreatePrayerCompletionRequest } from "../../types/request/createPrayerCompletionRequest";
import { queryClient } from "@/common/hooks/queries/customQueryClientProvider";
import { showAlert } from "@/common/components/modal/stores/useAlertStore";

// 기도 제목만 생성
export const useCreatePrayerTitleMutation = () => {
  return useMutation({
    mutationFn: ({ roomId, title }: CreatePrayerTitleParams) =>
      prayerService.createTitle(roomId, title),
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
        title: "기도 제목 생성",
        message: "기도 제목이 생성되었습니다.",
        icon: "check-circle",
      });
    },
    onError: (error: ApiError) => {
      showAlert({
        title: "기도 제목 생성 실패",
        message: error.message,
        icon: "alert-circle",
      });
    },
  });
};

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


// 기도 제목만 수정
export const useUpdatePrayerTitleMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ prayerTitleId, title }: { prayerTitleId: number; title: string }) =>
      prayerService.updateTitle(prayerTitleId, title),
    onSuccess: (data, variables) => {
      // 기도방 목록과 기도 제목 관련 캐시 무효화
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.rooms],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.prayerTitles],
      });
      showAlert({
        title: "기도 제목 수정",
        message: "기도 제목이 수정되었습니다.",
        icon: "check-circle",
      });
    },
    onError: (error: ApiError) => {
      showAlert({
        title: "기도 제목 수정 실패",
        message: error.message,
        icon: "alert-circle",
      });
    },
  });
};

// 기도 내용 추가
export const useCreatePrayerContentMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ prayerTitleId, memberName, content, memberId }: { prayerTitleId: number; memberName: string; content: string; memberId?: number | null }) =>
      prayerService.createContent(prayerTitleId, memberName, content, memberId),
    onSuccess: (data, variables) => {
      // 기도 내용 관련 캐시 무효화
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.rooms],
      });
      showAlert({
        title: "기도 내용 추가",
        message: "기도 내용이 추가되었습니다.",
        icon: "check-circle",
      });
    },
    onError: (error: ApiError) => {
      showAlert({
        title: "기도 내용 추가 실패",
        message: error.message,
        icon: "alert-circle",
      });
    },
  });
};

// 기도 내용 수정
export const useUpdatePrayerContentMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ prayerTitleId, contentId, content }: { prayerTitleId: number; contentId: number; content: string }) =>
      prayerService.updateContent(prayerTitleId, contentId, content),
    onSuccess: (data, variables) => {
      // 기도 내용 관련 캐시 무효화
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.rooms],
      });
      showAlert({
        title: "기도 내용 수정",
        message: "기도 내용이 수정되었습니다.",
        icon: "check-circle",
      });
    },
    onError: (error: ApiError) => {
      showAlert({
        title: "기도 내용 수정 실패",
        message: error.message,
        icon: "alert-circle",
      });
    },
  });
};

// 기도 제목 삭제
export const useDeletePrayerTitleMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ prayerTitleId, roomId }: { prayerTitleId: number; roomId: number }) =>
      prayerService.deleteTitle(prayerTitleId),
    onSuccess: (data, variables) => {
      // 기도 제목 관련 캐시 무효화
      queryClient.invalidateQueries({
        queryKey: [
          QUERY_KEYS.rooms,
          variables.roomId,
          QUERY_KEYS.prayerTitles,
          QUERY_KEYS.infinite,
        ],
      });
      showAlert({
        title: "기도 제목 삭제",
        message: data.message,
        icon: "check-circle",
      });
    },
    onError: (error: ApiError) => {
      showAlert({
        title: "기도 제목 삭제 실패",
        message: error.message,
        icon: "alert-circle",
      });
    },
  });
};

// 기도 내용 삭제
export const useDeletePrayerContentMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ prayerTitleId, contentId }: { prayerTitleId: number; contentId: number }) =>
      prayerService.deleteContent(prayerTitleId, contentId),
    onSuccess: (data, variables) => {
      // 기도 내용 관련 캐시 무효화
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.rooms],
      });
      showAlert({
        title: "기도 내용 삭제",
        message: "기도 내용이 삭제되었습니다.",
        icon: "check-circle",
      });
    },
    onError: (error: ApiError) => {
      showAlert({
        title: "기도 내용 삭제 실패",
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
    mutationFn: ({ prayerTitleId, roomId }: CreatePrayerCompletionRequest) => {
      return prayerService.completePrayer({
        prayerTitleId,
        roomId,
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
