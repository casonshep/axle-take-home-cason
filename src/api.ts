import { Part } from './types';

// Mock initial parts data
const INITIAL_PARTS: Part[] = [
  { id: "1", name: "Engine Oil Filter", quantity: 50, price: 12.99},
  { id: "2", name: "Brake Pads", quantity: 25, price: 45.5, dateUpdated: "2025-07-02" },
  { id: "3", name: "Air Filter", quantity: 30, price: 18.75},
  { id: "4", name: "Spark Plugs", quantity: 60, price: 6.5, dateUpdated: "2025-06-09" },
  { id: "5", name: "Timing Belt", quantity: 15, price: 120.0, dateUpdated: "2025-07-27" },
  { id: "6", name: "Alternator", quantity: 10, price: 220.0},
  { id: "7", name: "Battery", quantity: 18, price: 150.0},
  { id: "8", name: "Fuel Pump", quantity: 12, price: 185.0},
  { id: "9", name: "Water Pump", quantity: 14, price: 90.0, dateUpdated: "2025-05-29" },
  { id: "10", name: "Clutch Kit", quantity: 8, price: 275.0, dateUpdated: "2025-06-15" },
  { id: "11", name: "Headlights", quantity: 20, price: 65.0, dateUpdated: "2025-08-03" },
  { id: "12", name: "Tail Lights", quantity: 22, price: 55.0, dateUpdated: "2025-07-10" },
  { id: "13", name: "Radiator", quantity: 11, price: 180.0,},
  { id: "14", name: "Shock Absorbers", quantity: 16, price: 95.0, dateUpdated: "2025-08-25" },
  { id: "15", name: "Muffler", quantity: 9, price: 130.0, dateUpdated: "2025-06-20" },
  { id: "16", name: "Catalytic Converter", quantity: 7, price: 310.0, dateUpdated: "2025-07-06" },
  { id: "17", name: "Wiper Blades", quantity: 40, price: 12.0, dateUpdated: "2025-05-05" },
  { id: "18", name: "Transmission Fluid", quantity: 28, price: 25.0, dateUpdated: "2025-08-29" },
  { id: "19", name: "Brake Fluid", quantity: 35, price: 9.99, dateUpdated: "2025-09-01" },
  { id: "20", name: "Coolant", quantity: 30, price: 14.99, dateUpdated: "2025-04-12" },
  { id: "21", name: "Power Steering Pump", quantity: 10, price: 200.0, dateUpdated: "2025-06-03" },
  { id: "22", name: "Drive Belt", quantity: 19, price: 40.0, dateUpdated: "2025-07-31" },
  { id: "23", name: "Ignition Coil", quantity: 21, price: 65.0, dateUpdated: "2025-05-23" },
  { id: "24", name: "Turbocharger", quantity: 6, price: 850.0, dateUpdated: "2025-07-20" },
  { id: "25", name: "Supercharger", quantity: 4, price: 1250.0, dateUpdated: "2025-06-27" },
  { id: "26", name: "Oxygen Sensor", quantity: 26, price: 45.0, dateUpdated: "2025-09-05" },
  { id: "27", name: "Throttle Body", quantity: 9, price: 320.0, dateUpdated: "2025-08-07" },
  { id: "28", name: "Starter Motor", quantity: 12, price: 180.0, dateUpdated: "2025-04-22" },
  { id: "29", name: "Camshaft", quantity: 7, price: 400.0, dateUpdated: "2025-07-15" },
  { id: "30", name: "Crankshaft", quantity: 5, price: 600.0, dateUpdated: "2025-06-11" },
  { id: "31", name: "Pistons", quantity: 14, price: 55.0, dateUpdated: "2025-08-18" },
  { id: "32", name: "Cylinder Head", quantity: 6, price: 750.0, dateUpdated: "2025-05-08" },
  { id: "33", name: "Valve Cover", quantity: 18, price: 95.0, dateUpdated: "2025-07-24" },
  { id: "34", name: "Oil Pan", quantity: 10, price: 130.0, dateUpdated: "2025-06-06" },
  { id: "35", name: "Exhaust Manifold", quantity: 8, price: 275.0, dateUpdated: "2025-08-14" }
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
        reject(error);
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
