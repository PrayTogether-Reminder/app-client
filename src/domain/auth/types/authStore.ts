export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  authRequiredListeners: (() => void)[];
}

export interface AuthActions {
  initAuth: () => Promise<void>;
  login: (accessToken: string, refreshToken: string) => Promise<void>;
  logout: () => Promise<void>;
  getRefreshToken: () => Promise<string>;
  emitAuthRequired: () => void;
  onAuthRequired: (listener: () => void) => () => void;
  resetStore: () => void;
}

export interface AuthStore extends AuthState, AuthActions {}
