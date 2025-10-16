import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Pagination from "./Pagination";
import SearchBar from "./SearchBar";
import { searchBoard } from "../api/board";
import handleServerError from "../utils/handleServerError";

function BoardList() {
  const navigate = useNavigate();
  const { boardTypeCode } = useParams();
  const [boards, setBoards] = useState([]);
  const [page, setPage] = useState(1);
  const [size] = useState(10);
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
    setPage(1);
    setSearchType("title");     // 검색 타입 초기화
    setSearchKeyword("");       // 검색 키워드 초기화

    fetchBoards({
      boardTypeCode,
      page: 1,
      searchType: "title",
      searchKeyword: ""
    });
  }, [boardTypeCode]);

  useEffect(() => {
    fetchBoards({ boardTypeCode, page, searchType, searchKeyword });
  }, [page]);

  // 검색창에서 값 변경
  const handleSearchChange = (changes) => {
    if (changes.searchType !== undefined) setSearchType(changes.searchType);
    if (changes.searchKeyword !== undefined) setSearchKeyword(changes.searchKeyword);
  };

  // 검색 버튼 클릭
  const handleSearchSubmit = () => {
    setPage(1);
    fetchBoards({ boardTypeCode, page: 1, searchType, searchKeyword });
  };

  // 이전 / 다음 버튼 클릭 핸들러
  const handlePrev = () => setPage(prev => Math.max(prev - 1, 1));
  const handleNext = () => setPage(prev => Math.min(prev + 1, totalPages));

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
      <button
        className="btn btn-primary mb-3"
        onClick={() => navigate("/board/create")}
      >
        게시글 등록
      </button>
      {/* 검색 영역 */}
      <SearchBar
        searchType={searchType}
        searchKeyword={searchKeyword}
        onSearchChange={handleSearchChange}
        onSearchSubmit={handleSearchSubmit}
      />
      {/* 페이지네이션 */}
      <Pagination
        page={page}
        totalPages={totalPages}
        onPrev={handlePrev}
        onNext={handleNext}
      />
    </div>
  );
}

export { BoardList };
