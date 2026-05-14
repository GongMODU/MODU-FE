import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * 요청 인터셉터 - accessToken 주입
 * TODO: auth 연동 시 작성
 * - 저장된 accessToken을 가져와서 Authorization 헤더에 Bearer 토큰으로 추가
 * - ex) config.headers.Authorization = `Bearer ${accessToken}`;
 */
apiClient.interceptors.request.use((config) => {
  // TODO: auth 연동 시 토큰 추가
  return config;
});

/**
 * 응답 인터셉터 - 401 처리
 * TODO: auth 연동 시 작성
 * - 401 응답 시 /api/auth/refresh로 refreshToken 보내서 새 accessToken 발급
 * - 재발급 성공 시 원래 요청 재시도, 실패 시 로그아웃 처리
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // TODO: 401 처리 (토큰 갱신 또는 로그아웃)
    return Promise.reject(error);
  },
);

export default apiClient;
