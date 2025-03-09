interface PagenationProps {
  currentPage: number;
  totalPages: number | undefined;
  onPageChange: (page: number) => void;
}

export default function PageNations({currentPage, totalPages, onPageChange}: PagenationProps) {
  const pagesPerGroup = 10; 
  const currentGroup = Math.floor((currentPage - 1) / pagesPerGroup); 
  const startPage = currentGroup * pagesPerGroup + 1; 
  const endPage = Math.min(startPage + pagesPerGroup - 1, totalPages ?? 0); 

  return (
    <div className="flex justify-center items-center gap-2 mt-8">
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1} 
        className="px-3 py-2 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg hover:bg-gray-100"
      >
        <img src="/icons/ic-arrow-left.svg" alt="왼쪽 화살표" />
      </button>
      {totalPages &&
        [...Array(endPage - startPage + 1)].map((_, index) => {
          const pageNumber = startPage + index;
          return (
            <button
              key={pageNumber}
              onClick={() => onPageChange(pageNumber)}
              className={`px-3 py-[6px] rounded-lg hover:bg-gray-100 ${
                currentPage === pageNumber ? 'bg-white border border-gray-200' : ''
              }`}
            >
              {pageNumber}
            </button>
          );
        })}
      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages} 
        className="px-3 py-2 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg hover:bg-gray-100"
      >
        <img src="/icons/ic-arrow-right.svg" alt="오른쪽 화살표" />
      </button>
    </div>
  );
}
