const API_URL = process.env.EXPO_PUBLIC_API_URL;

module.exports = {
  name: "기도함께",
  slug: "app-client",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "light",
  newArchEnabled: true,
  experiments: {
    typedRoutes: true,
    tsconfigPaths: true,
    newArch: true,
  },
  scheme: "pray-together-scheme",
  splash: {
    image: "./assets/splash-icon.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff",
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: "site.praytogether",
    googleServicesFile: "./GoogleService-Info.plist",
    infoPlist: {
      UIBackgroundModes: ["remote-notification"],
      NSUserNotificationUsageDescription:
        "앱에서 중요한 알림을 보내기 위해 알림 권한이 필요합니다.",
    },
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#ffffff",
    },
    softwareKeyboardLayoutMode: "pan",
    package: "site.praytogether",
    googleServicesFile:
      process.env.GOOGLE_SERVICES_JSON || "./google-services.json",
    permissions: ["RECEIVE_BOOT_COMPLETED", "VIBRATE"],
  },
  web: {
    favicon: "./assets/favicon.png",
  },
  plugins: [
    "expo-router",
    "expo-font",
    [
      "expo-build-properties",
      {
        android: {
          usesCleartextTraffic: true,
        },
      },
    ],
    "@react-native-firebase/app",
    "@react-native-firebase/messaging",
  ],
  extra: {
    router: {
      origin: false,
    },
    eas: {
      projectId: "52261da3-842e-4d52-bba7-54ecd152b8d7",
    },
  },
  // SDK 53
  runtimeEnvs: {
    EXPO_PUBLIC_API_URL: API_URL ? API_URL : "There is no API URL",
  },
};
