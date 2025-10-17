import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getBoardTypes, createBoard } from "../api/board";
import handleServerError from '../utils/handleServerError';
import '../styles/BoardCreate.css';

const BoardCreate = () => {
  const navigate = useNavigate();
  const [boardTypes, setBoardTypes] = useState([]);
  const [boardTypeId, setBoardTypeId] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState([]);
  const [fileInputKey, setFileInputKey] = useState(Date.now());

  // 게시판 타입 불러오기
  useEffect(() => {
    const fetchBoardTypes = async () => {
      try {
        const response = await getBoardTypes();
        console.log(response.data);
        setBoardTypes(response.data);
        if (response.data.length > 0) setBoardTypeId(response.data[0].boardTypeId); // 기본 선택
      } catch (error) {
        handleServerError(error);
      }
    };
    fetchBoardTypes();
  }, []);

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);

    // 단일 파일 검사
    for (const file of newFiles) {
      if (file.size > 10 * 1024 * 1024) {
        setFiles([]);
        setFileInputKey(Date.now()); // input 초기화
        alert(`파일 "${file.name}"의 용량이 10MB를 초과했습니다.`);
        return;
      }
    }

    // 총합 검사
    const totalSize = [...files, ...newFiles].reduce((acc, f) => acc + f.size, 0);
    if (totalSize > 20 * 1024 * 1024) {
      setFiles([]);
      setFileInputKey(Date.now()); // input 초기화
      alert("선택된 파일들의 총 용량이 20MB를 초과했습니다.");
      return;
    }

    setFiles((prev) => [...prev, ...newFiles]);
  };

  const handleRemoveFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setFileInputKey(Date.now()); // 삭제 후 input 초기화
  };

  const handleSubmit = async (e) => {
    if (!title.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }
    if (!content.trim()) {
      alert("내용을 입력해주세요.");
      return;
    }

    const formData = new FormData();
    const dto = { boardTypeId, title, content };
    formData.append("data", new Blob([JSON.stringify(dto)], { type: "application/json" }));
    files.forEach(file => formData.append("files", file));

    try {
      const response = await createBoard(formData);
      alert(response.message);

      // 선택된 boardTypeId에 맞는 name 찾기
      const selectedType = boardTypes.find(
        (type) => type.boardTypeId === Number(boardTypeId)
      );

      // 예외 처리 (혹시 못 찾을 경우)
      if (!selectedType) {
        console.warn("선택된 게시판 타입을 찾지 못했습니다.");
        return;
      }

      // 게시판 이름으로 이동
      navigate(`/board/${selectedType.boardTypeCode}`);
    } catch (error) {
      handleServerError(error);
    }
  };

  return (
    <div className="board-create">
      <h2>게시글 작성</h2>
      <label>
        게시판 종류:
        <select
          value={boardTypeId}
          onChange={(e) => setBoardTypeId(e.target.value)}
        >
          {boardTypes.map((type) => (
            <option key={type.boardTypeId} value={type.boardTypeId}>
              {type.boardTypeName} {/* API에서 받아오는 필드 이름에 맞춰서 */}
            </option>
          ))}
        </select>
      </label>
      <label>
        제목:
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </label>

      <label>
        내용:
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </label>

      <input
        key={fileInputKey}
        type="file"
        multiple
        onChange={handleFileChange}
      />
      <div className="file-list">
        <strong>선택된 파일 목록:</strong>
        {files.map((file, index) => (
          <div key={index} className="file-item">
            <span>{file.name}</span>
            <button type="button" onClick={() => handleRemoveFile(index)}>❌</button>
          </div>
        ))}
      </div>

      <div className="board-create-buttons">
        <button onClick={handleSubmit}>등록</button>
        <button
          type="button"
          className="back-btn"
          onClick={() => navigate(-1)}
        >
          뒤로가기
        </button>
      </div>
    </div>
  );
};

export default BoardCreate;