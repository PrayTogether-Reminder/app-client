import { useEffect, useRef } from "react";
import { usePathname } from "expo-router";
import { Analytics } from "./index";

/**
 * 화면 전환 시 자동으로 Analytics에 screen_view 이벤트를 전송하는 훅
 *
 * 사용법:
 * - app/_layout.tsx에서 한 번만 호출하면 됩니다.
 *
 * @example
 * ```tsx
 * // app/_layout.tsx
 * import { useScreenTracking } from "@/common/services/analytics/useScreenTracking";
 *
 * export default function RootLayout() {
 *   useScreenTracking();
 *   return <Slot />;
 * }
 * ```
 */
export function useScreenTracking(): void {
  const pathname = usePathname();
  const previousPathname = useRef<string | null>(null);

  useEffect(() => {
    // 같은 화면이면 중복 로깅 방지
    if (pathname === previousPathname.current) return;
    previousPathname.current = pathname;

    const screenName = formatScreenName(pathname);

    Analytics.logScreenView(screenName);
  }, [pathname]);
}

/**
 * 경로를 화면 이름으로 변환
 * - 숫자 ID를 :id로 치환
 *
 * @example
 * "/(protected)/rooms/123" -> "/(protected)/rooms/:id"
 * "/(public)/login" -> "/(public)/login"
 */
function formatScreenName(pathname: string): string {
  return pathname.replace(/\/\d+/g, "/:id"); // 숫자 ID → :id
}
