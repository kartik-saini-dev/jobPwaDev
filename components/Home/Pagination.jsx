const Pagination = ({ totalPages, onPageChange, currentPage }) => {
  const current_Page = currentPage;
  const range = (start, end) =>
    Array.from({ length: end - start + 1 }, (_, i) => start + i);

  const showEllipses = totalPages > 8;

  return (
    <div className="flex items-center justify-center mt-4">
      <button
        className={`px-4 py-2 mx-1 text-white bg-custom-dark-mint-green rounded-lg hover:bg-custom-dark-mint-green transition duration-300 ${
          current_Page === 1 ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        onClick={() => onPageChange(Math.max(current_Page - 1, 1))}
        disabled={current_Page === 1}
      >
        Prev
      </button>

      {showEllipses && current_Page > 4 && (
        <>
          <button
            className="px-4 py-2 mx-1 text-blue-600 bg-white border border-custom-dark-mint-green  rounded-lg hover:bg-custom-dark-mint-green  transition duration-300"
            onClick={() => onPageChange(1)}
          >
            1
          </button>
          <span className="mx-1 text-gray-500">...</span>
        </>
      )}

      {range(
        Math.max(1, current_Page - 3),
        Math.min(totalPages, current_Page + 4)
      ).map((page) => (
        <button
          key={page}
          className={`px-4 py-2 mx-1 rounded-lg transition duration-300 ${
            page === current_Page
              ? 'bg-custom-dark-mint-green  text-white'
              : 'bg-white text-blue-600 border border-custom-dark-mint-green  hover:custom-dark-mint-green '
          }`}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}

      {showEllipses && current_Page < totalPages - 3 && (
        <>
          <span className="mx-1 text-gray-500">...</span>
          <button
            className="px-4 py-2 mx-1 text-custom-dark-mint-green  bg-white border border-custom-dark-mint-green  rounded-lg hover:bg-custom-dark-mint-green transition duration-300"
            onClick={() => onPageChange(totalPages)}
          >
            {totalPages}
          </button>
        </>
      )}

      <button
        className={`px-4 py-2 mx-1 text-white bg-custom-dark-mint-green  rounded-lg hover:bg-custom-dark-mint-green  transition duration-300 ${
          current_Page === totalPages ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        onClick={() => onPageChange(Math.min(current_Page + 1, totalPages))}
        disabled={current_Page === totalPages}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
