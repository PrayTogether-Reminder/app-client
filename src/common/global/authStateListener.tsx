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
  const initAuth = useAuthStore((state) => state.initAuth);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);
  const initialCheckRef = useRef(false);
  const lastRedirectRef = useRef<string | null>(null);

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

    const isProtectedRoute = segments[0] === "(protected)";
    const isPublicRoute = segments[0] === "(public)";
    const isRootRoute =
      segments.length === (0 as number) ||
      (segments.length === 1 && segments[0] === ("index" as string));

    // 인증 안 됨 + protected 경로 → 로그인으로 (한 번만)
    if (!isAuthenticated && isProtectedRoute) {
      if (lastRedirectRef.current !== 'welcome') {
        console.log("Redirecting to welcome page - not authenticated");
        router.replace(path.showWelcome());
        lastRedirectRef.current = 'welcome';
      }
      return;
    }

    // 인증됨 + (public 경로 또는 root) → 기도방 목록으로 (한 번만)
    if (isAuthenticated && (isPublicRoute || isRootRoute)) {
      if (lastRedirectRef.current !== 'roomList') {
        console.log("Redirecting to room list - authenticated");
        router.replace(path.showRoomList());
        lastRedirectRef.current = 'roomList';
      }
      return;
    }

    // 정상 네비게이션 시 lastRedirect 초기화
    if (isProtectedRoute && isAuthenticated) {
      lastRedirectRef.current = null;
    }
  }, [isAuthenticated, isLoading, segments, router]);

  if (isLoading && !initialCheckRef.current) {
    return <LoadingScreen />;
  }

  return <>{children}</>;
}
