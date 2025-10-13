import axios from 'axios';

// Axios 인스턴스 생성
// 공용 API (회원가입, 로그인 등)
const publicApi = axios.create({
  baseURL: 'http://localhost:8080/api/v1',
  withCredentials: true,
});

// JWT API (인증 필요)
const authApi = axios.create({
  baseURL: 'http://localhost:8080/api/v1',
  withCredentials: true,
});

// 요청 인터셉터
authApi.interceptors.request.use(
  (config) => {
    // 예: JWT 토큰이 있다면 자동으로 Authorization 헤더 추가
    const token = localStorage.getItem('AccessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('요청 오류:', error);
    return Promise.reject(error);
  }
);

// 응답 인터셉터
authApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
    
      try {
        const response = await publicApi.post("/auth/reissue", null, {
          withCredentials: true,
        });
        const newAccessToken = response.data.data.newAccessToken;
        localStorage.setItem("AccessToken", newAccessToken);
        console.log("토큰 재발급 성공");
        // axios 기본 헤더도 갱신 (중요)
        authApi.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;

        // 리프레시 성공 후 원래 요청 재시도
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return authApi(originalRequest);
      } catch (refreshError) {
        console.log("토큰 재발급 실패");
        localStorage.removeItem("AccessToken");
        // 로그아웃 처리 + 로그인 페이지 리다이렉트 해주기
      }
    }
    return Promise.reject(error);
  }
);

export { publicApi, authApi };