import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getBoardDetail, updateBoard } from "../api/board";
import handleServerError from "../utils/handleServerError";
import styles from '../styles/boardUpdate.module.css';

function BoardUpdate() {
  const { boardTypeCode, boardId } = useParams();
  const navigate = useNavigate();
  const [board, setBoard] = useState({
    title: "",
    content: "",
    files: []
  });
  const [newFiles, setNewFiles] = useState([]);
  const [removeFileIds, setRemoveFileIds] = useState([]);

  // 게시글 상세 불러오기
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBoard((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setNewFiles([...e.target.files]);
  };

  // 기존 파일 제거 (UI + 삭제 목록에 추가)
  const handleRemoveOldFile = (fileId) => {
    setBoard((prev) => ({
      ...prev,
      files: prev.files.filter((file) => file.fileId !== fileId),
    }));
    setRemoveFileIds((prev) => [...prev, fileId]);
  };

  // 저장 (formData 직접 구성)
  const handleSave = async (e) => {
    try {
      const formData = new FormData();
      const dto = {
        title: board.title,
        content: board.content,
        removeFileIds: removeFileIds,
      };
      formData.append("data", new Blob([JSON.stringify(dto)], { type: "application/json" }));
      newFiles.forEach(file => formData.append("files", file));

      await updateBoard(boardId, formData);
      console.log("a :" + boardTypeCode);
      navigate(`/board/${boardTypeCode}/${boardId}`);
    } catch (error) {
      handleServerError(error);
    }
  };

  return (
    <div className={styles.boardUpdate}>
      <div className={styles.boardUpdateActions}>
        <button className={styles.actionBtn} onClick={() => navigate(-1)}>← 뒤로가기</button>
      </div>

      <h2 className={styles.boardUpdateTitle}>게시글 수정</h2>

      <div>
        <div className={styles.formGroup}>
          <label>제목</label>
          <input
            type="text"
            name="title"
            value={board.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>내용</label>
          <textarea
            name="content"
            value={board.content}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>첨부파일</label>
          <input type="file" multiple onChange={handleFileChange} />
        </div>

        {board.files && board.files.length > 0 && (
          <div className={styles.boardUpdateFiles}>
            <strong>기존 첨부파일</strong>
            <ul>
              {board.files.map((file) => (
                <li key={file.fileId}>
                  {file.originalName}
                  <button
                    type="button"
                    className={styles.fileRemoveBtn}
                    onClick={() => handleRemoveOldFile(file.fileId)}
                  >
                    ❌
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <button type="button" className={styles.actionBtn} onClick={handleSave}>
          저장
        </button>
      </div>
    </div>
  );
}

export default BoardUpdate;
