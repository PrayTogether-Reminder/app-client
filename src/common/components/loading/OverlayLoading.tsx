import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { ActivityIndicator } from "react-native-paper";

export default function OverlayLoading() {
  const [isReadyToShow, setIsReadyToShow] = useState(false);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setIsReadyToShow(true);
    }, 300); // 300ms

    // 메모리 누수 방지
    return () => clearTimeout(timerId);
  }, []);

  if (!isReadyToShow) {
    return null;
  }

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
