import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Pagination from "./Pagination";
import SearchBar from "./SearchBar";
import { searchBoard } from "../api/board";
import handleServerError from "../utils/handleServerError";
import "../styles/boardList.css";

function BoardList() {
  const navigate = useNavigate();
  const { boardTypeCode } = useParams();
  const [boards, setBoards] = useState([]);
  const [page, setPage] = useState(1);
  const [size] = useState(5);
  const [searchType, setSearchType] = useState("title");       // 검색 타입 (title, content 등)
  const [searchKeyword, setSearchKeyword] = useState(""); // 검색 키워드
  const [totalPages, setTotalPages] = useState(1);

  const fetchBoards = async ({ boardTypeCode, page, searchType, searchKeyword }) => {
    try {
      const filter = { boardTypeCode, page, size, searchType, searchKeyword };
      const response = await searchBoard(filter);
      setBoards(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      handleServerError(error);
    }
  };

  useEffect(() => {
    fetchBoards({ boardTypeCode, page, searchType, searchKeyword });
  }, [boardTypeCode, page, searchType, searchKeyword]);

  
  useEffect(() => {
    setPage(1);
    setSearchType("title");     // 검색 타입 초기화
    setSearchKeyword("");       // 검색 키워드 초기화
  }, [boardTypeCode]);

  // 검색창에서 값 변경
  const handleSearchChange = (changes) => {
    if (changes.searchType !== undefined) setSearchType(changes.searchType);
    if (changes.searchKeyword !== undefined) setSearchKeyword(changes.searchKeyword);
    setPage(1);
  };

  return (
    <div className="board-list">
      {/* 게시글 리스트 */}
      <ul className="board-items">
        {boards.length > 0 ? (
          boards.map((board) => (
            <li key={board.boardId} className="board-item">
              {board.title}
            </li>
          ))
        ) : (
          <li>게시글이 없습니다.</li>
        )}
      </ul>
      <div className="btn-container">
        <button
          className="btn"
          onClick={() => navigate("/board/create")}
        >
          게시글 등록
        </button>
      </div>
      {/* 검색 영역 */}
      <SearchBar
        searchType={searchType}
        searchKeyword={searchKeyword}
        onSearchChange={handleSearchChange}
      />
      {/* 페이지네이션 */}
      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={(newPage) => setPage(newPage)}
      />
    </div>
  );
}

export { BoardList };
