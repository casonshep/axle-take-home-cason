import React, { useState, useEffect } from 'react';
import { Part } from '../types';

interface PartListProps {
  parts: Part[];
  isSaving: boolean;
  hasUnsavedChanges: boolean;
  onRemovePart: (part: Part) => void;
}

export const PartList: React.FC<PartListProps> = ({ parts, isSaving, hasUnsavedChanges, onRemovePart }) => {

  const [inEditMode, setInEditMode] = useState(false);

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
      <h2 className="inventory-header">
        Parts Inventory ({parts.length} items)
        <div className="edit-toggle-container">
          <span className="edit-label">Delete Mode</span>
          <div
            onClick={() => setInEditMode(!inEditMode)}
            className={`toggle-slider ${inEditMode ? "on" : ""}`}
          > 
            <div className="toggle-knob" />
          </div>
        </div>
      </h2>

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
            {parts.map((part) => (
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

        <div className= "inventory-footer">
          <span className="unsaved-changes-text">{hasUnsavedChanges ? "You have unsaved changes" : ""}</span>
          <strong>Total Inventory Value: {getTotalValue()}</strong>
        </div>
      </div>
    </div>
  );
};
