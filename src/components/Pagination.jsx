function Pagination({ page, totalPages, onPrev, onNext }) {
  return (
    <div className="pagination">
      <button onClick={onPrev} disabled={page <= 1}>이전</button>
      <span>{page} / {totalPages || 1}</span>
      <button onClick={onNext} disabled={page >= totalPages}>다음</button>
    </div>
  );
}

export default Pagination;