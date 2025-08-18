console.log(
  "GOOGLE_SERVICES_JSON env:",
  process.env.GOOGLE_SERVICES_JSON ? "EXISTS" : "NOT FOUND"
);
console.log("Current working directory:", process.cwd());

const API_URL = process.env.EXPO_PUBLIC_API_URL;

module.exports = {
  name: "기도함께",
  slug: "app-client",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/main_logo.png",
  userInterfaceStyle: "light",
  newArchEnabled: true,
  experiments: {
    typedRoutes: true,
    tsconfigPaths: true,
    newArch: true,
  },
  scheme: "pray-together-scheme",
  splash: {
    image: "./assets/main_logo.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff",
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: "site.praytogether",
    googleServicesFile:
      process.env.GOOGLE_SERVICES_FILE_IOS || "./GoogleService-Info.plist",
    infoPlist: {
      UIBackgroundModes: ["remote-notification"],
      NSUserNotificationUsageDescription:
        "앱에서 중요한 알림을 보내기 위해 알림 권한이 필요합니다.",
      NSAppTransportSecurity: {
        // NSAllowsArbitraryLoads: true, // http 요청 허용
      },
      ITSAppUsesNonExemptEncryption: false, // 암호화 관련 설정 추가
    },
    entitlements: {
      "aps-environment": "production", // 운영 환경에서 푸시 알림 사용
    },
    buildNumber: "1.0.12",
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/main_logo.png",
      backgroundColor: "#ffffff",
    },
    softwareKeyboardLayoutMode: "pan",
    package: "site.praytogether",
    googleServicesFile:
      process.env.GOOGLE_SERVICES_JSON || "./google-services.json",
    permissions: ["RECEIVE_BOOT_COMPLETED", "VIBRATE"],
    versionCode: 8,
  },
  web: {
    favicon: "./assets/main_logo.png",
  },
  plugins: [
    "expo-router",
    "expo-font",
    [
      "expo-build-properties",
      {
        android: {
          // usesCleartextTraffic: true, // http 요청 허용
        },
        ios: {
          useFrameworks: "static",
        },
      },
    ],
    "@react-native-firebase/app",
    "@react-native-firebase/messaging",
    "expo-notifications",
    "expo-dev-client",
  ],
  extra: {
    router: {
      origin: false,
    },
    eas: {
      projectId: "193687a6-0b20-445e-8ecd-5b35de386246",
    },
  },
  // SDK 53
  runtimeEnvs: {
    EXPO_PUBLIC_API_URL: API_URL ? API_URL : "There is no API URL",
  },
};