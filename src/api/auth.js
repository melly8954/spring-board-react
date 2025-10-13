import api from './axiosInstance';

const auth = async (username, password) => {
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
    const response = await api.post('/auth/login', {
      username,
      password
    });
    return response.data; // 실제 필요한 데이터만 반환
  } catch (error) {
    throw error; // 필요 시 상위에서 처리 가능
  }
};

export default auth;