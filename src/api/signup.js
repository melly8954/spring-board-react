import { publicApi } from './axiosInstance';

const signup = async (username, password, confirmPassword, name, file) => {
  // 유효성 검사
  if (!username.trim()) {
    alert('아이디를 입력해주세요.');
    return;
  }
  if (!password) {
    alert('비밀번호를 입력해주세요.');
    return;
  }
  if (!confirmPassword) {
    alert('비밀번호 확인을 입력해주세요.');
    return;
  }
  if (password !== confirmPassword) {
    alert('비밀번호와 비밀번호 확인이 일치하지 않습니다.');
    return;
  }
  if (!name.trim()) {
    alert('이름을 입력해주세요.');
    return;
  }

  const formData = new FormData();
  formData.append(
    'data',
    new Blob([JSON.stringify({ username, password, confirmPassword, name })], { type: 'application/json' })
  );
  if (file) formData.append('file', file);

  // 회원가입 API 요청
  try {
    const response = await publicApi.post('/members', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}
export default signup;