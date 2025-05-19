import React from "react";
import PaginationButton from "../atoms/PaginationButton";

interface AdvancedPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const AdvancedPagination: React.FC<AdvancedPaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  // If no pages, don't render anything
  if (totalPages <= 0) return null;

  // Function to generate page numbers with appropriate ellipses
  const getPageNumbers = () => {
    const pageNumbers: (number | string)[] = [];

    // Case 1: 5 or fewer pages - show all pages
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // Case 2: More than 5 pages - show with ellipses
    // Always add first page
    pageNumbers.push(1);

    // Calculate range around current page
    let startPage = Math.max(2, currentPage - 1);
    let endPage = Math.min(totalPages - 1, currentPage + 1);

    // Adjust range to always show 3 pages if possible
    if (currentPage <= 3) {
      // Near the start, show 2, 3, 4
      startPage = 2;
      endPage = Math.min(4, totalPages - 1);
    } else if (currentPage >= totalPages - 2) {
      // Near the end, show totalPages-3, totalPages-2, totalPages-1
      startPage = Math.max(2, totalPages - 3);
      endPage = totalPages - 1;
    }

    // Add ellipsis before middle pages if needed
    if (startPage > 2) {
      pageNumbers.push("...");
    }

    // Add middle pages
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    // Add ellipsis after middle pages if needed
    if (endPage < totalPages - 1) {
      pageNumbers.push("...");
    }

    // Always add last page
    pageNumbers.push(totalPages);

    return pageNumbers;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex justify-center mt-8">
      <div className="flex space-x-2">
        {/* Previous button */}
        <PaginationButton
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Prev
        </PaginationButton>

        {/* Page numbers */}
        {pageNumbers.map((page, index) => {
          if (page === "...") {
            return (
              <span
                key={`ellipsis-${index}`}
                className="px-3 py-1 text-gray-500 flex items-center"
              >
                ...
              </span>
            );
          }
          return (
            <PaginationButton
              key={`page-${page}`}
              onClick={() => onPageChange(page as number)}
              active={currentPage === page}
            >
              {page}
            </PaginationButton>
          );
        })}

        {/* Next button */}
        <PaginationButton
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </PaginationButton>
      </div>
    </div>
  );
};

export default AdvancedPagination;
