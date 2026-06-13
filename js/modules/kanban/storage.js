/* =====================================
   KANBAN STORAGE
   Handles saving and loading the full
   board state from localStorage.
===================================== */

const STORAGE_KEY = "kanbanBoard";

// Save the entire board object to localStorage.
export function saveBoard(board) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(board));
}

// Load the board from localStorage.
// Returns null when nothing has been saved yet.
export function loadBoard() {
  const raw = localStorage.getItem(STORAGE_KEY);

  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    // Corrupted data — start fresh instead of crashing.
    return null;
  }
}
