import React, { ReactNode } from "react";
import { View, StyleSheet } from "react-native";
import { backgroundColor, color } from "../../styles/color";
import { RFValue } from "react-native-responsive-fontsize";

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
  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
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
    height: RFValue(40),
    backgroundColor: color.third,
    width: "100%",
  },
  bodySection: {
    flex: 1,
    backgroundColor: backgroundColor.default,
    width: "100%",
  },
  bottomSection: {
    height: RFValue(50),
    backgroundColor: backgroundColor.white,
    width: "100%",
  },
});
