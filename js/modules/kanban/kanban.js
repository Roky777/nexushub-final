/* =====================================
   KANBAN CONTROLLER (entry point)
   Wires the UI together:
     - renders the board
     - listens for user actions (delegation)
     - calls state mutations, then re-renders

   The flow is always the same:
     user action -> update state -> re-render
===================================== */

import {
  addColumn,
  deleteColumn,
  addCard,
  editCard,
  deleteCard,
  moveCardToNextColumn,
} from "./state.js";
import { renderBoard } from "./render.js";
import { initDragAndDrop } from "./dragdrop.js";

const boardEl = document.getElementById("kanban-board");

// Guard: only run on pages that contain the board.
if (boardEl) {
  // Re-render the board from the current state.
  function refresh() {
    renderBoard(boardEl);
  }

  /* ---------- Clicks (buttons) ---------- */

  boardEl.addEventListener("click", (event) => {
    const button = event.target.closest("[data-action]");
    if (!button) return;

    const action = button.dataset.action;
    const card = button.closest(".kanban-card");
    const column = button.closest(".kanban-column");
    const columnId = column?.dataset.columnId;

    if (action === "delete-column") {
      if (confirm("Delete this column and all its cards?")) {
        deleteColumn(columnId);
        refresh();
      }
    }

    if (action === "delete-card") {
      deleteCard(columnId, card.dataset.cardId);
      refresh();
    }

    if (action === "edit-card") {
      const current = card.querySelector(".kanban-card-text").textContent;
      const next = prompt("Edit card:", current);
      if (next !== null) {
        editCard(columnId, card.dataset.cardId, next);
        refresh();
      }
    }

    if (action === "move-card") {
      moveCardToNextColumn(columnId, card.dataset.cardId);
      refresh();
    }
  });

  /* ---------- Double-click to edit a card ---------- */

  boardEl.addEventListener("dblclick", (event) => {
    const card = event.target.closest(".kanban-card");
    if (!card) return;

    const columnId = card.dataset.columnId;
    const current = card.querySelector(".kanban-card-text").textContent;
    const next = prompt("Edit card:", current);

    if (next !== null) {
      editCard(columnId, card.dataset.cardId, next);
      refresh();
    }
  });

  /* ---------- Form submits (add card / add column) ---------- */

  boardEl.addEventListener("submit", (event) => {
    event.preventDefault();
    const form = event.target;

    if (form.classList.contains("kanban-add-card")) {
      const input = form.querySelector(".kanban-add-card-input");
      addCard(form.dataset.columnId, input.value);
      refresh();
    }

    if (form.classList.contains("kanban-add-column")) {
      const input = form.querySelector(".kanban-add-column-input");
      addColumn(input.value);
      refresh();
    }
  });

  /* ---------- Init ---------- */

  initDragAndDrop(boardEl, refresh);
  refresh();
}
