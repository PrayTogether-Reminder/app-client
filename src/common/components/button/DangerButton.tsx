import React from "react";
import { StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import { RFValue } from "react-native-responsive-fontsize";

import { color } from "@/common/styles/color";

export type DangerButtonProps = React.ComponentProps<typeof Button>;

export function DangerButton({
  style,
  mode = "contained",
  buttonColor = color.exit,
  ...rest
}: DangerButtonProps) {
  return (
    <Button
      mode={mode}
      buttonColor={buttonColor}
      style={[styles.button, style]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  button: {
    padding: RFValue(4),
  },
});
