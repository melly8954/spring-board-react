import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getBoardTypes  } from "../api/board";
import handleServerError from "../utils/handleServerError";
import "../styles/BoardMenuBar.css";

function BoardMenuBar() {
   const [boardTypes, setBoardTypes] = useState([]);
   const { boardTypeCode } = useParams();

  useEffect(() => {
    const fetchBoardTypes = async () => {
      try {
        const response = await getBoardTypes();
        setBoardTypes(response.data); 
      } catch (error) {
        handleServerError(error);
      }
    };
    fetchBoardTypes();
  }, []);

  return (
    <nav className="board-menu-bar">
      <ul>
        {boardTypes.map((type) => (
          <li key={type.boardTypeId} className={boardTypeCode === type.boardTypeCode ? "active" : ""}>
            <Link to={`/board/${type.boardTypeCode}`}>
              {type.boardTypeName}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
} 

export default BoardMenuBar;
