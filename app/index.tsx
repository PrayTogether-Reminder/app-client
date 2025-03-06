import { useRouter } from "expo-router";
import { View, StyleSheet, useWindowDimensions } from "react-native";
import { TouchableRipple, Text, useTheme } from "react-native-paper";
import { RFValue } from "react-native-responsive-fontsize";
import path from "../src/common/constants/path";

export default function MainScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { width } = useWindowDimensions();

  // Determine text size based on screen width with RFValue for better scaling
  const getFontSize = () => {
    if (width < 768) return RFValue(16); // Small screens ($sm equivalent)
    if (width < 1024) return RFValue(24); // Medium screens ($md equivalent)
    return RFValue(32); // Large screens ($lg equivalent)
  };

  return (
    <View style={styles.container}>
      <TouchableRipple
        onPress={() => {
          router.push(path.rooms);
        }}
        style={[styles.button, { backgroundColor: theme.colors.primary }]}
        rippleColor="rgba(255, 255, 255, 0.2)"
      >
        <Text style={[styles.buttonText, { fontSize: getFontSize() }]}>
          다음 화면으로 이동
        </Text>
      </TouchableRipple>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    padding: RFValue(16),
    borderRadius: RFValue(8),
  },
  buttonText: {
    color: "white",
    lineHeight: RFValue(32),
  },
});
