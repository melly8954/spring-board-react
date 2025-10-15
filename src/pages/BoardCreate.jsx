import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getBoardTypes, createBoard } from "../api/board";
import handleServerError from '../utils/handleServerError';

const BoardCreate = () => {
  const navigate = useNavigate();
  const [boardTypes, setBoardTypes] = useState([]);
  const [boardTypeId, setBoardTypeId] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState([]);

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
    setFiles(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
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

      <input type="file" multiple onChange={handleFileChange} />

      <button onClick={handleSubmit}>등록</button>
    </div>
  );
};

export default BoardCreate;