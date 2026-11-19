function renderStatistics() {
  const items=getTransactions(), now=new Date();
  const monthKey=`${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}`;
  const monthItems=items.filter(item=>item.date.startsWith(monthKey));
  const totals=getTotals(monthItems), net=totals.income-totals.expense;
  document.getElementById("monthIncome").textContent=formatRupiah(totals.income);
  document.getElementById("monthExpense").textContent=formatRupiah(totals.expense);
  document.getElementById("monthNet").textContent=formatRupiah(net);
  const months=lastSixMonths();
  const income=months.map(month=>items.filter(item=>item.type==="income"&&item.date.startsWith(month.key)).reduce((sum,item)=>sum+Number(item.amount),0));
  const expense=months.map(month=>items.filter(item=>item.type==="expense"&&item.date.startsWith(month.key)).reduce((sum,item)=>sum+Number(item.amount),0));
  drawBarChart("statsChart",months.map(month=>month.label),income,expense);
  renderCategoryBreakdown("statsCategories",items.filter(item=>item.type==="expense"));
}
