import { useMutation, useQueryClient } from "@tanstack/react-query";
import { roomService } from "../../services/roomService";
import { Room } from "../../types/room";
import { DeleteRoomParams } from "../../types/params/deleteRoomParams";
import { CreateRoomRequest } from "../../types/request/createRoomRequest";
import QUERY_KEYS from "../../../../common/constants/queryKeys";
import { ApiError } from "../../../../common/apis/api";
import { showAlert } from "@/common/components/modal/stores/useAlertStore";

// 방 알림 설정 토글 mutation
export const useToggleRoomNotificationMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (roomId: number) => roomService.toggleNotification(roomId),
    onMutate: async (roomId) => {
      await queryClient.cancelQueries({
        queryKey: [QUERY_KEYS.rooms, QUERY_KEYS.infinite],
      });

      const previousData = queryClient.getQueryData([
        QUERY_KEYS.rooms,
        QUERY_KEYS.infinite,
      ]);

      queryClient.setQueryData(
        [QUERY_KEYS.rooms, QUERY_KEYS.infinite],
        (oldData: any) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            pages: oldData.pages.map((page: Room[]) =>
              page.map((room: Room) =>
                room.id === roomId
                  ? { ...room, isNotification: !room.isNotification }
                  : room
              )
            ),
          };
        }
      );

      return { previousData };
    },
    onError: (error: ApiError, roomId, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(
          [QUERY_KEYS.rooms, QUERY_KEYS.infinite],
          context.previousData
        );
      }
      showAlert({
        title: "알림 설정 실패",
        message: error.message,
        icon: "bell-off",
      });
    },
    onSuccess: (data, roomId) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.rooms, QUERY_KEYS.infinite],
        refetchType: "none",
      });
    },
  });
};

// 기도방 생성
export const useRoomCreationMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ name, description }: CreateRoomRequest) =>
      roomService.create(name, description),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.rooms, QUERY_KEYS.infinite],
      });
      showAlert({
        title: "기도방 생성 완료",
        message: data.message,
        icon: "home-plus",
      });
    },
    onError: (error: ApiError) => {
      showAlert({
        title: "기도방 생성 실패",
        message: error.message,
        icon: "alert-circle",
      });
    },
  });
};

// 기도방 나가기(삭제)
export const useRoomDeletionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ roomId }: DeleteRoomParams) =>
      roomService.delete({ roomId }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.rooms, QUERY_KEYS.infinite],
      });
      showAlert({
        title: "기도방 나가기 완료",
        message: data.message,
        icon: "exit-to-app",
      });
    },
    onError: (error: ApiError) => {
      showAlert({
        title: "기도방 나가기 실패",
        message: error.message,
        icon: "alert-circle",
      });
    },
  });
};
