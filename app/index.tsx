import { useRouter } from "expo-router";
import { View, YStack, Text } from "tamagui";
import path from "../src/common/constants/path";

export default function MainScreen() {
  const router = useRouter();
  return (
    <View flex={1} justifyContent="center" alignItems="center">
      <YStack
        onPress={() => {
          router.push(path.rooms);
        }}
        backgroundColor="$blue10"
        padding="$4"
        borderRadius="$4"
        pressStyle={{
          backgroundColor: "$blue9",
        }}
      >
        <Text
          fontSize="$8"
          lineHeight="$8"
          color="white"
          $sm={{ fontSize: "$4", lineHeight: "$4" }}
          $md={{ fontSize: "$12", lineHeight: "$12" }}
          $lg={{ fontSize: "$16", lineHeight: "$16" }}
        >
          다음 화면으로 이동
        </Text>
      </YStack>
    </View>
  );
}
