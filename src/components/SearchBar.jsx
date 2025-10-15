function SearchBar({ searchType, searchKeyword, onSearchChange, onSearchSubmit }) {
  return (
    <div className="board-search">
      <select
        value={searchType}
        onChange={(e) => onSearchChange({ searchType: e.target.value })}
      >
        <option value="title">제목</option>
        <option value="content">내용</option>
        <option value="writer">작성자</option>
      </select>

      <input
        type="text"
        value={searchKeyword}
        onChange={(e) => onSearchChange({ searchKeyword: e.target.value })}
        placeholder="검색어를 입력하세요"
      />

      <button type="button" onClick={onSearchSubmit}>
        검색
      </button>
    </div>
  );
}

export default SearchBar;