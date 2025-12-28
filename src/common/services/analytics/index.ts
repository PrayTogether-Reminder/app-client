import AnalyticsManager from "./analyticsManager";

// 싱글톤 인스턴스 export
export const Analytics = AnalyticsManager.getInstance();

// 클래스도 export (테스트 등에서 필요할 수 있음)
export { AnalyticsManager };

// 화면 자동 추적 훅
export { useScreenTracking } from "./useScreenTracking";
