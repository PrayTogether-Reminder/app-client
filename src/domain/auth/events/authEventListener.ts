import { useEffect } from "react";
import { useRouter } from "expo-router";
import { authEvents } from "../events/authEvents";
import path from "@/common/constants/path";

export default function AuthEventListener() {
  const router = useRouter();

  useEffect(() => {
    const handleAuthRequired = () => {
      console.log("인증이 필요합니다. Welcome 화면으로 이동합니다.");
      router.replace(path.showWelcome());
    };

    // 이벤트 구독
    authEvents.on("AUTH_REQUIRED", handleAuthRequired);

    // 클린업 함수
    return () => {
      authEvents.removeListener("AUTH_REQUIRED", handleAuthRequired);
    };
  }, [router]);

  return null;
}
