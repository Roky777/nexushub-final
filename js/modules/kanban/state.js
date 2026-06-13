/* =====================================
   KANBAN STATE
   The single source of truth for the board.

   Shape:
   board = {
     columns: [
       { id, title, cards: [ { id, text } ] }
     ]
   }

   Every mutation here updates the in-memory
   board and persists it. Rendering is handled
   elsewhere (render.js).
===================================== */

import { saveBoard, loadBoard } from "./storage.js";

// Header colors used for the columns. New columns
// pick the next color from this list (then loop back).
const COLUMN_COLORS = [
  "#14b8a6", // teal
  "#3b82f6", // blue
  "#8b5cf6", // purple
  "#f59e0b", // amber
  "#ef4444", // red
];

// Pick a color for a column based on its position.
function pickColor(index) {
  return COLUMN_COLORS[index % COLUMN_COLORS.length];
}

// Default board used on first visit.
function createDefaultBoard() {
  return {
    columns: [
      { id: createId(), title: "To Do", color: pickColor(0), cards: [] },
      { id: createId(), title: "In Progress", color: pickColor(1), cards: [] },
      { id: createId(), title: "Done", color: pickColor(2), cards: [] },
    ],
  };
}

// Generate a unique id for columns and cards.
function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

// The live board. Loaded from storage or created fresh.
let board = loadBoard() || createDefaultBoard();

// Older saved boards may not have colors yet — fill them in
// so every column header always has a color to show.
board.columns.forEach((column, index) => {
  if (!column.color) column.color = pickColor(index);
});

// Persist after every change.
function commit() {
  saveBoard(board);
}

/* ---------- Reads ---------- */

export function getBoard() {
  return board;
}

function findColumn(columnId) {
  return board.columns.find((column) => column.id === columnId);
}

/* ---------- Column actions ---------- */

export function addColumn(title) {
  const cleanTitle = title.trim();
  if (!cleanTitle) return;

  board.columns.push({
    id: createId(),
    title: cleanTitle,
    color: pickColor(board.columns.length),
    cards: [],
  });
  commit();
}

export function deleteColumn(columnId) {
  board.columns = board.columns.filter((column) => column.id !== columnId);
  commit();
}

export function renameColumn(columnId, title) {
  const column = findColumn(columnId);
  const cleanTitle = title.trim();

  if (!column || !cleanTitle) return;

  column.title = cleanTitle;
  commit();
}

/* ---------- Card actions ---------- */

export function addCard(columnId, text) {
  const column = findColumn(columnId);
  const cleanText = text.trim();

  if (!column || !cleanText) return;

  column.cards.push({ id: createId(), text: cleanText });
  commit();
}

export function editCard(columnId, cardId, text) {
  const column = findColumn(columnId);
  const cleanText = text.trim();

  if (!column || !cleanText) return;

  const card = column.cards.find((item) => item.id === cardId);
  if (card) card.text = cleanText;

  commit();
}

export function deleteCard(columnId, cardId) {
  const column = findColumn(columnId);
  if (!column) return;

  column.cards = column.cards.filter((card) => card.id !== cardId);
  commit();
}

// Move a card to a column, inserting at a given index.
// When toIndex is undefined the card is appended to the end.
export function moveCard(fromColumnId, cardId, toColumnId, toIndex) {
  const fromColumn = findColumn(fromColumnId);
  const toColumn = findColumn(toColumnId);

  if (!fromColumn || !toColumn) return;

  const cardIndex = fromColumn.cards.findIndex((card) => card.id === cardId);
  if (cardIndex === -1) return;

  // Remove the card from its current column.
  const [card] = fromColumn.cards.splice(cardIndex, 1);

  // Insert it at the requested position (or append).
  const targetIndex =
    typeof toIndex === "number" ? toIndex : toColumn.cards.length;

  toColumn.cards.splice(targetIndex, 0, card);
  commit();
}

// Move a card one column to the right (mobile fallback).
export function moveCardToNextColumn(fromColumnId, cardId) {
  const fromIndex = board.columns.findIndex(
    (column) => column.id === fromColumnId,
  );

  // Already in the last column — nothing to do.
  if (fromIndex === -1 || fromIndex === board.columns.length - 1) return;

  const toColumnId = board.columns[fromIndex + 1].id;
  moveCard(fromColumnId, cardId, toColumnId);
}
