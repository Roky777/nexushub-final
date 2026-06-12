export let transactionList =
  JSON.parse(localStorage.getItem("transactions")) || [];

export function saveData() {
  localStorage.setItem(
    "transactions",
    JSON.stringify(transactionList)
  );
}