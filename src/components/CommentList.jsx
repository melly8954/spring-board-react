import { useEffect, useState } from "react";
import { getComments, addComment, deleteComment, toggleCommentLike } from "../api/comment";
import Pagination from "./Pagination";
import handleServerError from "../utils/handleServerError";
import styles from "../styles/CommentList.module.css"; // import CSS Module

const CommentList = ({ boardId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState(null); // 대댓글 작성 대상
  const [page, setPage] = useState(1);
  const [size] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [openReplyId, setOpenReplyId] = useState(null);

  // 댓글 목록 조회
  useEffect(() => {
    fetchComments();
  }, [boardId, page, size]);

  // 댓글 목록 조회
  const fetchComments = async () => {
    try {
      const filter = { boardId, page, size };
      const response = await getComments(filter);
      setComments(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      handleServerError(error);
    }
  };

  // 새 댓글 작성
  const handleAddComment = async () => {
    if (!newComment.trim()) {
      alert("댓글 내용을 작성하세요.");
      return;
    }

    const dto = {
      boardId,
      parentCommentId: null,
      content: newComment,
    };

    try {
      await addComment(dto);
      setNewComment("");
      setReplyTo(null);

      // 작성 후 댓글 목록 갱신
      fetchComments();
    } catch (error) {
      handleServerError(error);
    }
  };

  // 댓글 삭제
  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(commentId);
      fetchComments();
    } catch (error) {
      handleServerError(error);
    }
  };

  // 답글창 열기/닫기 토글
  const toggleReplyForm = (commentId) => {
    setOpenReplyId((prev) => (prev === commentId ? null : commentId));
  };

  return (
    <div className={styles.commentList}>
      <h3 className={styles.heading}>댓글</h3>

      {/* 부모 댓글 작성 */}
      <div className={styles.commentForm}>
        <textarea
          className={styles.textarea}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="댓글을 입력하세요"
        />
        <button className={styles.submitButton} onClick={handleAddComment}>
          등록
        </button>
      </div>

      {comments.length === 0 ? (
        <div>댓글이 없습니다.</div>
      ) : (
        comments.map((comment) => (
          <CommentItem
            key={comment.commentId}
            comment={comment}
            onDelete={handleDeleteComment}
            styles={styles}
            boardId={boardId}
            fetchComments={fetchComments}
            openReplyId={openReplyId}
            toggleReplyForm={toggleReplyForm}
          />
        ))
      )}

      {/* 페이지네이션 */}
      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={(newPage) => setPage(newPage)}
      />
    </div>
  );
};

// 댓글 + 대댓글 재귀 컴포넌트
const CommentItem = ({ comment, onDelete, styles, boardId, fetchComments, openReplyId, toggleReplyForm }) => {
  const [replyContent, setReplyContent] = useState("");

  const handleAddReply = async () => {
    if (!replyContent.trim()) {
      alert("댓글 내용을 작성하세요.");
      return;
    }

    try {
      await addComment({
        boardId,
        parentCommentId: comment.commentId,
        content: replyContent,
      });
      setReplyContent("");
      toggleReplyForm(comment.commentId);
      fetchComments();
    } catch (error) {
      handleServerError(error);
    }
  };

  const handleToggleLike = async (commentId) => {
    try {
      // API 호출
      await toggleCommentLike(commentId);
      fetchComments(); 
    } catch (error) {
      handleServerError(error);
    }
  };

  return (
    <div
      className={styles.commentItem}
      style={{ marginLeft: comment.parentCommentId ? 20 : 0 }}
    >
      <div className={styles.commentHeader}>
        <strong>{comment.writerName}</strong>
      </div>
      <div className={styles.commentContent}>
        {comment.status === "DELETED" ? "삭제된 댓글입니다." : comment.content}
      </div>
      <span className={styles.commentDate}>{comment.createdAt}</span>
      <br></br>

      {/* 좋아요 버튼 */}
      {comment.status === "ACTIVE" && (
        <button
          className={styles.likeButton}
          onClick={() => handleToggleLike(comment.commentId)}
        >
          {comment.isLiked ? "❤️" : "🤍"} {comment.likeCount}
        </button>
      )}

      {comment.status === "ACTIVE" && (
        <>
          <button
            className={styles.commentButton}
            onClick={() => toggleReplyForm(comment.commentId)}
          >
            답글
          </button>

          {comment.isOwner && (
            <button
              className={`${styles.commentButton} ${styles.commentDelete}`}
              onClick={() => onDelete(comment.commentId)}
            >
              삭제
            </button>
          )}
        </>
      )}

      {/* 답글 입력창 (openReplyId 기준으로 열림) */}
      {openReplyId === comment.commentId && (
        <div className={styles.commentForm}>
          <textarea
            className={styles.textarea}
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="답글을 입력하세요"
          />
          <div className={styles.buttonGroup}>
            <button className={styles.submitButton} onClick={handleAddReply}>
              등록
            </button>
            <button
              className={`${styles.cancelButton}`}
              onClick={() => toggleReplyForm(comment.commentId)}
            >
              취소
            </button>
          </div>
        </div>
      )}

      {/* 대댓글 재귀 렌더링 */}
      {comment.children?.length > 0 &&
        comment.children.map((child) => (
          <CommentItem
            key={child.commentId}
            comment={child}
            onDelete={onDelete}
            styles={styles}
            boardId={boardId}
            fetchComments={fetchComments}
            openReplyId={openReplyId}
            toggleReplyForm={toggleReplyForm}
          />
        ))}
    </div>
  );
};

export default CommentList;
