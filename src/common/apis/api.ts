import axios, {
  AxiosResponse,
  InternalAxiosRequestConfig,
  AxiosError,
} from "axios";
import BASE_API_URL from "./apiUrl";
import { tokenUtils } from "@/domain/auth/utils/tokenUtils";
import { useAuthStore } from "@/domain/auth/stores/authStore";

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
const fetchRefreshToken = async (refreshToken: string) => {
  return await axios.post(
    `${BASE_API_URL}/auth/reissue-token`,
    {
      refreshToken,
    },
    { headers: { "Content-Type": "application/json" } }
  );
};

// 로그아웃 처리 후 인증 에러 반환 함수
const handleLogoutFromInvalidAuthToken = async (): Promise<never> => {
  await tokenUtils.clearTokens();
  useAuthStore.getState().emitAuthRequired();
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

    // 인증이 필요한 요청인 경우
    if (isAuthRequired) {
      let accessToken = await tokenUtils.getAccessToken();

      // access 가 없는 경우 토큰 재발급 시도
      if (!accessToken) {
        const refreshToken = await tokenUtils.getRefreshToken();

        if (refreshToken) {
          // refresh가 있다면
          try {
            console.log("토큰 재발급 요청 시작");
            const response = await fetchRefreshToken(refreshToken);

            if (
              response.data &&
              response.data.accessToken &&
              response.data.refreshToken
            ) {
              const newAccessToken = response.data.accessToken;
              const newRefreshToken =
                response.data.refreshToken || refreshToken;
              await tokenUtils.saveTokens(newAccessToken, newRefreshToken);
              accessToken = newAccessToken;
              console.log("토큰 재발급 성공");
            }
          } catch (error) {
            console.log("토큰 재발급 실패 error :", error);
            useAuthStore.getState().emitAuthRequired();
          }
        } else {
          // refresh가 없다면
          console.log("리프레시 토큰이 없습니다.");
          useAuthStore.getState().emitAuthRequired();
        }
      }

      // 액세스 토큰이 있으면 헤더에 추가
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

    console.log("response error status=", error.response?.status);
    console.log("response error data=", error.response?.data);

    // 네트워크 에러 처리
    if (!error.response) {
      return Promise.reject(createNetworkError());
    }

    const errorData = error.response.data as any;

    // 401 에러 처리 (토큰 만료)
    if (errorData.status === 401 && !originalRequest._retry) {
      try {
        const refreshToken = await tokenUtils.getRefreshToken();

        if (!refreshToken) {
          // refresh가 없다면
          return handleLogoutFromInvalidAuthToken();
        }

        // 리프레시 토큰으로 새 액세스 토큰 요청
        originalRequest._retry = true;
        const response = await fetchRefreshToken(refreshToken);
        console.log("Changed Token refresh response:", response.data);

        if (
          response.data &&
          response.data.accessToken &&
          response.data.refreshToken
        ) {
          const newAccessToken = response.data.accessToken;
          const newRefreshToken = response.data.refreshToken || refreshToken;

          await tokenUtils.saveTokens(newAccessToken, newRefreshToken);
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          console.log("Retrying original request with new token:");
          return api(originalRequest); // 원래 요청 재시도
        }

        // 토큰 응답이 올바르지 않은 경우
        return handleLogoutFromInvalidAuthToken();
      } catch (refreshError) {
        console.log("refresh token error=", refreshError);
        return handleLogoutFromInvalidAuthToken();
      }
    }

    // 일반적인 API 에러 처리
    const apiError = {
      code: errorData?.code || "UNKNOWN_ERROR",
      message: errorData?.message || "알 수 없는 에러가 발생했습니다.",
      status: errorData?.status || 400,
    } as ApiError;

    console.log("apiError=", apiError);
    return Promise.reject(apiError);
  }
);

export type { ApiError, ApiResponse };
export default api;
