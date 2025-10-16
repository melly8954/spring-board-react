import "../styles/Pagination.css";

function Pagination({ page, totalPages, onPageChange }) {
  const maxPageButtons = 5; 
  const startPage = Math.floor((page - 1) / maxPageButtons) * maxPageButtons + 1;
  const endPage = Math.min(startPage + maxPageButtons - 1, totalPages);

  const pages = [];
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className="pagination">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className="page-btn"
      >
        이전
      </button>

      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`page-btn ${p === page ? "active" : ""}`}
        >
          {p}
        </button>
      ))}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className="page-btn"
      >
        다음
      </button>
    </div>
  );
}

export default Pagination;