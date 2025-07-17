import React, { ReactNode } from "react";
import { View, StyleSheet, Platform } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { backgroundColor, flexMarker, color } from "../styles/color";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface LayoutProps {
  tops: ReactNode[];
  bodies: ReactNode[];
  bottoms: ReactNode[];
}

export default function Top1Body10Bottom1({
  tops,
  bodies,
  bottoms,
}: LayoutProps) {
  const insets = useSafeAreaInsets();
  
  return (
    <View style={styles.container}>
      <View style={[
        styles.topSection,
        Platform.OS === 'ios' && { paddingTop: insets.top, marginTop: -insets.top }
      ]}>
        {tops.map((top, index) => (
          <React.Fragment key={`top-${index}`}>{top}</React.Fragment>
        ))}
      </View>
      <View style={styles.bodySection}>
        {bodies.map((body, index) => (
          <React.Fragment key={`body-${index}`}>{body}</React.Fragment>
        ))}
      </View>
      <View style={styles.bottomSection}>
        {bottoms.map((bottom, index) => (
          <React.Fragment key={`bottom-${index}`}>{bottom}</React.Fragment>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  topSection: {
    flex: 1.3,
    backgroundColor: color.third,
    width: "100%",
    height: "100%",
  },
  bodySection: {
    flex: 10,
    backgroundColor: backgroundColor.default,
    width: "100%",
    height: "100%",
  },
  bottomSection: {
    flex: 1,
    backgroundColor: backgroundColor.white,
    width: "100%",
    height: "100%",
  },
});
