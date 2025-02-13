import { View, Text } from "react-native";
import { Link } from "expo-router";
import "../global.css";

export default function Index() {
  return (
    <View className="flex-1 justify-center items-center">
      <Link href="/rooms" asChild>
        <Text className="text-blue-500">처음 메인 화면</Text>
      </Link>
    </View>
  );
}
