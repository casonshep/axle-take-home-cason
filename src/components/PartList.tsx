import React, { useState, useEffect, useMemo} from 'react';
import { Part } from '../types';
import { usePagination } from '../hooks/usePagination';

interface PartListProps {
  parts: Part[];
  isSaving: boolean;
  onRemovePart: (part: Part) => void;
}

export const PartList: React.FC<PartListProps> = ({ parts, isSaving, onRemovePart }) => {

  const [inEditMode, setInEditMode] = useState(false);

  const [sortField, setSortField] = useState<'Name'|'Quantity'|'Price'|'None'>('None');
  const [sortAscending, setSortAscending] = useState(true);

  const sortableColumns = [
    { field: 'Name' as const, label: 'Name' },
    { field: 'Quantity' as const, label: 'Quantity' },
    { field: 'Price' as const, label: 'Price' },
  ];

  const sortedParts = useMemo(() => {
    if (sortField === 'None') return parts;
    
    // copy before sorting
    const sorted = [...parts];
    
    switch (sortField) {
      case 'Name':
        return sorted.sort((a, b) => 
          sortAscending 
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name)
        );
      case 'Quantity':
        return sorted.sort((a, b) => 
          sortAscending 
            ? a.quantity - b.quantity
            : b.quantity - a.quantity
        );
      case 'Price':
        return sorted.sort((a, b) => 
          sortAscending 
            ? a.price - b.price
            : b.price - a.price
        );
      default:
        return sorted;
    }
  }, [parts, sortField, sortAscending]);

  const pagination = usePagination(sortedParts);

  useEffect(() => {

    if (parts.length === 0 || isSaving) {
      setInEditMode(false);
    }

  }, [parts.length, isSaving]);

  const handleSortChange = (field: 'Name'|'Quantity'|'Price'|'None') => {
    if (sortField === field) {
      if (!sortAscending) {
        setSortField('None'); //reset after cycling through sort options
      }
      setSortAscending(!sortAscending);
    } else {
      setSortField(field);
      setSortAscending(true);
    }
  };

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
              id="itemsPerPage"
              className="items-per-page-select"
              value={pagination.itemsPerPage === parts.length ? 'all' : pagination.itemsPerPage.toString()}
              onChange={(e) => {
                const value = e.target.value;
                const newItemsPerPage = value === 'all' ? parts.length : parseInt(value);
                pagination.setItemsPerPage(newItemsPerPage);
              }}
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
            {sortableColumns.map(({ field, label }) => (
              <th 
                key={field}
                className="sortable"
                onClick={() => handleSortChange(field)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && handleSortChange(field)}
              >
                {label}
                {sortField === field && (
                  <span className="sort-indicator">
                    {sortAscending ? '↑' : '↓'}
                  </span>
                )}
              </th>
            ))}
            <th>Total Value</th>
            <th>Last Update</th>
          </tr>
        </thead>
          <tbody>
            {pagination.paginatedItems.map((part) => (
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
                <td>{part.dateUpdated || 'No Data'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        
        <div className="inventory-pagination">
          <button 
            className="pagination-btn" 
            onClick={() => pagination.setCurrentPage(pagination.currentPage - 1)}
            disabled={pagination.currentPage <= 1}
          >
            Previous
          </button>
          
          <div className="page-info">
            {pagination.isEditingPage ? (
              <span>
                Page{' '}
                <input
                  type="text"
                  className="page-input-minimal"
                  value={pagination.pageInputValue}
                  onChange={pagination.handlePageInputChange}
                  onKeyDown={pagination.handlePageKeyPress}
                  onBlur={pagination.handlePageSubmit}
                  autoFocus
                  placeholder={pagination.currentPage.toString()}
                />
                {' '}of {pagination.totalPages}
              </span>
            ) : (
              <span>
                Page{' '}
                <span className="page-number-clickable" onClick={pagination.handlePageEdit}>
                  {pagination.currentPage}
                </span>
                {' '}of {pagination.totalPages}
              </span>
            )}
          </div>
          
          <button 
            className="pagination-btn" 
            onClick={() => pagination.setCurrentPage(pagination.currentPage + 1)}
            disabled={pagination.currentPage >= pagination.totalPages}
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
