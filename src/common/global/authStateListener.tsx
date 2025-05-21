import { useRouter, useSegments } from "expo-router";
import React, { useEffect, useRef, ReactNode } from "react";
import { useAuthStore } from "@/domain/auth/stores/useAuthStore";
import path from "@/common/constants/path";
import LoadingScreen from "@/common/components/loading/LoadingScreen";

interface AuthStateListenerProps {
  children: ReactNode;
}

export default function AuthStateListener({
  children,
}: AuthStateListenerProps) {
  const router = useRouter();
  const segments = useSegments();
  const { initAuth, isAuthenticated, isLoading } = useAuthStore();
  const initialCheckRef = useRef(false);

  // 초기 인증 체크
  useEffect(() => {
    if (isLoading || initialCheckRef.current) return;

    const checkAuth = async () => {
      await initAuth();
      initialCheckRef.current = true;
    };

    checkAuth();
  }, [isLoading, initAuth]);

  // 라우팅 처리
  useEffect(() => {
    if (isLoading || !initialCheckRef.current) return;

    const isProtectedRoute = segments[0] === ("protected" as string);
    const isPublicRoute = segments[0] === ("public" as string);
    const isRootRoute =
      segments.length === (0 as number) ||
      (segments.length === 1 && segments[0] === ("index" as string));

    if (!isAuthenticated && isProtectedRoute) {
      console.log("Redirecting to welcome page - not authenticated");
      router.replace(path.showWelcome());
    } else if (isAuthenticated && (isPublicRoute || isRootRoute)) {
      console.log("Redirecting to room list - authenticated");
      router.replace(path.showRoomList());
    }
  }, [isAuthenticated, isLoading, segments, router]);

  if (isLoading && !initialCheckRef.current) {
    return <LoadingScreen />;
  }

  return <>{children}</>;
}
