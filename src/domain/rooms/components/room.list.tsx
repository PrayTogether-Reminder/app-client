import React, { useState, useEffect, useCallback } from "react";
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

export interface Room {
  id: number;
  name: string;
  memberCnt: number;
  description: string;
  createdTime: Date;
  isNotification: boolean;
}

interface RoomItemProps {
  item: Room;
  onPress: (room: Room) => void;
  onToggleNotification: (room: Room) => void;
  onLeaveRoom: (room: Room) => void;
}

const RoomItem = React.memo(
  ({ item, onPress, onToggleNotification, onLeaveRoom }: RoomItemProps) => {
    console.log("RoomItem rendering = " + item.id);
    const [showMenu, setShowMenu] = useState(false);

    const handleLongPress = useCallback(() => {
      setShowMenu(true);
    }, []);

    const handleLeaveRoom = useCallback(() => {
      Alert.alert("방 나가기", "정말로 이 방을 나가시겠습니까?", [
        { text: "취소", style: "cancel" },
        {
          text: "나가기",
          style: "destructive",
          onPress: () => onLeaveRoom(item),
        },
      ]);
    }, [item, onLeaveRoom]);

    const handleCardPress = useCallback(() => {
      onPress(item);
    }, [item, onPress]);

    const handleNotificationToggle = useCallback(() => {
      onToggleNotification(item);
    }, [item, onToggleNotification]);

    useCloseOnBack(showMenu, setShowMenu);

    return (
      <>
        <Card
          elevate
          bordered
          animation="bouncy"
          pressStyle={{ scale: 0.95 }}
          onPress={handleCardPress}
          onLongPress={handleLongPress}
          marginBottom="$4"
          padding="$4"
          borderLeftColor={color.secondary}
          borderLeftWidth="$2"
        >
          <YStack gap="$2">
            <XStack justifyContent="space-between" alignItems="center">
              <Text fontSize="$6" fontWeight="bold">
                {item.name}
              </Text>
              <ChevronRight size="$1" />
            </XStack>

            <XStack gap="$4">
              <XStack gap="$2" alignItems="center">
                <Users size="$1" />
                <Text fontSize="$4" color="gray">
                  현재 {item.memberCnt}명
                </Text>
              </XStack>
            </XStack>
          </YStack>
        </Card>

        <Sheet
          modal
          open={showMenu}
          onOpenChange={setShowMenu}
          snapPoints={[80]}
          dismissOnSnapToBottom
          animation="fast"
        >
          <Sheet.Frame padding="$4">
            <Sheet.Handle />
            <YStack gap="$4">
              <Text fontSize="$9" fontWeight="bold" alignSelf="center">
                {item.name}
              </Text>

              <ScrollView
                height="65%" // 고정된 높이
                showsVerticalScrollIndicator={true} // 스크롤바 표시
              >
                <Text alignSelf="center" fontSize="$6">
                  {item.description}
                </Text>
              </ScrollView>

              {/* 하단 버튼들 */}
              <Button
                icon={item.isNotification ? BellOff : Bell}
                onPress={handleNotificationToggle}
              >
                알림 {item.isNotification ? "끄기" : "켜기"}
              </Button>

              <Button
                icon={LogOut}
                backgroundColor={buttonColor.exit}
                onPress={() => {
                  handleLeaveRoom();
                  setShowMenu(false);
                }}
              >
                방 나가기
              </Button>
            </YStack>
          </Sheet.Frame>
        </Sheet>
      </>
    );
  }
);

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
  }, []); // 의존성 없음

  const handleToggleNotification = useCallback((room: Room) => {
    setRooms((rooms) =>
      rooms.map((r) =>
        r.id === room.id ? { ...r, isNotification: !r.isNotification } : r
      )
    );
  }, []); // setRooms는 안정적인 참조를 가지므로 의존성 배열에 포함할 필요 없음

  const handleLeaveRoom = useCallback((room: Room) => {
    setRooms((rooms) => rooms.filter((r) => r.id !== room.id));
  }, []); // 마찬가지로 의존성 필요 없음

  const renderItem: ListRenderItem<Room> = useCallback(
    ({ item }) => (
      <RoomItem
        item={item}
        onPress={handleRoomPress}
        onToggleNotification={handleToggleNotification}
        onLeaveRoom={handleLeaveRoom}
      />
    ),
    [handleRoomPress, handleToggleNotification, handleLeaveRoom]
  );

  React.useEffect(() => {
    loadRooms(1);
  }, []);

  return (
    <YStack flex={1} backgroundColor="$background">
      <RoomFlatList
        data={rooms}
        renderItem={renderItem}
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
