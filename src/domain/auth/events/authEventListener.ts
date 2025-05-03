import { useEffect } from "react";
import { useRouter } from "expo-router";
import { useAuthStore } from "../stores/authStore";
import path from "@/common/constants/path";
import { on } from "events";

export default function AuthEventListener() {
  const router = useRouter();
  const onAuthRequired = useAuthStore((state) => state.onAuthRequired);

  useEffect(() => {
    const handleAuthRequired = () => {
      console.log("인증이 필요합니다. Welcome 화면으로 이동합니다.");
      router.replace(path.showWelcome());
    };

    const unsubcribe = onAuthRequired(handleAuthRequired);

    return () => {
      unsubcribe();
    };
  }, [router, onAuthRequired]);

  return null;
}
