import { transactionList, saveData } from "./storage.js";
import { updateCards } from "./ui.js";

export let editIndex = -1;

export function renderTable(data = transactionList) {
  const tableBody = document.getElementById("transaction-table");
  const btn = document.getElementById("add-transaction-btn");

  tableBody.innerHTML = "";

  data.forEach((item) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${item.title}</td>
      <td>${item.type}</td>
      <td>₹${item.amount}</td>
      <td>${item.category}</td>
      <td>${item.date}</td>
      <td>
        <button class="edit-btn">Edit</button>
        <button class="delete-btn">Delete</button>
      </td>
    `;

    row.querySelector(".delete-btn").addEventListener("click", () => {
      const actualIndex = transactionList.indexOf(item);

      transactionList.splice(actualIndex, 1);

      saveData();
      renderTable();
      updateCards();
    });

    row.querySelector(".edit-btn").addEventListener("click", () => {
      document.getElementById("name").value = item.title;
      document.getElementById("amount").value = item.amount;
      document.getElementById("type_of_exp").value = item.type;
      document.getElementById("category").value = item.category;

      editIndex = transactionList.indexOf(item);

      btn.textContent = "UPDATE TRANSACTION";
    });

    tableBody.appendChild(row);
  });
}