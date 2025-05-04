// stores/authStore.ts
import { create } from "zustand";
import { tokenUtils } from "../utils/tokenUtils";
import { AuthStore, AuthState } from "../types/authStore";
import { clearAllStore } from "@/common/services/clear/clearAllStore";

// 초기 상태 정의
const initialState: AuthState = {
  isAuthenticated: false,
  isLoading: false,
  authRequiredListeners: [],
};

export const useAuthStore = create<AuthStore>((set, get) => ({
  ...initialState,

  // actions
  initAuth: async () => {
    set({ isLoading: true });
    try {
      const accessToken = await tokenUtils.getAccessToken();
      if (accessToken) {
        set({ isAuthenticated: true });
      } else {
        set({ isAuthenticated: false });
      }
    } catch (error) {
      console.error("인증 초기화 중 오류 발생:", error);
      set({ isAuthenticated: false });
    } finally {
      set({ isLoading: false });
    }
  },

  login: async (accessToken, refreshToken) => {
    set({ isLoading: true });
    try {
      await tokenUtils.saveTokens(accessToken, refreshToken);
      set({ isAuthenticated: true });
    } catch (error) {
      console.error("로그인 중 오류 발생:", error);
      throw error; // 컴포넌트에서 처리할 수 있도록 에러를 다시 던짐
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await tokenUtils.clearTokens();
      clearAllStore();
    } catch (error) {
      console.error("로그아웃 중 오류 발생:", error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  getRefreshToken: async () => {
    try {
      const refreshToken = await tokenUtils.getRefreshToken();
      return refreshToken || "";
    } catch (error) {
      console.error("리프레시 토큰 가져오기 중 오류 발생:", error);
      throw error;
    }
  },

  emitAuthRequired: () => {
    const { authRequiredListeners } = get();
    authRequiredListeners.forEach((listener) => listener());
  },

  onAuthRequired: (listener) => {
    set((state) => ({
      authRequiredListeners: [...state.authRequiredListeners, listener],
    }));

    // unsubscribe 함수 반환
    return () => {
      set((state) => ({
        authRequiredListeners: state.authRequiredListeners.filter(
          (l) => l !== listener
        ),
      }));
    };
  },

  clear: () => {
    set(initialState);
  },
}));
