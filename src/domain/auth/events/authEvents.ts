import { EventEmitter } from "events";

// 간단한 이벤트 인터페이스 정의
export interface AuthEvents extends EventEmitter {
  emit(event: "AUTH_REQUIRED"): boolean;
  on(event: "AUTH_REQUIRED", listener: () => void): this;
  once(event: "AUTH_REQUIRED", listener: () => void): this;
  removeListener(event: "AUTH_REQUIRED", listener: () => void): this;
}

// 이벤트 에미터 생성
export const authEvents = new EventEmitter() as AuthEvents;
