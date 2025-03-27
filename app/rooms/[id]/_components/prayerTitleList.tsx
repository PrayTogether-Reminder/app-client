import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import { RFValue } from "react-native-responsive-fontsize";
import { useSelectedRoomStore } from "../../../../src/domain/rooms/stores/useSelectedRoomStore";
import { useInfinitePrayerTitlesQuery } from "@/domain/prayers/hooks/queries/usePrayerQueries";
import { PrayerTitle } from "../../../../src/domain/prayers/types/prayerTitle";
import { useRoomMembersQuery } from "../../../../src/domain/rooms/hooks/queries/useRoomQueries";
import { useSelectedPrayerTitleStore } from "../../../../src/domain/prayers/stores/useSelectedPrayerTitleStore";

import Loading from "../../../../src/common/components/loading/Loading";
import path from "../../../../src/common/constants/path";
import QUERY_KEYS from "../../../../src/common/constants/queryKeys";
import PrayerTitleItem from "./prayerTitleItem";
import { backgroundColor } from "@/common/styles/color";

const EmptyPrayerTitleList = () => {
  return (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>기도제목이 없습니다.</Text>
    </View>
  );
};

export default function PrayerTitleList(): JSX.Element {
  const roomId = useSelectedRoomStore().selectedRoom?.id ?? null;
  console.log("render room by id =", roomId);
  const router = useRouter();
  const { select: selectTitle } = useSelectedPrayerTitleStore();
  const queryClient = useQueryClient();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isRefetching,
  } = useInfinitePrayerTitlesQuery(roomId as number);

  const { refetch: membersRefetch } = useRoomMembersQuery(roomId);

  const prayerTitles = React.useMemo(() => {
    if (!data) return [];
    // @ts-expect-error
    return data.pages.flatMap((page: PrayerTitle[]) => page);
  }, [data]);

  const handlePrayerTitlePress = (title: PrayerTitle): void => {
    if (!title) return;
    selectTitle(title);
    console.log("Selected prayerTitle:", title.title);
    router.push(path.showPrayersContentById(title.id));
  };

  const handleLoadMore = () => {
    if (isFetchingNextPage || !hasNextPage || prayerTitles.length === 0) return;
    fetchNextPage();
  };

  const renderTitleItem = ({ item }: { item: PrayerTitle }) => {
    return <PrayerTitleItem item={item} onPress={handlePrayerTitlePress} />;
  };
  const onRefresh = () => {
    queryClient.invalidateQueries({
      queryKey: [QUERY_KEYS.rooms, roomId, QUERY_KEYS.prayerTitles],
    });
    membersRefetch();
  };

  return (
    <FlatList
      style={styles.flatList}
      contentContainerStyle={styles.flatListContent}
      data={prayerTitles}
      renderItem={renderTitleItem}
      keyExtractor={(item) => String(item.id)}
      refreshing={isRefetching}
      onRefresh={onRefresh}
      ListHeaderComponent={
        (isFetchingNextPage || isLoading) && hasNextPage ? Loading : null
      }
      ListEmptyComponent={!isLoading ? EmptyPrayerTitleList : null}
      showsVerticalScrollIndicator={true}
      inverted={true}
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.3}
      maintainVisibleContentPosition={{
        minIndexForVisible: 0,
        autoscrollToTopThreshold: 10,
      }}
    />
  );
}

const styles = StyleSheet.create({
  flatList: {
    flex: 1,
    backgroundColor: backgroundColor.default,
  },
  flatListContent: {
    paddingVertical: 8,
    paddingBottom: RFValue(32),
  },
  emptyContainer: {
    padding: 20,
    alignItems: "center",
    transform: [{ scaleY: -1 }, { scaleX: -1 }],
  },
  emptyText: {
    fontSize: RFValue(16),
    color: "#666",
  },
});
