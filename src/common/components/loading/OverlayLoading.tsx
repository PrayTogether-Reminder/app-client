import { View, StyleSheet } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { color } from "../../styles/color";
import { RFValue } from "react-native-responsive-fontsize";

export default function OverlayLoading() {
  return (
    <View style={styles.overlayLoading}>
      <ActivityIndicator animating={true} size="large" />
    </View>
  );
}

const styles = StyleSheet.create({
  overlayLoading: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
});
