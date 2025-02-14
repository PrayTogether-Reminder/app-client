import React, { ReactNode } from "react";
import { View } from "tamagui";
import { backgroundColor } from "../../common/styles/color";

interface LayoutProps {
  top: ReactNode;
  body: ReactNode;
  bottom: ReactNode;
}
export default function Tob1Body10Bottom1({ top, body, bottom }: LayoutProps) {
  return (
    <View flex={1} justifyContent="center" alignItems="center">
      <View
        flex={1}
        backgroundColor={backgroundColor.flexMarker5}
        height="100%"
        width="100%"
      >
        {top}
      </View>
      <View
        flex={10}
        backgroundColor={backgroundColor.default}
        height="100%"
        width="100%"
      >
        {body}
      </View>
      <View
        flex={1}
        backgroundColor={backgroundColor.default}
        height="100%"
        width="100%"
      >
        {bottom}
      </View>
    </View>
  );
}
