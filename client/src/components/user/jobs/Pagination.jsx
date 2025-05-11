import React from 'react';
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const Pagination = ({ page, totalPages, setPage }) => {
  return (
    <div className="mt-8 flex items-center justify-end">
      <div className="flex items-center gap-2">
        <button
          onClick={() => setPage(p => Math.max(p - 1, 1))}
          disabled={page === 1}
          className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg ${
            page === 1 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          <FiChevronLeft className="mr-1" /> Previous
        </button>
        
        <div className="hidden sm:flex items-center gap-1">
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum;
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (page <= 3) {
              pageNum = i + 1;
            } else if (page >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = page - 2 + i;
            }
            
            return (
              <button
                key={pageNum}
                onClick={() => setPage(pageNum)}
                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                  page === pageNum
                    ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                } rounded-lg`}
              >
                {pageNum}
              </button>
            );
          })}
          {totalPages > 5 && page < totalPages - 2 && (
            <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 rounded-lg">
              ...
            </span>
          )}
        </div>
        
        <span className="text-sm text-gray-700 sm:hidden">
          Page {page} of {totalPages}
        </span>
        
        <button
          onClick={() => setPage(p => Math.min(p + 1, totalPages))}
          disabled={page === totalPages}
          className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg ${
            page === totalPages
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          Next <FiChevronRight className="ml-1" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;