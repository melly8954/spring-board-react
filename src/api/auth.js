import { publicApi, authApi } from './axiosInstance';

const login = async (username, password) => {
  // 유효성 검사
  if (!username.trim()) {
    alert('아이디를 입력해주세요.');
    return;
  }
  if (!password) {
    alert('비밀번호를 입력해주세요.');
    return;
  }

  // 로그인 API 요청
  try {
    const response = await publicApi.post('/auth/login', {
      username,
      password
    });
    return response.data; // 실제 필요한 데이터만 반환
  } catch (error) {
    throw error; // 필요 시 상위에서 처리 가능
  }
};

const logout = async () => {
  try {
    const response = await authApi.post('/auth/logout');
    localStorage.removeItem('AccessToken');
    return response.data;
  } catch (error) {
    throw error;
  }
}

export { login, logout };