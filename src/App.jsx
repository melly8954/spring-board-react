import { useState } from 'react'
import './css/app.css'

function App() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async () => {
      const data = await login(username, password)
      console.log(data)
    }
  
  const handleSignupRedirect = () => {
    // 예시: react-router 사용 시
    // navigate('/signup')
    console.log('회원가입 페이지로 이동')
  }
  return (
    <div className="app-container">
      <div className="login-box">
        <h2>로그인</h2>
        <input
          type="text"
          placeholder="아이디"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ marginBottom: 10, padding: 5 }}
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ marginBottom: 10, padding: 5 }}
        />
        <button className="auth-button" onClick={handleLogin}>
          로그인
        </button>
        <button className="auth-button" onClick={handleSignupRedirect}>
          회원가입
        </button>
      </div>
    </div>
  )
}

export default App
