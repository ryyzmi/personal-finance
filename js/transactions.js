const INCOME_CATEGORIES = ["Gaji","Uang saku","Bonus","Hadiah","Penjualan","Investasi","Lainnya"];
const EXPENSE_CATEGORIES = ["Makanan","Transportasi","Belanja","Tagihan","Pendidikan","Hiburan","Kesehatan","Lainnya"];

function getTransactions() { return Storage.getAll(); }
function formatRupiah(value) {
  return new Intl.NumberFormat("id-ID", {style:"currency",currency:"IDR",maximumFractionDigits:0}).format(Number(value)||0);
}
function formatDate(dateString) {
  if (!dateString) return "-";
  return new Date(dateString + "T00:00:00").toLocaleDateString("id-ID",{day:"numeric",month:"short",year:"numeric"});
}
function createId() { return Date.now().toString(36) + Math.random().toString(36).slice(2,7); }
function saveTransaction(transaction) {
  const items = getTransactions();
  const index = items.findIndex(item => item.id === transaction.id);
  if (index >= 0) items[index] = transaction;
  else items.push(transaction);
  items.sort((a,b) => b.date.localeCompare(a.date) || b.createdAt-a.createdAt);
  Storage.saveAll(items);
}
function deleteTransaction(id) {
  Storage.saveAll(getTransactions().filter(item => item.id !== id));
}
function getTotals(items = getTransactions()) {
  return items.reduce((totals,item) => {
    if (item.type === "income") totals.income += Number(item.amount);
    else totals.expense += Number(item.amount);
    return totals;
  },{income:0,expense:0});
}
function transactionIcon(item) {
  if (item.type === "income") return "↗";
  const icons = {"Makanan":"☕","Transportasi":"⌁","Belanja":"◇","Tagihan":"▤","Pendidikan":"▣","Hiburan":"♫","Kesehatan":"✚"};
  return icons[item.category] || "↘";
}
function renderTransactionItem(item, withActions = false) {
  const sign = item.type === "income" ? "+" : "−";
  const label = item.description || item.category;
  return `<div class="transaction-item">
    <div class="transaction-icon">${transactionIcon(item)}</div>
    <div class="transaction-main"><strong>${escapeHTML(label)}</strong><small>${escapeHTML(item.category)} · ${formatDate(item.date)}</small></div>
    <div class="transaction-amount ${item.type}">${sign} ${formatRupiah(item.amount)}</div>
    ${withActions ? `<div class="item-actions"><button class="icon-button" data-edit="${item.id}" title="Edit">✎</button><button class="icon-button" data-delete="${item.id}" title="Hapus">×</button></div>` : ""}
  </div>`;
}
function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[char]));
}
function updateCategoryOptions(type, selected = "") {
  const categories = type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
  const select = document.getElementById("category");
  select.innerHTML = categories.map(category => `<option value="${category}">${category}</option>`).join("");
  if (selected && categories.includes(selected)) select.value = selected;
}
function setupTransactionForm() {
  const form = document.getElementById("transactionForm");
  const typeInput = document.getElementById("transactionType");
  const typeButtons = document.querySelectorAll(".type-option");
  const dateInput = document.getElementById("date");
  dateInput.value = new Date().toISOString().slice(0,10);
  updateCategoryOptions("income");

  typeButtons.forEach(button => button.addEventListener("click", () => {
    typeButtons.forEach(item => item.classList.remove("selected"));
    button.classList.add("selected");
    typeInput.value = button.dataset.type;
    updateCategoryOptions(typeInput.value);
  }));

  form.addEventListener("submit", event => {
    event.preventDefault();
    const amount = Number(document.getElementById("amount").value);
    const date = dateInput.value;
    if (!Number.isFinite(amount) || amount <= 0 || !date) {
      showToast("Masukkan nominal dan tanggal yang valid.");
      return;
    }
    const existingId = document.getElementById("transactionId").value;
    const transaction = {
      id: existingId || createId(),
      type: typeInput.value,
      amount: Math.round(amount),
      category: document.getElementById("category").value,
      date,
      description: document.getElementById("description").value.trim(),
      createdAt: Date.now()
    };
    saveTransaction(transaction);
    resetTransactionForm();
    refreshApp();
    showToast(existingId ? "Transaksi berhasil diperbarui." : "Transaksi berhasil disimpan.");
    navigateTo("history");
  });

  document.getElementById("cancelEdit").addEventListener("click", resetTransactionForm);
}
function editTransaction(id) {
  const item = getTransactions().find(transaction => transaction.id === id);
  if (!item) return;
  navigateTo("transactions");
  document.getElementById("transactionId").value = item.id;
  document.getElementById("transactionType").value = item.type;
  document.querySelectorAll(".type-option").forEach(button => button.classList.toggle("selected",button.dataset.type===item.type));
  updateCategoryOptions(item.type,item.category);
  document.getElementById("amount").value = item.amount;
  document.getElementById("date").value = item.date;
  document.getElementById("description").value = item.description || "";
  document.getElementById("saveTransaction").textContent = "Simpan perubahan";
  document.getElementById("cancelEdit").classList.remove("hidden");
}
function resetTransactionForm() {
  document.getElementById("transactionForm").reset();
  document.getElementById("transactionId").value = "";
  document.getElementById("transactionType").value = "income";
  document.querySelectorAll(".type-option").forEach(button => button.classList.toggle("selected",button.dataset.type==="income"));
  updateCategoryOptions("income");
  document.getElementById("date").value = new Date().toISOString().slice(0,10);
  document.getElementById("saveTransaction").textContent = "Simpan transaksi";
  document.getElementById("cancelEdit").classList.add("hidden");
}
function renderHistory() {
  const query = document.getElementById("searchTransactions").value.toLowerCase().trim();
  const type = document.getElementById("filterType").value;
  const month = document.getElementById("filterMonth").value;
  const filtered = getTransactions().filter(item => {
    const text = `${item.description} ${item.category}`.toLowerCase();
    return (!query || text.includes(query)) && (type==="all" || item.type===type) && (month==="all" || item.date.startsWith(month));
  });
  document.getElementById("historyCount").textContent = `${filtered.length} transaksi ditemukan`;
  document.getElementById("historyTransactions").innerHTML = filtered.length
    ? filtered.map(item => renderTransactionItem(item,true)).join("")
    : '<div class="empty-state">Tidak ada transaksi yang cocok.</div>';
}
function setupHistoryFilters() {
  ["searchTransactions","filterType","filterMonth"].forEach(id => {
    document.getElementById(id).addEventListener(id==="searchTransactions"?"input":"change",renderHistory);
  });
  updateMonthFilter();
  document.getElementById("historyTransactions").addEventListener("click",event => {
    const editButton = event.target.closest("[data-edit]");
    const deleteButton = event.target.closest("[data-delete]");
    if (editButton) editTransaction(editButton.dataset.edit);
    if (deleteButton && confirm("Hapus transaksi ini?")) {
      deleteTransaction(deleteButton.dataset.delete);
      refreshApp();
      showToast("Transaksi dihapus.");
    }
  });
}
function updateMonthFilter() {
  const select = document.getElementById("filterMonth");
  const current = select.value;
  const months = [...new Set(getTransactions().map(item=>item.date.slice(0,7)))].sort().reverse();
  select.innerHTML = '<option value="all">Semua bulan</option>' + months.map(month => {
    const [year,number] = month.split("-");
    const label = new Date(Number(year),Number(number)-1,1).toLocaleDateString("id-ID",{month:"long",year:"numeric"});
    return `<option value="${month}">${label}</option>`;
  }).join("");
  if (months.includes(current)) select.value=current;
}
  
