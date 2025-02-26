import React from "react";
import { FlatList, ListRenderItem, Platform } from "react-native";
import { Spinner, YStack, styled } from "tamagui";
import { useSelectedRoomStore } from "../store/roomStore";
import { Room } from "../types/dto/responses/room";
import { useToggleRoomNotificationMutation } from "./../hooks/mutations/roomMutations";
import { useInfiniteRoomsQuery } from "./../hooks/queries/roomQueries";
import EmptyRoomList from "./RoomEmpty";
import RoomItem from "./RoomItem";

const RoomFlatList = styled(FlatList<Room>, {
  flex: 1,
  padding: "$4",
});

const LoadingFooter = () => (
  <YStack padding="$4" alignItems="center">
    <Spinner size="large" color="$blue10" />
  </YStack>
);

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
    selectRoom(room);
    console.log("Selected room:", room);
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
    <YStack flex={1} backgroundColor="$background">
      <RoomFlatList
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
        contentContainerStyle={{
          paddingBottom: Platform.OS === "ios" ? 40 : 16,
        }}
      />
    </YStack>
  );
};

export default RoomList;
