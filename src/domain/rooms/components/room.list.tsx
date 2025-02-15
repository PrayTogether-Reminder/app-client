import React, { useState, useCallback } from "react";
import { FlatList, Platform } from "react-native";
import { YStack, XStack, Card, Text, Spinner, styled } from "tamagui";
import { ChevronRight, Users, Plus } from "@tamagui/lucide-icons";
import { color } from "../../../common/styles/color";

interface Room {
  id: number;
  name: string;
  memberCnt: number;
}

const StyledFlatList = styled(FlatList<Room>, {
  flex: 1,
  padding: "$4",
});

const RoomItem = ({ item, onPress }: any) => (
  <Card
    elevate
    bordered
    animation="bouncy"
    pressStyle={{ scale: 0.97 }}
    onPress={() => onPress(item)}
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

      <XStack space="$4">
        <XStack space="$2" alignItems="center">
          <Users size="$1" />
          <Text fontSize="$4" color="gray">
            현재 {item.memberCnt}명
          </Text>
        </XStack>
      </XStack>
    </YStack>
  </Card>
);

const LoadingFooter = () => (
  <YStack padding="$4" alignItems="center">
    <Spinner size="large" color="$blue10" />
  </YStack>
);

const EmptyList = () => (
  <YStack flex={1} justifyContent="center" alignItems="center" padding="$4">
    <Text fontSize="$5" color="gray">
      방 목록이 없습니다
    </Text>
  </YStack>
);

const RoomList = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const loadRooms = useCallback(
    async (pageNum = 1, shouldRefresh = false) => {
      if (loading || (!hasMore && !shouldRefresh)) return;

      setLoading(true);
      try {
        const newRooms = Array.from({ length: 10 }, (_, i) => ({
          id: Math.floor(Math.random() * 10000),
          name: `${pageNum}월 ${i + 1}일 방`,
          memberCnt: Math.floor(Math.random() * 20),
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

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setHasMore(true);
    loadRooms(1, true);
  }, [loadRooms]);

  const handleLoadMore = useCallback(() => {
    if (!loading && hasMore) {
      loadRooms(page);
    }
  }, [loading, hasMore, page, loadRooms]);

  const handleRoomPress = useCallback((room: any) => {
    console.log("Selected room:", room);
  }, []);

  React.useEffect(() => {
    loadRooms(1);
  }, []);

  return (
    <YStack flex={1} backgroundColor="$background">
      <StyledFlatList
        data={rooms}
        renderItem={({ item }) => (
          <RoomItem item={item} onPress={handleRoomPress} />
        )}
        keyExtractor={(item) => String(item.id)}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loading ? LoadingFooter : null}
        ListEmptyComponent={EmptyList}
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
