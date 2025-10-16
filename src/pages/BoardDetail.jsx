import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getBoardDetail } from "../api/board";
import handleServerError from "../utils/handleServerError";
import '../styles/BoardDetail.css';

const BoardDetail = () => {
  const { boardTypeCode, boardId } = useParams();
  const navigate = useNavigate();
  const [board, setBoard] = useState(null);

  useEffect(() => {
    const fetchBoard = async () => {
      try {
        const response = await getBoardDetail(boardId);
        setBoard(response.data);
      } catch (error) {
        handleServerError(error);
      }
    };
    fetchBoard();
  }, [boardId]);

  if (!board) return <div className="loading">로딩 중...</div>;

  return (
    <div className="board-detail">
      {/* 버튼 영역: 뒤로가기 / 수정 / 삭제 */}
      <div className="board-detail-actions">
        <button className="action-btn" onClick={() => navigate(-1)}>← 뒤로가기</button>
        {board.isOwner && (
          <>
            <button className="action-btn" onClick={() => navigate(`/board/${boardTypeCode}/edit/${board.boardId}`)}>수정</button>
            <button className="action-btn" onClick={() => alert("삭제 로직 추가 필요")}>삭제</button>
          </>
        )}
      </div>

      {/* 제목 */}
      <h2 className="board-detail-title">{board.title}</h2>

      {/* 메타 정보 */}
      <div className="board-detail-meta">
        <span>작성자: {board.writerName}</span>
        <span>조회수: {board.viewCount}</span>
        <span>좋아요: {board.likeCount}</span>
        <span>
          <span>
            {board.updatedAt ? "최근 수정일" : "작성일"}: {board.updatedAt ? board.updatedAt : board.createdAt}
          </span>
        </span>
      </div>

      {/* 게시글 내용 */}
      <div className="board-detail-content">
        <p>{board.content}</p>

        {/* 이미지 파일 */}
        {board.files && board.files.length > 0 && (
          <div className="board-detail-images">
            {board.files
              .filter(file => file.fileType.startsWith("image/"))
              .map(file => (
                <img
                  key={file.fileId}
                  src={file.filePath}
                  alt={file.originalName}
                  className="board-detail-image"
                />
              ))}
          </div>
        )}
      </div>

      {/* 첨부 파일 */}
      {board.files && board.files.length > 0 && (
        <div className="board-detail-files">
          <strong>첨부파일:</strong>
          <ul>
            {board.files.map((file) => (
              <li key={file.fileId}>
                <a
                  href={file.filePath}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {file.originalName}
                </a>
                <span> ({(file.fileSize / 1024).toFixed(2)} KB)</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 댓글 영역 (추후 추가) */}
      <div className="board-detail-comments">
        {/* 댓글 컴포넌트 추가 예정 */}
      </div>
    </div>
  );
};

export default BoardDetail;
