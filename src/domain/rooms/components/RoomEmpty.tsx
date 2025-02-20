import { YStack, Text } from "tamagui";

const EmptyRoomList = () => (
  <YStack flex={1} justifyContent="center" alignItems="center" padding="$4">
    <Text fontSize="$5" color="gray">
      방 목록이 없습니다
    </Text>
  </YStack>
);

export default EmptyRoomList;
