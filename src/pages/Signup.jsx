import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import signup from '../api/signup';
import handleServerError from '../utils/handleServerError';
import '../css/signup.css';

function Signup() {
  const navigate = useNavigate()  
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [name, setName] = useState('')
  const [file, setFile] = useState('')

  const handleSignup = async () => {
    // 회원가입 API 호출
    try {
      const response = await signup(username, password, confirmPassword, name, file);
      alert(response.data.message);
      navigate('/');
    } catch (error) {
      handleServerError(error);
    }
  }

  return (
    <div className="app-container">
      <div className="signup-box">
        <h2>회원가입</h2>
        <input
          type="text"
          placeholder="아이디"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="비밀번호 확인"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
         <input
          type="text"
          placeholder="이름"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="file"
          accept="image/*"
          onChange={e => setFile(e.target.files[0])} 
        />
        <button className="signup-button" onClick={handleSignup}>
          회원가입
        </button>
        <button className="signup-button" onClick={() => navigate(-1)}>
          뒤로가기
        </button>
      </div>
    </div>
  )
}

export default Signup;
