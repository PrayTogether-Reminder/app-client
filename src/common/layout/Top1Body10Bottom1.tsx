import React, { ReactNode } from "react";
import { View } from "tamagui";
import { backgroundColor, flexMarker, color } from "../styles/color";

interface LayoutProps {
  tops: ReactNode[];
  bodies: ReactNode[];
  bottoms: ReactNode[];
}
export default function Tob1Body10Bottom1({
  tops,
  bodies,
  bottoms,
}: LayoutProps) {
  return (
    <View flex={1} justifyContent="center" alignItems="center">
      <View flex={1} backgroundColor={color.third} height="100%" width="100%">
        {tops.map((top, index) => (
          <React.Fragment key={`top-${index}`}>{top}</React.Fragment>
        ))}
      </View>
      <View
        flex={10}
        backgroundColor={backgroundColor.default}
        height="100%"
        width="100%"
      >
        {bodies.map((body, index) => (
          <React.Fragment key={`body-${index}`}>{body}</React.Fragment>
        ))}
      </View>
      <View
        flex={1}
        backgroundColor={backgroundColor.default}
        height="100%"
        width="100%"
      >
        {bottoms.map((bottom, index) => (
          <React.Fragment key={`bottom-${index}`}>{bottom}</React.Fragment>
        ))}
      </View>
    </View>
  );
}
