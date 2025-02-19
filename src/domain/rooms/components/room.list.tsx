import React, { useState, useEffect, useCallback, Fragment } from "react";
import { Platform, Alert, ListRenderItem } from "react-native";
import {
  YStack,
  XStack,
  Card,
  Text,
  Spinner,
  Sheet,
  Button,
  ScrollView,
} from "tamagui";
import {
  ChevronRight,
  Users,
  Plus,
  Bell,
  BellOff,
  LogOut,
  Info,
} from "@tamagui/lucide-icons";
import { color } from "../../../common/styles/color";
import RoomFlatList from "./room.flat.list";
import EmptyRoomList from "../components/room.empty";
import useCloseOnBack from "../../../common/services/back-handler/close.on.back";
import { buttonColor } from "../../../common/styles/color";
import RoomInfoSheet from "./sheets/room.option.sheet";
import RoomItem from "./room.item";

export interface Room {
  id: number;
  name: string;
  memberCnt: number;
  description: string;
  createdTime: Date;
  isNotification: boolean;
}

const LoadingFooter = () => (
  <YStack padding="$4" alignItems="center">
    <Spinner size="large" color="$blue10" />
  </YStack>
);

const RoomList = () => {
  console.log("RoomList rendering");
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // 방 목록 불러오기
  const loadRooms = useCallback(
    async (pageNum = 1, shouldRefresh = false) => {
      if (loading || (!hasMore && !shouldRefresh)) return;

      setLoading(true);
      try {
        const newRooms = Array.from({ length: 10 }, (_, i) => ({
          id: Math.floor(Math.random() * 10000),
          name: `${pageNum}월 ${i + 1}일 방`,
          memberCnt: Math.floor(Math.random() * 20),
          description: "test desc",
          createdTime: new Date(),
          isNotification: true,
        }));

        if (shouldRefresh) {
          setRooms(newRooms);
        } else {
          setRooms((prev) => [...prev, ...newRooms]);
        }

        setPage(pageNum + 1);
        setHasMore(pageNum < 5);
      } catch (error) {
        console.error("Failed to load rooms:", error);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [loading, hasMore]
  );

  // 새로고침
  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setHasMore(true);
    loadRooms(1, true);
  }, [loadRooms]);

  // 추가 로딩
  const handleLoadMore = useCallback(() => {
    if (!loading && hasMore) {
      loadRooms(page);
    }
  }, [loading, hasMore, page, loadRooms]);

  // 방 선택
  const handleRoomPress = useCallback((room: Room) => {
    console.log("Selected room:", room);
  }, []);

  const handleNotificationToggle = useCallback((room: Room) => {
    setRooms((prevRooms) =>
      prevRooms.map((r) =>
        r.id === room.id ? { ...r, isNotification: !r.isNotification } : r
      )
    );
  }, []);

  const handleLeaveRoom = useCallback((room: Room) => {
    setRooms((prevRooms) => prevRooms.filter((r) => r.id !== room.id));
  }, []);

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
    loadRooms(1);
  }, []);

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
