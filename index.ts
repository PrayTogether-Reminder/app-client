import "expo-router/entry";
import messaging from "@react-native-firebase/messaging";

// Background message handler 등록
messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log("Message handled in the background!", remoteMessage);
  // 여기서는 UI 업데이트를 할 수 없으므로 데이터 처리만 가능
});
