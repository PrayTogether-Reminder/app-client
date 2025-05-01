import { create } from "zustand";
import { tokenUtils } from "../utils/tokenUtils";
import { AuthState } from "../types/authState";

export const useAuthStore = create<AuthState>((set, get) => ({
  isAuthenticated: false,
  isLoading: false,

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
      set({ isAuthenticated: false });
    } catch (error) {
      console.error("로그아웃 중 오류 발생:", error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
}));
