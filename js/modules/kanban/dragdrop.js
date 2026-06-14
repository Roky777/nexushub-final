/* =====================================
   KANBAN DRAG & DROP
   Implements the HTML Drag and Drop API
   for moving cards between columns and
   reordering them inside a column.

   All listeners are delegated on the board
   container, so they keep working even
   though cards are re-rendered on changes.
===================================== */

import { moveCard } from "./state.js";

// The card currently being dragged.
let draggedCardId = null;
let draggedFromColumnId = null;

// Work out where a dropped card should be inserted
// inside a list, based on the cursor's Y position.
// Returns the card element we should insert *before*,
// or null to append at the end.
function getCardAfterCursor(listEl, y) {
  const cards = [
    ...listEl.querySelectorAll(".kanban-card:not(.dragging)"),
  ];

  for (const card of cards) {
    const box = card.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;

    // Cursor is above this card's middle -> insert before it.
    if (offset < 0) return card;
  }

  return null;
}

export function initDragAndDrop(boardEl, onChange) {
  // Remember which card is being dragged.
  boardEl.addEventListener("dragstart", (event) => {
    const card = event.target.closest(".kanban-card");
    if (!card) return;

    draggedCardId = card.dataset.cardId;
    draggedFromColumnId = card.dataset.columnId;

    card.classList.add("dragging");
    event.dataTransfer.effectAllowed = "move";
  });

  // Clean up after the drag ends.
  boardEl.addEventListener("dragend", (event) => {
    const card = event.target.closest(".kanban-card");
    card?.classList.remove("dragging");

    boardEl
      .querySelectorAll(".kanban-card-list.drag-over")
      .forEach((list) => list.classList.remove("drag-over"));

    draggedCardId = null;
    draggedFromColumnId = null;
  });

  // Allow dropping and show a highlight on the target list.
  boardEl.addEventListener("dragover", (event) => {
    const list = event.target.closest(".kanban-card-list");
    if (!list) return;

    // Required so the "drop" event fires.
    event.preventDefault();
    list.classList.add("drag-over");
  });

  // Remove the highlight when leaving a list.
  boardEl.addEventListener("dragleave", (event) => {
    const list = event.target.closest(".kanban-card-list");
    if (list && !list.contains(event.relatedTarget)) {
      list.classList.remove("drag-over");
    }
  });

  // Perform the move on drop.
  boardEl.addEventListener("drop", (event) => {
    const list = event.target.closest(".kanban-card-list");
    if (!list || !draggedCardId) return;

    event.preventDefault();
    list.classList.remove("drag-over");

    const toColumnId = list.dataset.columnId;

    // Figure out the drop position within the target list.
    const afterCard = getCardAfterCursor(list, event.clientY);
    const ids = [...list.querySelectorAll(".kanban-card")].map(
      (card) => card.dataset.cardId,
    );

    let toIndex = afterCard
      ? ids.indexOf(afterCard.dataset.cardId)
      : ids.length;

    // When reordering inside the same column, the dragged
    // card is still counted in `ids`; drop the offset so the
    // index lands where the user actually aimed.
    if (draggedFromColumnId === toColumnId) {
      const currentIndex = ids.indexOf(draggedCardId);
      if (currentIndex !== -1 && currentIndex < toIndex) {
        toIndex -= 1;
      }
    }

    moveCard(draggedFromColumnId, draggedCardId, toColumnId, toIndex);
    onChange();
  });
}
