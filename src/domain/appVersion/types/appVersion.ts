export interface AppVersionInfoResponse {
  minimumAppVersion: string;  // 최소 필수 버전 (이하는 강제 업데이트)
  forceUpdateAppVersion: string;  // 권장 버전 (이하는 선택적 업데이트)
  maintenanceMode: boolean;
}