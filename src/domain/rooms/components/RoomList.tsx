import React from "react";
import {
  FlatList,
  ListRenderItem,
  Platform,
  Alert,
  StyleSheet,
  View,
} from "react-native";
import { ActivityIndicator, useTheme } from "react-native-paper";
import { RFValue } from "react-native-responsive-fontsize";
import { useSelectedRoomStore } from "../store/roomStore";
import { Room } from "../types/dto/responses/room";
import { useToggleRoomNotificationMutation } from "./../hooks/mutations/roomMutations";
import { useInfiniteRoomsQuery } from "./../hooks/queries/roomQueries";
import EmptyRoomList from "./RoomEmpty";
import RoomItem from "./RoomItem";
import { useRouter } from "expo-router";
import path from "../../../common/constants/path";

const LoadingFooter = () => {
  const theme = useTheme();

  return (
    <View style={styles.loadingFooter}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
    </View>
  );
};

const RoomList = () => {
  console.log("RoomList rendering");
  const theme = useTheme();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isRefetching,
    refetch,
  } = useInfiniteRoomsQuery();

  const { mutate: toggleRoomNotificationMutation } =
    useToggleRoomNotificationMutation();

  const { selectRoom } = useSelectedRoomStore();
  const router = useRouter();

  const rooms = React.useMemo(() => {
    if (!data) return [];
    // @ts-expect-error
    return data.pages.flatMap((page: Room[]) => page);
  }, [data]);

  const handleRefresh = () => {
    if (isLoading || isRefetching) return;
    refetch();
  };

  const handleLoadMore = () => {
    if (isFetchingNextPage || !hasNextPage || rooms.length === 0) return;
    fetchNextPage();
  };

  const handleRoomPress = (room: Room) => {
    console.log("Selected room:", room);
    selectRoom(room);
    router.push(path.roomId(`${room.id}`));
  };

  const handleToggleRoomNotificationMutation = (roomId: number) => {
    toggleRoomNotificationMutation(roomId);
  };

  const handleLeaveRoom = (room: Room) => {
    // leaveRoomMutation(room.id);
  };

  const renderRoom: ListRenderItem<Room> = ({ item }) => (
    <RoomItem
      room={item}
      onRoomPress={handleRoomPress}
      onNotificationToggle={() => handleToggleRoomNotificationMutation(item.id)}
      onLeaveRoom={handleLeaveRoom}
    />
  );

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <FlatList
        style={styles.flatList}
        contentContainerStyle={{
          padding: RFValue(16),
          paddingBottom: Platform.OS === "ios" ? RFValue(40) : RFValue(16),
        }}
        data={rooms}
        renderItem={renderRoom}
        keyExtractor={(item) => String(item.id)}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.3}
        ListFooterComponent={
          (isFetchingNextPage || isLoading) && hasNextPage
            ? LoadingFooter
            : null
        }
        ListEmptyComponent={!isLoading ? EmptyRoomList : null}
        refreshing={isRefetching}
        onRefresh={handleRefresh}
        showsVerticalScrollIndicator={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flatList: {
    flex: 1,
  },
  loadingFooter: {
    padding: RFValue(16),
    alignItems: "center",
  },
});

export default RoomList;
