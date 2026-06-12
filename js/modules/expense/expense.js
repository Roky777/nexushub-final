import { transactionList, saveData } from "./storage.js";
import { updateCards } from "./ui.js";
import { renderTable, editIndex } from "./transection.js";
import { initFilters } from "./filter.js";

const btn = document.getElementById("add-transaction-btn");

btn.addEventListener("click", () => {

  const name = document.getElementById("name").value.trim();
  const amount = Number(document.getElementById("amount").value);
  const type = document.getElementById("type_of_exp").value;
  const category = document.getElementById("category").value;

  if (name === "" || amount <= 0) {
    alert("Enter valid data");
    return;
  }

  const transaction = {
    title: name,
    amount,
    type,
    category,
    date: new Date().toLocaleDateString(),
  };

  transactionList.push(transaction);

  saveData();
  renderTable();
  updateCards();

  document.getElementById("name").value = "";
  document.getElementById("amount").value = "";
});

renderTable();
updateCards();
initFilters();