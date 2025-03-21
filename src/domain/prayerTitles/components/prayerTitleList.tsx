import React, { useRef, useEffect, useState } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Platform,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import { Text, ActivityIndicator } from "react-native-paper";
import { RFValue } from "react-native-responsive-fontsize";
import { useRouter } from "expo-router";
import { color } from "../../../common/styles/color";
import path from "../../../common/constants/path";
import { PrayerTitle } from "../types/dto/response/prayerTitle";
import { useInfinitePrayerTitlesQuery } from "../hooks/queries/prayerTitleQueries";
import { useSelectedRoomStore } from "../../prayerRoom/stores/useSelectedRoomStore";
import PrayerTitleItem from "./prayerTitleItem";
import Loading from "../../../common/components/loading/Loading";

const EmptyPrayerTitleList = () => {
  return (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>기도제목이 없습니다.</Text>
    </View>
  );
};

export default function PrayerTitleList(): JSX.Element {
  const roomId = useSelectedRoomStore().selectedRoom?.id;
  console.log("render room by id =", roomId);
  const router = useRouter();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isRefetching,
    refetch,
  } = useInfinitePrayerTitlesQuery(roomId as string);

  const prayerTitles = React.useMemo(() => {
    if (!data) return [];
    // @ts-expect-error
    return data.pages.flatMap((page: PrayerTitle[]) => page);
  }, [data]);

  const handlePrayerTitlePress = (title: PrayerTitle): void => {
    if (!title) return;
    console.log("Selected prayerTitle:", title);
    router.push(path.showPrayerContentById(`${title.id}`));
  };

  const handleLoadMore = () => {
    if (isFetchingNextPage || !hasNextPage || prayerTitles.length === 0) return;
    fetchNextPage();
  };

  const renderTitleItem = ({ item }: { item: PrayerTitle }) => {
    return <PrayerTitleItem item={item} onPress={handlePrayerTitlePress} />;
  };

  return (
    <FlatList
      style={styles.flatList}
      contentContainerStyle={styles.flatListContent}
      data={prayerTitles}
      renderItem={renderTitleItem}
      keyExtractor={(item) => String(item.id)}
      refreshing={isRefetching}
      onRefresh={refetch}
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
    backgroundColor: "#f5f5f5",
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
