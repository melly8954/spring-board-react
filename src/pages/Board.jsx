import { Routes, Route } from "react-router-dom";
import ProfileBar from '../components/ProfileBar';
import BoardMenuBar from "../components/BoardMenuBar";
import { BoardList } from "../components/BoardList";

const Board = () => {
  return(
    <div>
      <ProfileBar />
      <BoardMenuBar />
      <Routes>
        <Route path=":boardTypeCode" element={<BoardList />} />
      </Routes>
    </div>
  )
}

export default Board;