import analytics from "@react-native-firebase/analytics";

/**
 * 이벤트 파라미터 타입 정의
 * 새로운 이벤트 추가 시 여기에 타입을 정의하세요
 */
export interface EventParams {
  // 예시: 나중에 이벤트별 파라미터 타입 추가
  // prayer_created: { room_id: string; is_public?: boolean };
  // room_joined: { room_id: string; invite_method: string };
  [key: string]: Record<string, string | number | boolean | undefined>;
}

class AnalyticsManager {
  private static instance: AnalyticsManager;
  private isEnabled: boolean = true;

  private constructor() {
    // 개발 모드에서는 analytics 비활성화 (선택적)
    if (__DEV__) {
      this.isEnabled = false;
      console.log("[Analytics] 개발 모드 - Analytics 비활성화");
    }
  }

  static getInstance(): AnalyticsManager {
    if (!AnalyticsManager.instance) {
      AnalyticsManager.instance = new AnalyticsManager();
    }
    return AnalyticsManager.instance;
  }

  /**
   * Analytics 활성화/비활성화
   */
  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
    analytics().setAnalyticsCollectionEnabled(enabled);
    console.log(`[Analytics] ${enabled ? "활성화" : "비활성화"}`);
  }

  /**
   * 화면 조회 추적
   * @param screenName 화면 이름 (예: "HomeScreen", "PrayerRoomScreen")
   * @param screenClass 화면 클래스명 (선택적)
   */
  async logScreenView(
    screenName: string,
    screenClass?: string
  ): Promise<void> {
    if (!this.isEnabled) return;

    try {
      await analytics().logScreenView({
        screen_name: screenName,
        screen_class: screenClass || screenName,
      });
      console.log(`[Analytics] Screen: ${screenName}`);
    } catch (error) {
      console.error("[Analytics] Screen view error:", error);
    }
  }

  /**
   * 커스텀 이벤트 로깅
   * @param eventName 이벤트 이름 (snake_case 권장)
   * @param params 이벤트 파라미터
   */
  async logEvent(
    eventName: string,
    params?: Record<string, string | number | boolean | undefined>
  ): Promise<void> {
    if (!this.isEnabled) return;

    try {
      await analytics().logEvent(eventName, params);
      console.log(`[Analytics] Event: ${eventName}`, params || "");
    } catch (error) {
      console.error(`[Analytics] Event error (${eventName}):`, error);
    }
  }

  /**
   * 사용자 ID 설정 (로그인 시)
   * @param userId 사용자 고유 ID
   */
  async setUserId(userId: string | null): Promise<void> {
    if (!this.isEnabled) return;

    try {
      await analytics().setUserId(userId);
      console.log(`[Analytics] User ID: ${userId ? "설정됨" : "해제됨"}`);
    } catch (error) {
      console.error("[Analytics] Set user ID error:", error);
    }
  }

  /**
   * 사용자 속성 설정
   * @param name 속성 이름
   * @param value 속성 값
   */
  async setUserProperty(name: string, value: string | null): Promise<void> {
    if (!this.isEnabled) return;

    try {
      await analytics().setUserProperty(name, value);
      console.log(`[Analytics] User property: ${name} = ${value}`);
    } catch (error) {
      console.error("[Analytics] Set user property error:", error);
    }
  }

  // ============================================================
  // 빌트인 이벤트 (Firebase 권장 이벤트)
  // ============================================================

  /**
   * 로그인 이벤트
   */
  async logLogin(method: string): Promise<void> {
    if (!this.isEnabled) return;

    try {
      await analytics().logLogin({ method });
      console.log(`[Analytics] Login: ${method}`);
    } catch (error) {
      console.error("[Analytics] Login error:", error);
    }
  }

  /**
   * 회원가입 이벤트
   */
  async logSignUp(method: string): Promise<void> {
    if (!this.isEnabled) return;

    try {
      await analytics().logSignUp({ method });
      console.log(`[Analytics] SignUp: ${method}`);
    } catch (error) {
      console.error("[Analytics] SignUp error:", error);
    }
  }

  // ============================================================
  // 커스텀 이벤트 (앱 특화 이벤트)
  // 이벤트가 결정되면 여기에 메서드 추가
  // ============================================================

  // 예시:
  // async logPrayerCreated(roomId: string, isPublic?: boolean): Promise<void> {
  //   await this.logEvent("prayer_created", {
  //     room_id: roomId,
  //     is_public: isPublic,
  //   });
  // }

  // async logRoomJoined(roomId: string, inviteMethod: string): Promise<void> {
  //   await this.logEvent("room_joined", {
  //     room_id: roomId,
  //     invite_method: inviteMethod,
  //   });
  // }
}

export default AnalyticsManager;
