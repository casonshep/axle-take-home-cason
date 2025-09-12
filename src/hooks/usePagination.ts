import { useState } from 'react';

export const usePagination = <T>(items: T[], defaultItemsPerPage: number = 10) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(defaultItemsPerPage);
  const [isEditingPage, setIsEditingPage] = useState(false);
  const [pageInputValue, setPageInputValue] = useState('');

  const totalPages = Math.ceil(items.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedItems = items.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page
  };

  const handlePageEdit = () => {
    setIsEditingPage(true);
    setPageInputValue(currentPage.toString());
  };

  const handlePageSubmit = () => {
    const newPage = parseInt(pageInputValue);
    if (!isNaN(newPage) && newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
    setIsEditingPage(false);
    setPageInputValue('');
  };

  const handlePageKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handlePageSubmit();
    } else if (e.key === 'Escape') {
      setIsEditingPage(false);
      setPageInputValue('');
    }
  };

  const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPageInputValue(e.target.value);
  };

  return {
    // State
    currentPage,
    totalPages,
    itemsPerPage,
    paginatedItems,
    isEditingPage,
    pageInputValue,

    // Actions
    setCurrentPage: handlePageChange,
    setItemsPerPage: handleItemsPerPageChange,
    handlePageEdit,
    handlePageSubmit,
    handlePageKeyPress,
    handlePageInputChange,
  };
};
