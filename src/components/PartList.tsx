import React, { useState, useEffect } from 'react';
import { Part } from '../types';

interface PartListProps {
  parts: Part[];
  isSaving: boolean;
  onRemovePart: (part: Part) => void;
}

export const PartList: React.FC<PartListProps> = ({ parts, isSaving, onRemovePart }) => {

  const [inEditMode, setInEditMode] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isEditingPage, setIsEditingPage] = useState(false);
  const [pageInputValue, setPageInputValue] = useState('');
  
  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const newItemsPerPage = value === 'all' ? parts.length : parseInt(value);
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  const totalPages = Math.ceil(parts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedParts = parts.slice(startIndex, startIndex + itemsPerPage);

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

  useEffect(() => {

    if (parts.length === 0 || isSaving) {
      setInEditMode(false);
    }

  }, [parts.length, isSaving]);

  if (parts.length === 0) {
    return (
      <div className="card">
        <h2>Parts Inventory</h2>
        <div className="empty-state">
          <p>No parts in inventory</p>
          <p>Add your first part using the form on the left.</p>
        </div>
      </div>
    );
  }

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const getTotalValue = (): string => {
    const total = parts.reduce((sum, part) => sum + (part.quantity * part.price), 0);
    return formatPrice(total);
  };

  return (
    <div className="card">
      <h2 className="form-header">
        Parts Inventory
      </h2>
      <div className="inventory-info">
          <div className="inventory-control">
            <span>Show:</span>
            <select 
              className="items-per-page-select"
              value={itemsPerPage === parts.length ? 'all' : itemsPerPage.toString()}
              onChange={handleItemsPerPageChange}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="all">All</option>
            </select>
            <span>per page</span>
          </div>
          <div className="inventory-control">
            <span>Delete Mode</span>
            <div
              onClick={() => setInEditMode(!inEditMode)}
              className={`toggle-slider ${inEditMode ? "on" : ""}`}
            > 
              <div className="toggle-knob" />
            </div>
          </div>
        </div>

      <div className="parts-list">
        <table className="parts-table">
          <thead>
            <tr>
              {inEditMode && <th></th>}
              <th>Name</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Total Value</th>
            </tr>
          </thead>
          <tbody>
            {paginatedParts.map((part) => (
              <tr key={part.id}>
                {inEditMode && (
                  <td>
                    <button 
                      className="delete-btn"
                      onClick={() => onRemovePart(part)}
                      title="Delete part"
                    >
                      ×
                    </button>
                  </td>
                )}
                <td>{part.name}</td>
                <td>{part.quantity}</td>
                <td>{formatPrice(part.price)}</td>
                <td>{formatPrice(part.quantity * part.price)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        
        <div className="inventory-pagination">
          <button 
            className="pagination-btn" 
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          
          <div className="page-info">
            {isEditingPage ? (
              <span>
                Page{' '}
                <input
                  type="text"
                  className="page-input-minimal"
                  value={pageInputValue}
                  onChange={handlePageInputChange}
                  onKeyDown={handlePageKeyPress}
                  onBlur={handlePageSubmit}
                  autoFocus
                  placeholder={currentPage.toString()}
                />
                {' '}of {totalPages}
              </span>
            ) : (
              <span>
                Page{' '}
                <span className="page-number-clickable" onClick={handlePageEdit}>
                  {currentPage}
                </span>
                {' '}of {totalPages}
              </span>
            )}
          </div>
          
          <button 
            className="pagination-btn" 
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>

        <div className="inventory-footer">
          <span>Total Parts: {parts.length} </span>
          <strong>Total Inventory Value: {getTotalValue()}</strong>
        </div>
      </div>
    </div>
  );
};
