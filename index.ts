// import "expo-router/entry";
// import messaging from "@react-native-firebase/messaging";
// import * as Notifications from "expo-notifications";

// // 백그라운드 메시지 핸들러 등록 (앱 진입점에서 필수)
// messaging().setBackgroundMessageHandler(async (remoteMessage) => {
//   console.log("Background Message received:", remoteMessage);

//   try {
//     // 1. 백그라운드에서도 로컬 알림 표시
//     await Notifications.scheduleNotificationAsync({
//       content: {
//         title: remoteMessage.notification?.title || "새 알림",
//         body: remoteMessage.notification?.body || "새 메시지가 도착했습니다",
//         data: remoteMessage.data || {},
//         sound: "default",
//         badge: 1,
//       },
//       trigger: null, // 즉시 표시
//     });

//     // 2. 데이터 처리 (로컬 저장 등)
//     if (remoteMessage.data) {
//       console.log("Processing background data:", remoteMessage.data);
//       // 필요시: AsyncStorage 저장, 배지 카운트 업데이트 등
//     }
//   } catch (error) {
//     console.error("Error handling background message:", error);
//   }
// });
