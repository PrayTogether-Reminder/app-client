import { View, StyleSheet } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { color } from "../../styles/color";
import { RFValue } from "react-native-responsive-fontsize";

export default function Loading() {
  return (
    <View style={styles.loading}>
      <ActivityIndicator size="large" color={color.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  loading: {
    padding: RFValue(16),
    alignItems: "center",
  },
});
