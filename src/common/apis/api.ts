import axios, {
  AxiosResponse,
  InternalAxiosRequestConfig,
  AxiosError,
} from "axios";
import BASE_API_URL from "./apiUrl";
import { tokenUtils } from "@/domain/auth/utils/tokenUtils";

interface ApiResponse<T = any> {
  data: T;
  message: string;
  status: number;
}

interface ApiError {
  code: string;
  message: string;
  status: number;
}

const REQUEST_TIMEOUT = 5000; // 5s

const api = axios.create({
  baseURL: BASE_API_URL,
  timeout: REQUEST_TIMEOUT,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// 인증 필요 에러 객체 생성 함수
const createAuthRequiredError = (): ApiError => ({
  code: "AUTH_REQUIRED",
  message: "로그인이 필요합니다.",
  status: 401,
});

// 네트워크 에러 객체 생성 함수
const createNetworkError = (): ApiError => ({
  code: "NETWORK_ERROR",
  message: "네트워크 연결을 확인해주세요.",
  status: 0,
});

// 토큰 갱신 함수
const refreshAuthToken = async (refreshToken: string) => {
  return await axios.post(`${BASE_API_URL}/auth/reissue-token`, {
    refreshToken,
  });
};

// 로그아웃 처리 후 인증 에러 반환 함수
const handleLogoutAndReject = async (): Promise<never> => {
  await tokenUtils.clearTokens();
  return Promise.reject(createAuthRequiredError());
};

// 요청 인터셉터 추가
api.interceptors.request.use(
  async (config) => {
    // 인증이 필요 없는 API 경로 목록
    const noAuthRequired = [
      "/auth/login",
      "/auth/signup",
      "/auth/otp/email",
      "/auth/otp/email/verification",
      "/auth/reissue-token",
    ];

    // 현재 요청 경로가 인증이 필요 없는지 확인
    const isAuthRequired = !noAuthRequired.some((path) =>
      config.url?.includes(path)
    );

    // 인증이 필요한 요청에만 토큰 추가
    if (isAuthRequired) {
      const accessToken = await tokenUtils.getAccessToken();
      if (accessToken) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }

    console.log("request url=" + config.baseURL + config.url);
    return config;
  },
  (error) => {
    console.log("request error=" + error);
    return Promise.reject(error);
  }
);
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    console.log("response network error=" + error);

    // 네트워크 에러 처리
    if (!error.response) {
      return Promise.reject(createNetworkError());
    }

    const errorData = error.response.data as any;

    // 401 에러 처리 (토큰 만료)
    if (
      error.response.status === 401 &&
      !originalRequest._retry &&
      (errorData?.code === "AUTH-005" || errorData?.code === "AUTH-006") // expired or invalid
    ) {
      try {
        const refreshToken = await tokenUtils.getRefreshToken();
        if (!refreshToken) {
          return handleLogoutAndReject();
        }

        // 리프레시 토큰으로 새 액세스 토큰 요청
        originalRequest._retry = true;
        const response = await refreshAuthToken(refreshToken);

        if (response.data && response.data.accessToken) {
          const newAccessToken = response.data.accessToken;
          const newRefreshToken = response.data.refreshToken || refreshToken;

          await tokenUtils.saveTokens(newAccessToken, newRefreshToken);
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return axios(originalRequest); // 원래 요청 재시도
        }

        // 토큰 응답이 올바르지 않은 경우
        return handleLogoutAndReject();
      } catch (refreshError) {
        console.log("refresh token error=", refreshError);
        return handleLogoutAndReject();
      }
    }

    // 일반적인 API 에러 처리
    const apiError = {
      code: errorData?.code || "UNKNOWN_ERROR",
      message: errorData?.message || "알 수 없는 에러가 발생했습니다.",
      status: error.response.status,
    } as ApiError;

    console.log("apiError=", apiError);
    return Promise.reject(apiError);
  }
);

export type { ApiError, ApiResponse };
export default api;
