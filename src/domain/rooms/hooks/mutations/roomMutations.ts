import { useMutation, useQueryClient } from "@tanstack/react-query";
import roomService from "../../services/roomService";
import QUERY_KEYS from "../../../../common/queries/queryKeys";
import { Room } from "../../types/dto/responses/room";

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
    onError: (error, roomId, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(
          [QUERY_KEYS.rooms, QUERY_KEYS.infinite],
          context.previousData
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.rooms, QUERY_KEYS.infinite],
        refetchType: "none",
      });
    },
  });
};
