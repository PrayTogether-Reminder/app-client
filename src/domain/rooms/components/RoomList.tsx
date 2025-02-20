import React, { useCallback, useState } from "react";
import { ListRenderItem, Platform, FlatList } from "react-native";
import { Spinner, YStack, styled } from "tamagui";
import EmptyRoomList from "./RoomEmpty";
import RoomItem from "./RoomItem";
import { useRoomStore } from "./../store/roomStore";

export interface Room {
  id: number;
  name: string;
  memberCnt: number;
  description: string;
  createdTime: Date;
  isNotification: boolean;
}

const RoomFlatList = styled(FlatList<Room>, {
  flex: 1,
  padding: "$4",
});

const LoadingFooter = () => (
  <YStack padding="$4" alignItems="center">
    <Spinner size="large" color="$blue10" />
  </YStack>
);

// const RoomList = () => {
//   console.log("RoomList rendering");
// const [rooms, setRooms] = useState<Room[]>([]);
// const [loading, setLoading] = useState(false);
// const [refreshing, setRefreshing] = useState(false);
// const [hasMore, setHasMore] = useState(true);

const RoomList = () => {
  console.log("RoomList rendering");

  const rooms = useRoomStore((state) => state.rooms);
  const loading = useRoomStore((state) => state.loading);
  const refreshing = useRoomStore((state) => state.refreshing);
  const hasMore = useRoomStore((state) => state.hasMore);
  const loadRooms = useRoomStore((state) => state.loadRooms);
  const toggleNotification = useRoomStore((state) => state.toggleNotification);
  const leaveRoom = useRoomStore((state) => state.leaveRoom);
  const setLoading = useRoomStore((state) => state.setLoading);
  const setHasMore = useRoomStore((state) => state.setHasMore);

  // // 방 목록 불러오기
  // const loadRooms = loadRooms();

  // 새로고침
  const handleRefresh = useCallback(() => {
    // setRefreshing(true);
    setHasMore(true);
    loadRooms();
  }, [loadRooms]);

  // 추가 로딩
  const handleLoadMore = useCallback(() => {
    if (!loading && hasMore) {
      loadRooms();
    }
  }, [loading, hasMore, loadRooms]);

  // 방 선택
  const handleRoomPress = useCallback((room: Room) => {
    console.log("Selected room:", room);
  }, []);

  const handleNotificationToggle = (room: Room) => {
    toggleNotification(room);
  };

  const handleLeaveRoom = (room: Room) => {
    leaveRoom(room);
  };

  const renderRoom: ListRenderItem<Room> = useCallback(
    ({ item }) => (
      <RoomItem
        room={item}
        onRoomPress={handleRoomPress}
        onNotificationToggle={handleNotificationToggle}
        onLeaveRoom={handleLeaveRoom}
      />
    ),
    [handleRoomPress, handleNotificationToggle, handleLeaveRoom]
  );

  React.useEffect(() => {
    loadRooms();
  }, [loadRooms]);

  return (
    <YStack flex={1} backgroundColor="$background">
      <RoomFlatList
        data={rooms}
        renderItem={renderRoom}
        keyExtractor={(item) => String(item.id)}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loading ? LoadingFooter : null}
        ListEmptyComponent={EmptyRoomList}
        refreshing={refreshing}
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
