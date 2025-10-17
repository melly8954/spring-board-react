import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getBoardDetail, deleteBoard, toggleBoardLike } from "../api/board";
import handleServerError from "../utils/handleServerError";
import '../styles/boardDetail.css';

const BoardDetail = () => {
  const { boardTypeCode, boardId } = useParams();
  const navigate = useNavigate();
  const [board, setBoard] = useState(null);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    const fetchBoard = async () => {
      try {
        const response = await getBoardDetail(boardId);
        setBoard(response.data);
        setLikeCount(response.data.likeCount);
        setLiked(response.data.isLiked);
      } catch (error) {
        handleServerError(error);
      }
    };
    fetchBoard();
  }, [boardId, liked]);

  if (!board) return <div className="loading">로딩 중...</div>;

  const handleDeleteBoard = async (boardId) => {
    try {
      const response = await deleteBoard(boardId);
      alert(response.message);
      navigate(`/board/${boardTypeCode}`);
    } catch (error) {
      handleServerError(error);
    }
  };

  const handleToggleLike = async () => {
    try {
      const response = await toggleBoardLike(boardId);
      alert(response.message);

      // UI 즉시 반영 (토글)
      setLiked(prev => !prev);
      setLikeCount(prev => liked ? prev - 1 : prev + 1);
    } catch (error) {
      handleServerError(error);
    }
  };

  return (
    <div className="board-detail">
      {/* 버튼 영역: 뒤로가기 / 수정 / 삭제 */}
      <div className="board-detail-actions">
        <button className="action-btn" onClick={() => navigate(`/board/${boardTypeCode}`)}>← 뒤로가기</button>
        {board.isOwner && (
          <>
            <button className="action-btn" onClick={() => navigate(`/board/${boardTypeCode}/update/${board.boardId}`)}>수정</button>
            <button className="action-btn" onClick={() => handleDeleteBoard(boardId)}>삭제</button>
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
        <h4>{board.boardType}</h4>
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

      {/* 좋아요 토글 */}
      <div className="board-detail-like">
        <button onClick={handleToggleLike} className="like-btn">
          {liked ? "💖" : "🤍"}
        </button>
        <div className="like-text">좋아요</div>
        <div className="like-count">{likeCount}</div>
      </div>

      {/* 댓글 영역 (추후 추가) */}
      <div className="board-detail-comments">
        {/* 댓글 컴포넌트 추가 예정 */}
      </div>
    </div>
  );
};

export default BoardDetail;
