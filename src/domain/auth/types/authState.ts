export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  authRequiredListeners: (() => void)[];
  initAuth: () => Promise<void>;
  login: (accessToken: string, refreshToken: string) => Promise<void>;
  logout: () => Promise<void>;
  getRefreshToken: () => Promise<string>;
  emitAuthRequired: () => void;
  onAuthRequired: (listener: () => void) => () => void;
  removeAuthRequiredListener: (listener: () => void) => void;
}
