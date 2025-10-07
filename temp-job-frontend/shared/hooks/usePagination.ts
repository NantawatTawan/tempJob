import { useState } from "react";

interface IPaginationProps<T> {
  datas: T[];
  rowsPerPage: number;
}

export function usePagination<T>({ datas, rowsPerPage }: IPaginationProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(datas.length / rowsPerPage);

  const paginatedDatas = datas.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  function onNextPage() {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  }

  function onPreviousPage() {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  }

  function onResetPage() {
    setCurrentPage(1);
  }

  return {
    paginatedDatas,
    currentPage,
    totalPages,
    onNextPage,
    onPreviousPage,
    onGoToPage: (page: number) => setCurrentPage(page),
    indexOfFirstItem: (currentPage - 1) * rowsPerPage,
    indexOfLastItem: Math.min(currentPage * rowsPerPage, datas.length),
    onResetPage,
  };
}
