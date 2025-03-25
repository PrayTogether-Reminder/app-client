import { useQueryClient } from "@tanstack/react-query";
import QUERY_KEYS from "./../../../common/hooks/queries/queryKeys";

export function usePrayerClear(roomId: number | null) {
  const queryClient = useQueryClient();
  queryClient.invalidateQueries({
    // speific room -> clear titles & contents
    queryKey: [QUERY_KEYS.rooms, roomId, QUERY_KEYS.prayerTitles],
  });
}
