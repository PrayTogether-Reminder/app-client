require("dotenv").config();

console.log(
  "GOOGLE_SERVICES_JSON env:",
  process.env.GOOGLE_SERVICES_JSON ? "EXISTS" : "NOT FOUND"
);
console.log("Current working directory:", process.cwd());

console.log("EXPO_PUBLIC_API_URL from env:", process.env.EXPO_PUBLIC_API_URL);

const API_URL ="https://praytogether.site/api";
// const API_URL ="http://172.30.1.24:8080/api";
// const API_URL ="https://420691fee64f.ngrok-free.app/api";

// 환경별 설정
const environment = process.env.EAS_BUILD_PROFILE || 'production';

const config = {
  production: {
    name: '기도함께',
    androidPackage: 'site.praytogether',
  },
  development: {
    name: '기도함께Dev',
    androidPackage: 'site.praytogether.dev',
  },
  preview: {
    name: '기도함께Preview',
    androidPackage: 'site.praytogether.preview',
  }
};

const currentConfig = config[environment] || config.production;

const expoVersion = '1.0.12';
const androidVersion = 21;
const iosVersion = '1.0.24';

module.exports = {
  name: currentConfig.name,
  slug: "app-client",
  version: expoVersion,
  orientation: "portrait",
  icon: "./assets/main_logo.png",
  userInterfaceStyle: "light",
  newArchEnabled: false,
  experiments: {
    typedRoutes: true,
    tsconfigPaths: true,
    newArch: false,
  },
  updates: {
    enabled: true,
    checkAutomatically: "ON_LOAD",
    fallbackToCacheTimeout: 30000,
    url: "https://u.expo.dev/193687a6-0b20-445e-8ecd-5b35de386246"
  },
  runtimeVersion: expoVersion,
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
      ITSAppUsesNonExemptEncryption: false,
      CFBundleURLTypes: [
        {
          CFBundleURLSchemes: [
            "com.googleusercontent.apps.124350525745-4gap8sbgh7kg5gg7n0cgibd3pb10s7jg",
          ],
        },
      ],
    },
    entitlements: {
      "aps-environment": "production", // 운영 환경에서 푸시 알림 사용
    },
    buildNumber: iosVersion,
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/main_logo.png",
      backgroundColor: "#ffffff",
    },
    softwareKeyboardLayoutMode: "pan",
    package: currentConfig.androidPackage,
    googleServicesFile:
      process.env.GOOGLE_SERVICES_JSON || "./google-services.json",
    permissions: [
      "RECEIVE_BOOT_COMPLETED",
      "VIBRATE",
      "SCHEDULE_EXACT_ALARM",
      "USE_EXACT_ALARM",
      "POST_NOTIFICATIONS"
    ],
    blockedPermissions: [
      "com.google.android.gms.permission.AD_ID"
    ],  
    versionCode: androidVersion,
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
          minSdkVersion: 24, // Android 5.0 이상 (더 넓은 범위)
          targetSdkVersion: 35,
          compileSdkVersion: 35,
          enableProguardInReleaseBuilds: true,
          enableShrinkResourcesInReleaseBuilds: true,
          // usesCleartextTraffic: true, // http 요청 허용
        },
        ios: {
          useFrameworks: "static",
        },
      },
    ],
    "@react-native-firebase/app",
    "@react-native-firebase/messaging",
    [
      "@react-native-firebase/crashlytics",
      {
        enabled: true,
      }
    ],
    "expo-notifications",
    "expo-dev-client",
    "@react-native-google-signin/google-signin",
    "./plugins/withAndroidMainActivityPatch.js", // MainActivity lifecycle 패치
    "./plugins/withProguardRules.js", // ProGuard 규칙 자동 추가
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
    EXPO_PUBLIC_API_URL: API_URL,
  },
};