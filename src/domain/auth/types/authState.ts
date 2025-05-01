export interface AuthState {
  isAuthenticated: boolean;
  initAuth: () => Promise<void>;
  login: (accessToken: string, refreshToken: string) => Promise<void>;
  logout: () => Promise<void>;
}
