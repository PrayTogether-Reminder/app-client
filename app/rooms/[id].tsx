import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";

export default function RoomDetail() {
  const { id } = useLocalSearchParams();

  return (
    <View className="flex-1 bg-white items-center justify-center">
      <Text className="text-black">방 상세 ({id})</Text>
    </View>
  );
}
