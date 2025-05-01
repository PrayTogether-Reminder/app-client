import { create } from "zustand";
import { tokenUtils } from "../utils/tokenUtils";
import { AuthState } from "../types/authState";

export const useAuthStore = create<AuthState>((set, get) => ({
  isAuthenticated: false,

  initAuth: async () => {
    const accessToken = await tokenUtils.getAccessToken();
    if (accessToken) {
      set({ isAuthenticated: true });
    } else {
      set({ isAuthenticated: false });
    }
  },

  login: async (accessToken, refreshToken, user = null) => {
    await tokenUtils.saveTokens(accessToken, refreshToken);
    set({ isAuthenticated: true });
  },

  logout: async () => {
    await tokenUtils.clearTokens();
    set({ isAuthenticated: false });
  },
}));
