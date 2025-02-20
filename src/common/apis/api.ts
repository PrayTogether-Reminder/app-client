// services/api.ts
import axios, { AxiosResponse } from "axios";
import BASE_API_URL from "../config/apiUrl";

// API 응답의 기본 구조 정의
interface ApiResponse<T = any> {
  data: T;
  message: string;
  status: number;
}

// API 에러 응답 구조 정의
interface ApiError {
  code: string;
  message: string;
  status: number;
}

// 요청 타임아웃 상수 정의
const REQUEST_TIMEOUT = 30000; // 30s

const api = axios.create({
  baseURL: BASE_API_URL,
  timeout: REQUEST_TIMEOUT,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// 요청 인터셉터 추가
api.interceptors.request.use(
  (config) => {
    const token = "token"; /* 토큰 가져오기 로직 */
    if (token) {
      // if (!config.headers) config.headers = {};
      // config.headers.Authorization = `Bearer ${token}`;
    }
    console.log("request url=" + config.url);
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
  (error) => {
    console.log("response error=" + error);
    // 네트워크 에러 처리
    if (!error.response) {
      return Promise.reject({
        code: "NETWORK_ERROR",
        message: "네트워크 연결을 확인해주세요.",
        status: 0,
      } as ApiError);
    }

    // 일반적인 API 에러 처리
    const errorData = error.response.data;
    const apiError = {
      code: errorData.code || "UNKNOWN_ERROR",
      message: errorData.message || "알 수 없는 에러가 발생했습니다.",
      status: error.response.status,
    } as ApiError;

    console.log(apiError);
    return Promise.reject(apiError);
  }
);
export type { ApiError, ApiResponse };
export default api;
