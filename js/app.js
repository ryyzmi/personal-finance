function showToast(message) {
  const toast=document.getElementById("toast");
  toast.textContent=message;toast.classList.add("show");
  clearTimeout(window.toastTimer);
  window.toastTimer=setTimeout(()=>toast.classList.remove("show"),2500);
}
function refreshApp() {
  renderDashboard();
  updateMonthFilter();
  renderHistory();
  renderStatistics();
}
function exportCSV() {
  const items=getTransactions();
  if(!items.length){showToast("Belum ada data untuk diekspor.");return;}
  const rows=[["Tanggal","Jenis","Kategori","Nominal (IDR)","Catatan"],...items.map(item=>[item.date,item.type==="income"?"Pemasukan":"Pengeluaran",item.category,item.amount,item.description||""])];
  const csv=rows.map(row=>row.map(value=>`"${String(value).replace(/"/g,'""')}"`).join(",")).join("\n");
  const blob=new Blob(["\uFEFF"+csv],{type:"text/csv;charset=utf-8;"});
  const url=URL.createObjectURL(blob);
  const link=document.createElement("a");link.href=url;link.download=`personal-finance-${new Date().toISOString().slice(0,10)}.csv`;link.click();
  URL.revokeObjectURL(url);showToast("File CSV berhasil dibuat.");
}
function setupSettings() {
  document.getElementById("exportCsv").addEventListener("click",exportCSV);
  document.getElementById("clearData").addEventListener("click",()=>{
    if(confirm("Yakin ingin menghapus SEMUA transaksi? Data yang dihapus tidak bisa dipulihkan.")){
      Storage.clear();refreshApp();showToast("Semua data transaksi telah dihapus.");
    }
  });
  document.getElementById("profileButton").addEventListener("click",()=>showToast("PERSONAL FINANCE · Data tersimpan lokal."));
}
function updateTodayLabel() {
  document.getElementById("todayLabel").textContent=new Date().toLocaleDateString("id-ID",{weekday:"long",day:"numeric",month:"long",year:"numeric"}).toUpperCase();
}
document.addEventListener("DOMContentLoaded",()=>{
  updateTodayLabel();
  setupNavigation();
  setupTransactionForm();
  setupHistoryFilters();
  setupSettings();
  refreshApp();
  window.addEventListener("resize",()=>{
    if(document.getElementById("page-dashboard").classList.contains("active"))renderDashboard();
    if(document.getElementById("page-statistics").classList.contains("active"))renderStatistics();
  });
});
                               
