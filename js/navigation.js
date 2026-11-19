const PAGE_TITLES={dashboard:"Dashboard",transactions:"Transaksi",history:"Riwayat",statistics:"Statistik",settings:"Pengaturan"};
function navigateTo(page) {
  if (!PAGE_TITLES[page]) return;
  document.querySelectorAll(".page").forEach(section=>section.classList.toggle("active",section.id===`page-${page}`));
  document.querySelectorAll(".nav-link[data-page]").forEach(button=>button.classList.toggle("active",button.dataset.page===page));
  document.getElementById("pageTitle").textContent=PAGE_TITLES[page];
  if(page==="dashboard") renderDashboard();
  if(page==="history"){updateMonthFilter();renderHistory();}
  if(page==="statistics") renderStatistics();
  window.scrollTo({top:0,behavior:"smooth"});
}
function setupNavigation() {
  document.querySelectorAll(".nav-link[data-page]").forEach(button=>button.addEventListener("click",()=>navigateTo(button.dataset.page)));
  document.querySelectorAll("[data-go]").forEach(button=>button.addEventListener("click",()=>navigateTo(button.dataset.go)));
    }
