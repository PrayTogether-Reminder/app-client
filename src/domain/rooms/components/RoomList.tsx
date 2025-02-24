import React, { useCallback, useState } from "react";
import { ListRenderItem, Platform, FlatList } from "react-native";
import { Spinner, YStack, styled } from "tamagui";
import EmptyRoomList from "./RoomEmpty";
import RoomItem from "./RoomItem";
import { useRoomStore } from "./../store/roomStore";
import { OrderBy } from "../../../common/apis/constants/params";

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
  const setRefreshing = useRoomStore((state) => state.setRefreshing);

  const handleRefresh = () => {
    if (loading) return; // 이미 로딩 중이면 중단

    setRefreshing(true);
    setHasMore(true);
    loadRooms().finally(() => {
      setRefreshing(false);
    });
  };

  // 추가 로딩
  const handleLoadMore = () => {
    if (loading || !hasMore || rooms.length === 0) return;

    try {
      const lastRoom = rooms[rooms.length - 1];
      // 마지막 방의 생성 시간이 있는지 확인
      if (lastRoom?.createdTime) {
        setLoading(true); // 로딩 상태 설정
        console.log("last: " + lastRoom.createdTime.toString());
        loadRooms(OrderBy.DEFAULT, lastRoom.createdTime.toString());
      }
    } catch (error) {
      console.error("Error in handleLoadMore:", error);
      setLoading(false);
    }
  };

  // 방 선택
  const handleRoomPress = (room: Room) => {
    console.log("Selected room:", room);
  };

  const handleNotificationToggle = (room: Room) => {
    toggleNotification(room);
  };

  const handleLeaveRoom = (room: Room) => {
    leaveRoom(room);
  };

  const renderRoom: ListRenderItem<Room> = ({ item }) => (
    <RoomItem
      room={item}
      onRoomPress={handleRoomPress}
      onNotificationToggle={handleNotificationToggle}
      onLeaveRoom={handleLeaveRoom}
    />
  );

  React.useEffect(() => {
    setLoading(true);
    loadRooms().finally(() => {
      setLoading(false);
    });
  }, [loadRooms, setLoading]);
  return (
    <YStack flex={1} backgroundColor="$background">
      <RoomFlatList
        data={rooms}
        renderItem={renderRoom}
        keyExtractor={(item) => String(item.id)}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.3}
        ListFooterComponent={loading && hasMore ? LoadingFooter : null}
        ListEmptyComponent={!loading ? EmptyRoomList : null}
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
