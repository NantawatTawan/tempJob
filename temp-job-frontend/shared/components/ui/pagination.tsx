import React from "react";
import { Button } from "./button";

interface IPaginationProps {
  totalPages: number;
  currentPage: number;
  onPreviousPage: () => void;
  onNextPage: () => void;
  onGoToPage: (page: number) => void;
  indexOfFirstItem: number;
  indexOfLastItem: number;
  datas: any[];
}

const Pagination = ({
  totalPages,
  currentPage,
  onPreviousPage,
  onNextPage,
  onGoToPage,
  indexOfFirstItem,
  indexOfLastItem,
  datas,
}: IPaginationProps) => {
  return (
    totalPages > 1 && (
      <div className="flex justify-between items-center mt-4 px-6 py-3 bg-white border-t border-gray-200">
        <div className="text-sm text-gray-700">
          แสดง {indexOfFirstItem + 1} ถึง{" "}
          {Math.min(indexOfLastItem, datas?.length || 0)} จากทั้งหมด{" "}
          {datas?.length || 0} รายการ
        </div>
        <div className="flex space-x-2">
          <Button
            onClick={onPreviousPage}
            disabled={currentPage === 1}
            variant="outline"
            size="sm"
          >
            ← ก่อนหน้า
          </Button>
          <div className="flex items-center space-x-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(
                (page) =>
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1)
              )
              .map((page, index, array) => (
                <div key={page} className="flex items-center">
                  {index > 0 && array[index - 1] !== page - 1 && (
                    <span className="px-2">...</span>
                  )}
                  <Button
                    onClick={() => onGoToPage(page)}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                  >
                    {page}
                  </Button>
                </div>
              ))}
          </div>
          <Button
            onClick={onNextPage}
            disabled={currentPage === totalPages}
            variant="outline"
            size="sm"
          >
            ถัดไป →
          </Button>
        </div>
      </div>
    )
  );
};

export default Pagination;
