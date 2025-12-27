import { useEffect, useCallback } from "react";
import { useRouter } from "expo-router";
import { useAuthStore } from "../stores/useAuthStore";
import path from "@/common/constants/path";

export default function AuthEventListener() {
  const router = useRouter();

  // 핸들러 함수를 메모이제이션
  const handleAuthRequired = useCallback(() => {
    console.log("인증이 필요합니다. Welcome 화면으로 이동합니다.");
    router.replace(path.showWelcome());
  }, [router]);

  useEffect(() => {
    const onAuthRequired = useAuthStore.getState().onAuthRequired;
    const unsubscribe = onAuthRequired(handleAuthRequired);

    return () => {
      unsubscribe();
    };
  }, [handleAuthRequired]);

  return null;
}
