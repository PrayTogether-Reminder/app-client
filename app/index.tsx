import { Link } from "expo-router";
import { View, Paragraph } from "tamagui";

export default function MainScreen() {
  return (
    <View flex={1} justifyContent="center" alignItems="center">
      <Link href="/rooms" asChild>
        <Paragraph
          fontSize="$8"
          lineHeight="$8"
          $sm={{ fontSize: "$4", lineHeight: "$4" }}
          $md={{ fontSize: "$12", lineHeight: "$12" }}
          $lg={{ fontSize: "$16", lineHeight: "$16" }}
        >
          처음 메인 화면
        </Paragraph>
      </Link>
    </View>
  );
}
