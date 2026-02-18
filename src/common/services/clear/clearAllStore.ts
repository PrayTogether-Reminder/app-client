import { useAuthStore } from "@/domain/auth/stores/useAuthStore";
import { usePrayerCreationStore } from "@/domain/prayers/stores/usePrayerCreationStore";
import { useSelectedPrayerTitleStore } from "@/domain/prayers/stores/useSelectedPrayerTitleStore";
import { queryClient } from "@/common/hooks/queries/customQueryClientProvider";

export const clearAllStore = () => {
  useAuthStore.getState().clear();
  usePrayerCreationStore.getState().clear();
  useSelectedPrayerTitleStore.getState().clear();

  queryClient.clear();
};
