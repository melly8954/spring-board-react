import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { searchBoard } from "../api/board";
import handleServerError from "../utils/handleServerError";

function BoardList() {
  const { boardTypeCode } = useParams();
  const [boards, setBoards] = useState([]);
  const [page, setPage] = useState(1);
  const [size] = useState(10);
  const [searchType, setSearchType] = useState("title");       // 검색 타입 (title, content 등)
  const [searchKeyword, setSearchKeyword] = useState(""); // 검색 키워드
  const [totalPages, setTotalPages] = useState(1);

  const fetchBoards = async () => {
    try {
      const filter = { boardTypeCode, page, size, searchType, searchKeyword };
      const response = await searchBoard(filter);
      console.log(response);
      setBoards(response.data.content); // PageResponseDto.content 배열
      setTotalPages(response.data.totalPages);        // 총 페이지 수 상태에 저장
    } catch (error) {
      handleServerError(error);
    }
  };

  useEffect(() => {
    fetchBoards();
  }, [boardTypeCode, page, searchType, searchKeyword]);

  useEffect(() => {
    setPage(1);
  }, [boardTypeCode]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1); // 검색 시 1페이지부터 보여주기
    fetchBoards();
  };

  // 이전 / 다음 버튼 클릭 핸들러
  const handlePrev = () => setPage(prev => Math.max(prev - 1, 1));
  const handleNext = () => setPage(prev => Math.min(prev + 1, totalPages));

  return (
    <div className="board-list">
      {/* 검색 영역 */}
      <form onSubmit={handleSearch} className="board-search">
        <select value={searchType} onChange={(e) => setSearchType(e.target.value)}>
          <option value="title">제목</option>
          <option value="content">내용</option>
          <option value="writer">작성자</option>
        </select>
        <input
          type="text"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          placeholder="검색어를 입력하세요"
        />
        <button type="submit">검색</button>
      </form>

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

      {/* 페이지네이션 */}
      <div className="pagination">
        <button onClick={handlePrev} disabled={page <= 1}>이전</button>
        <span>{page} / {totalPages || 1}</span>
        <button onClick={handleNext} disabled={page >= totalPages}>다음</button>
      </div>
    </div>
  );
}

export { BoardList };
