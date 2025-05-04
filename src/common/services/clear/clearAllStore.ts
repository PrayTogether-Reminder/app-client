import { useAuthStore } from "@/domain/auth/stores/useAuthStore";
import { usePrayerCreationStore } from "@/domain/prayers/stores/usePrayerCreationStore";
import { usePrayerUpdateStore } from "@/domain/prayers/stores/usePrayerUpdateStore";
import { useSelectedPrayerTitleStore } from "@/domain/prayers/stores/useSelectedPrayerTitleStore";
import { useSelectedRoomStore } from "@/domain/rooms/stores/useSelectedRoomStore";
import { queryClient } from "@/common/hooks/queries/customQueryClientProvider";

export const clearAllStore = () => {
  useAuthStore.getState().clear();
  usePrayerCreationStore.getState().clear();
  usePrayerUpdateStore.getState().clear();
  useSelectedPrayerTitleStore.getState().clear();
  useSelectedRoomStore.getState().clear();

  queryClient.clear();
};
