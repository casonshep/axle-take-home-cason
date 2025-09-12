# Parts Inventory Management Take-Home Assignment

A React-based web application for managing parts inventory with TypeScript, featuring a clean interface for adding, viewing, and persisting parts data.

## Project Overview

This application provides a comprehensive parts inventory management system built with modern web technologies. Users can add new parts with validation, view the current inventory in a table format, delete unwanted parts, and save their inventory to localStorage for persistence.

The application features:
- **React with TypeScript** for type-safe component development
- **Mock API layer** simulating real backend interactions
- **Form validation** ensuring data integrity
- **Toast notifications** for user feedback
- **Responsive design** with clean, modern styling
- **localStorage persistence** for data retention

## Bug Fixes

### > Local Storage Bug Fix
**Bug:** The save functionality shows "Save successful!" but data doesn't actually persist when you refresh the page.

**Expected Functionality:** Users should be able to save their inventory and have it reload when they refresh the page or return to the application.

**Solution:** Fixed a variable name typo in `api.ts` so the proper parts list was serialized and saved upon `saveParts()` function call. 

**Approach:** First I looked in `App.tsx` to find which functions were being called when the save button was clicked. This led me to find the save handler and the `saveParts()` function from the mock api. It was apparent immediately that the steps that included serializing and saving the data to local storage (lines 67-68 in `api.ts`) contained the crux of the issue, and there was the typo. I fixed the typo and also editted this function slightly such that if an error was thrown during this process, `reject()` was called rather than `resolve()`, as this function was meant to return a promise reflecting the status of the request.

## New Features

### 1. Part Deletion with Safe Mode Toggle

**Overview:** Allows users to safely remove parts from their inventory with visual confirmation and unsaved changes tracking. The 'Delete Mode' toggle prevents accidental deletions by requiring explicit activation. Red × buttons appear next to each par tin inventory and only when delete mode is active. When changes are made to the inventory, the save button is updated to indicate there are unsaved changes to the inventory. Toast notifications confirm successful deletions.

**How to Use:**
1. **Enable Delete Mode**: Toggle the "Delete Mode" switch in the Parts Inventory section
2. **Select Parts to Delete**: Click the red × button next to any part you want to remove
3. **Save Changes**: Click "Save Inventory" to make deletions permanent
   - The button will show "(Unsaved Changes)" until you save

### 2. Pagination System for Large Inventories

**Overview:** Efficiently handles large inventories with customizable page sizes and intuitive navigation. Users are able to choose how many inventory items are displayed on each page from 5, 10, 25, 50 items or view all. User's are also able to manually chose a page they would like to view, making large inventory traversal more robust.

**How to Use:**
1. **Change Page Size**: Use the dropdown to select how many items to show per page. 
   - Default is 10
2. **Navigate Pages**: Use Previous/Next buttons to step through pages
3. **Quick Page Jump**: Click the current page number, type a new page, press Enter


### 3. Dynamic Multi-Column Sorting

**Overview:** Allows inventory organization by part name, quantitiy, or price with visual sort indicators. The sorting for each property is able to switched to ascending, descending, or off. When sortable table properties are clicked, a visual arrow appears to show which property is being sorted and in which direction. After cycling through ascending or descending options, sort is removed and original order is restored.

**How to Use:**
1. **Sort by Column**: Click any column header from Name, Quantity, or Price
2. **Change Direction**: Click again to reverse sort order
3. **Reset Sorting**: Click a third time to return to original order

**Sorting Options:**
- **Name**: Alphabetical (A-Z / Z-A)
- **Quantity**: Numerical (Low-High / High-Low)  
- **Price**: Numerical (Low-High / High-Low)

### 4. Audit Trail with Last Update Tracking

**Overview:** Provides comprehensive tracking of inventory changes with automatic timestamping. Parts now have an optional property: dateUpdated, which may store when the part was updated in the inventory (YYYY-MM-DD). This creates a clear audit trail for inventory management. New parts automatically receive the current date, and the information is preserved through save/load operations. Parts that may have been added to the database without the 'dateUpdated' property will be listed with 'No Data' in that table collumn instead.

**How it Works:**
1. **Automatic Timestamping**: When adding new parts, the system automatically sets the `dateUpdated` field to the current date (YYYY-MM-DD format)
2. **Visual Display**: The "Last Update" column in the inventory table shows when each part was last modified
3. **backward Compatability**: The storage system checks if `dateUpdated` exists for parts during inventory redering operation, displaying 'No Data' if not


## How to Run

### Prerequisites
- Node.js (version 16 or higher)
- npm (comes with Node.js)

### Installation & Setup
1. Clone or download this repository
2. Navigate to the project directory
3. Install dependencies:
   ```bash
   npm install
   ```

### Development
Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or another port if 5173 is occupied).

### Building for Production
Create a production build:
```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
src/
├── components/
│   ├── PartForm.tsx      # Form component for adding new parts
│   └── PartList.tsx      # Table component for displaying parts with pagination and sorting
├── hooks/
│   └── usePagination.ts  # Custom hook for pagination functionality
├── App.tsx               # Main application component
├── main.tsx              # Application entry point
├── types.ts              # TypeScript type definitions (includes Part interface with dateUpdated)
├── api.ts                # Mock API functions with localStorage persistence
└── index.css             # Application styles
```

## Technical Stack

- **Frontend Framework:** React 18 with TypeScript
- **Build Tool:** Vite
- **Styling:** Custom CSS with responsive design
- **Notifications:** react-toastify
- **State Management:** React useState hooks
- **Data Persistence:** localStorage (mock backend)

---