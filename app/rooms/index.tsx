import { View, Text } from "react-native";
import { Link } from "expo-router";

export default function RoomList() {
  return (
    <View className="flex-1 bg-white items-center justify-center">
      <Text className="text-black">방 목록</Text>
      <Link href="/rooms/create">방 만들기</Link>
      <Link href="/rooms/123">방 상세보기</Link>
    </View>
  );
}
