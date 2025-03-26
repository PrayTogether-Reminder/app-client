import api, { ApiResponse } from "./api";
import { AxiosResponse } from "axios";

function convertToApiResponse<T>(response: AxiosResponse): ApiResponse<T> {
  return {
    data: (response.data ?? {}) as T,
    message: response.data.message || "",
    status: response.status || 0,
  } as ApiResponse;
}

const apiService = {
  /**
   * GET 요청
   * @param url - 엔드포인트 URL
   * @param params - URL 쿼리 파라미터
   * @param config - 추가 설정
   */
  get: async <T>(
    url: string,
    params?: any,
    config?: any
  ): Promise<ApiResponse<T>> => {
    const response = await api.get(url, { params, ...config });
    return convertToApiResponse(response);
  },

  /**
   * POST 요청
   * @param url - 엔드포인트 URL
   * @param data - 요청 바디 데이터
   * @param config - 추가 설정
   */
  post: async <T>(
    url: string,
    data?: any,
    config?: any
  ): Promise<ApiResponse<T>> => {
    const response = await api.post(url, data, config);
    return convertToApiResponse(response);
  },

  /**
   * PUT 요청
   * @param url - 엔드포인트 URL
   * @param data - 요청 바디 데이터
   * @param config - 추가 설정
   */
  put: async <T>(
    url: string,
    data?: any,
    config?: any
  ): Promise<ApiResponse<T>> => {
    const response = await api.put(url, data, config);
    return convertToApiResponse(response);
  },

  /**
   * PATCH 요청
   * @param url - 엔드포인트 URL
   * @param data - 요청 바디 데이터
   * @param config - 추가 설정
   */
  patch: async <T>(
    url: string,
    data?: any,
    config?: any
  ): Promise<ApiResponse<T>> => {
    const response = await api.patch(url, data, config);
    return convertToApiResponse(response);
  },

  /**
   * DELETE 요청
   * @param url - 엔드포인트 URL
   * @param config - 추가 설정
   */
  delete: async <T>(url: string, config?: any): Promise<ApiResponse<T>> => {
    const response = await api.delete(url, config);
    return convertToApiResponse(response);
  },
};

export default apiService;
