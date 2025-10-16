import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Board from './pages/Board'
import BoardCreate from './pages/BoardCreate';
import BoardDetail from './pages/BoardDetail';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/board/*" element={<Board />} />
        <Route path="/board/create" element={<BoardCreate  />} />          
        <Route path="/board/:boardTypeCode/:boardId" element={<BoardDetail />} />
      </Routes>
    </Router>
  )
}

export default App
