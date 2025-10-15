// src/components/SearchBar.jsx
import { useState } from "react";

function SearchBar({ onSearch }) {
  const [searchType, setSearchType] = useState("title");
  const [searchKeyword, setSearchKeyword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({ searchType, searchKeyword });
  };

  return (
    <form onSubmit={handleSubmit} className="board-search">
      <select
        value={searchType}
        onChange={(e) => setSearchType(e.target.value)}
      >
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
  );
}

export default SearchBar;