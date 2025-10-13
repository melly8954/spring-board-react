import axios from 'axios';

// Axios 인스턴스 생성
const api = axios.create({
  baseURL: 'http://localhost:8080/api/v1', 
  withCredentials: true, // 필요 시 쿠키 인증
});

// 요청 인터셉터
api.interceptors.request.use(
  (config) => {
    // 예: JWT 토큰이 있다면 자동으로 Authorization 헤더 추가
    const token = localStorage.getItem('accessToken');
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
api.interceptors.response.use(
  (response) => response,   // 성공 시 그대로 반환
  (error) => {
    return Promise.reject(error);    // 에러를 호출한 곳에 전달
  }
);

export default api;