import { Slot } from "expo-router";
import { createTamagui, TamaguiProvider } from "tamagui";
import { defaultConfig } from "@tamagui/config/v4";
import CustomQueryClientProvider from "../src/common/queries/customQueryClientProvider";

const config = createTamagui(defaultConfig);

export default function RootLayout() {
  return (
    <TamaguiProvider config={config}>
      <CustomQueryClientProvider>
        <Slot />
      </CustomQueryClientProvider>
    </TamaguiProvider>
  );
}
