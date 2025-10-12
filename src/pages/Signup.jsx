import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Signup() {
  const navigate = useNavigate()  
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  
  const handleSignup = async () => {
    // 실제 회원가입 API 호출
    const data = await signup(username, email, password)
    console.log(data)
    // 가입 후 로그인 페이지로 이동
    navigate('/')
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
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="signup-button" onClick={handleSignup}>
          회원가입
        </button>
      </div>
    </div>
  )
}

export default Signup
