export interface AuthState {
  isAuthenticated: boolean;
  initAuth: () => Promise<void>;
  checkAuthentication: () => boolean;
  login: (accessToken: string, refreshToken: string) => Promise<void>;
  logout: () => Promise<void>;
}
