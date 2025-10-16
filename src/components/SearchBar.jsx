function SearchBar({ searchType, searchKeyword, onSearchChange }) {
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
    </div>
  );
}

export default SearchBar;