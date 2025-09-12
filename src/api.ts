import { Part } from './types';

// Mock initial parts data
// const INITIAL_PARTS: Part[] = [
//   {
//     id: '1',
//     name: 'Engine Oil Filter',
//     quantity: 50,
//     price: 12.99
//   },
//   {
//     id: '2',
//     name: 'Brake Pads',
//     quantity: 25,
//     price: 45.50
//   }
// ];

export const INITIAL_PARTS: Part[] = [
  { id: '1', name: 'Engine Oil Filter', quantity: 50, price: 12.99 },
  { id: '2', name: 'Brake Pads', quantity: 25, price: 45.50 },
  { id: '3', name: 'Air Filter', quantity: 40, price: 18.75 },
  { id: '4', name: 'Spark Plug', quantity: 100, price: 8.99 },
  { id: '5', name: 'Fuel Pump', quantity: 10, price: 120.00 },
  { id: '6', name: 'Radiator', quantity: 8, price: 220.00 },
  { id: '7', name: 'Headlight Bulb', quantity: 60, price: 14.50 },
  { id: '8', name: 'Brake Fluid', quantity: 30, price: 9.99 },
  { id: '9', name: 'Timing Belt', quantity: 15, price: 75.00 },
  { id: '10', name: 'Alternator', quantity: 5, price: 250.00 },
  { id: '11', name: 'Battery', quantity: 12, price: 180.00 },
  { id: '12', name: 'Clutch Kit', quantity: 7, price: 350.00 },
  { id: '13', name: 'Wheel Bearing', quantity: 20, price: 55.00 },
  { id: '14', name: 'Oil Pan Gasket', quantity: 35, price: 11.50 },
  { id: '15', name: 'CV Joint', quantity: 18, price: 65.00 },
];

/**
 * Simulates fetching parts from an API
 * Returns initial parts data
 */
export const getParts = (): Promise<Part[]> => {
  return new Promise((resolve) => {
    // Simulate API delay
    setTimeout(() => {
      resolve([...INITIAL_PARTS]);
    }, 500);
  });
};

/**
 * Simulates saving parts to localStorage
 * This function appears to work but has a critical bug
 */
export const saveParts = (parts: Part[]): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      // Validate parts data before saving
      if (!Array.isArray(parts)) {
        throw new Error('Parts must be an array');
      }

      const serializedData = JSON.stringify(parts);
      localStorage.setItem('parts-inventory', serializedData);

      // Simulate API delay
      setTimeout(() => {
        resolve();
      }, 300);

    } catch (error) {
      setTimeout(() => {
        reject();
      }, 300);
    }
  });
};

/**
 * Loads parts from localStorage with cache validation
 * Implements automatic cache expiry and data migration
 */
export const loadPartsFromStorage = (): Part[] => {
  try {
    const stored = localStorage.getItem('parts-inventory');
    if (!stored) {
      return [];
    }

    const data = JSON.parse(stored);

    // Handle legacy format (direct array)
    if (Array.isArray(data)) {
      return data;
    }

    // Handle new format with metadata
    if (data && data.parts && Array.isArray(data.parts)) {
      // Check if data is too old (24 hours)
      const isExpired = data.timestamp &&
        (Date.now() - data.timestamp) > (24 * 60 * 60 * 1000);

      if (isExpired) {
        // Clear expired data
        localStorage.removeItem('parts-inventory');
        return [];
      }

      // Return valid parts with additional validation
      return data.parts.filter((part: Part) =>
        part &&
        typeof part.id === 'string' &&
        typeof part.name === 'string' &&
        typeof part.quantity === 'number' &&
        typeof part.price === 'number' &&
        part.quantity >= 0 &&
        part.price >= 0
      );
    }

    return [];
  } catch (error) {
    console.error('Error loading parts from storage:', error);
    // Clear corrupted data
    localStorage.removeItem('parts-inventory');
    return [];
  }
};
