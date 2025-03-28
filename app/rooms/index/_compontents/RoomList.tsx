import React from "react";
import {
  FlatList,
  ListRenderItem,
  Platform,
  Alert,
  StyleSheet,
  View,
} from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { RFValue } from "react-native-responsive-fontsize";
import { useSelectedRoomStore } from "@/domain/rooms/stores/useSelectedRoomStore";
import { Room } from "@/domain/rooms/types/room";
import {
  useToggleRoomNotificationMutation,
  useRoomDeletionMutation,
} from "@/domain/rooms/hooks/mutations/useRoomMutations";
import { useInfiniteRoomsQuery } from "@/domain/rooms/hooks/queries/useRoomQueries";
import EmptyRoomList from "./RoomEmpty";
import RoomItem from "./RoomItem";
import { useRouter } from "expo-router";
import path from "@/common/constants/path";
import { color } from "@/common/styles/color";
import Loading from "@/common/components/loading/OverlayLoading";

const RoomList = () => {
  console.log("RoomList rendering");

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
    router.push(path.showRoomById(room.id as number));
  };

  const handleToggleRoomNotificationMutation = (roomId: number) => {
    toggleRoomNotificationMutation(roomId);
  };
  const { mutate: deleteRoom } = useRoomDeletionMutation();
  const handleLeaveRoom = (room: Room) => {
    deleteRoom({ roomId: room.id });
    console.log("delete room=", room.id);
  };

  const renderRoom: ListRenderItem<Room> = ({ item }) => (
    <RoomItem
      room={item}
      onRoomPress={handleRoomPress}
      onNotificationToggle={() =>
        handleToggleRoomNotificationMutation(item?.id as number)
      }
      onLeaveRoom={handleLeaveRoom}
    />
  );

  return (
    <View style={[styles.container]}>
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
          (isFetchingNextPage || isLoading) && hasNextPage ? Loading : null
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
});

export default RoomList;
