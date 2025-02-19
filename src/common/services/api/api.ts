// services/api.ts
import axios from "axios";
import ENV from "../../config/envirment";

// API 응답의 기본 구조 정의
interface ApiResponse<T = any> {
  data: T;
  status: number;
  message?: string;
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
  baseURL: ENV.apiUrl,
  timeout: REQUEST_TIMEOUT,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// 요청 인터셉터 추가
// api.interceptors.request.use(
//   (config) => {
//     const token = "token"; /* 토큰 가져오기 로직 */
//     if (token) {
//       if (!config.headers) config.headers = {};
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// 응답 인터셉터 개선
api.interceptors.response.use(
  (response: any) => {
    return response.data;
  },
  (error) => {
    // 네트워크 에러 처리
    if (!error.response) {
      return Promise.reject({
        code: "NETWORK_ERROR",
        message: "네트워크 연결을 확인해주세요.",
        status: 0,
      });
    }

    // 일반적인 API 에러 처리
    const errorData = error.response.data;
    return Promise.reject({
      code: errorData.code || "UNKNOWN_ERROR",
      message: errorData.message || "알 수 없는 에러가 발생했습니다.",
      status: error.response.status,
    });
  }
);
export type { ApiResponse, ApiError };
export default api;
