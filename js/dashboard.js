function drawBarChart(canvasId, labels, incomeValues, expenseValues) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const rect = canvas.getBoundingClientRect();
  const width = Math.max(280,rect.width);
  const height = Math.max(170,rect.height);
  const dpr = window.devicePixelRatio || 1;
  canvas.width = width*dpr; canvas.height = height*dpr;
  ctx.setTransform(dpr,0,0,dpr,0,0);
  ctx.clearRect(0,0,width,height);
  const pad={left:8,right:8,top:14,bottom:28};
  const chartW=width-pad.left-pad.right, chartH=height-pad.top-pad.bottom;
  const max=Math.max(1,...incomeValues,...expenseValues)*1.15;
  ctx.font="9px DM Sans, sans-serif"; ctx.textAlign="center";
  for(let line=0;line<4;line++){
    const y=pad.top+chartH*line/3;
    ctx.strokeStyle="rgba(255,255,255,.07)";ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(pad.left,y);ctx.lineTo(width-pad.right,y);ctx.stroke();
  }
  const groupW=chartW/labels.length, barW=Math.min(13,groupW*.23);
  labels.forEach((label,index)=>{
    const center=pad.left+groupW*(index+.5);
    [[incomeValues[index],"#55d6a2",-barW*.65],[expenseValues[index],"#fb829e",barW*.65]].forEach(([value,color,offset])=>{
      const barH=(value/max)*chartH;
      const x=center+offset-barW/2, y=pad.top+chartH-barH;
      ctx.fillStyle=color;ctx.beginPath();ctx.roundRect(x,y,barW,Math.max(2,barH),4);ctx.fill();
    });
    ctx.fillStyle="#958ba7";ctx.fillText(label,center,height-8);
  });
}
function lastSixMonths() {
  const result=[];
  const now=new Date();
  for(let i=5;i>=0;i--){
    const date=new Date(now.getFullYear(),now.getMonth()-i,1);
    result.push({key:`${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,"0")}`,label:date.toLocaleDateString("id-ID",{month:"short"})});
  }
  return result;
}
function renderDashboard() {
  const items=getTransactions(), totals=getTotals(items);
  document.getElementById("totalBalance").textContent=formatRupiah(totals.income-totals.expense);
  document.getElementById("totalIncome").textContent=formatRupiah(totals.income);
  document.getElementById("totalExpense").textContent=formatRupiah(totals.expense);
  const months=lastSixMonths();
  const income=months.map(month=>items.filter(item=>item.type==="income"&&item.date.startsWith(month.key)).reduce((sum,item)=>sum+Number(item.amount),0));
  const expense=months.map(month=>items.filter(item=>item.type==="expense"&&item.date.startsWith(month.key)).reduce((sum,item)=>sum+Number(item.amount),0));
  drawBarChart("cashflowChart",months.map(month=>month.label),income,expense);
  document.getElementById("recentTransactions").innerHTML=items.length
    ? items.slice(0,5).map(item=>renderTransactionItem(item)).join("")
    : '<div class="empty-state">Belum ada transaksi. Tambahkan pemasukan atau pengeluaran pertamamu.</div>';
  renderCategoryBreakdown("categorySummary",items.filter(item=>item.type==="expense"));
}
function renderCategoryBreakdown(elementId,items) {
  const container=document.getElementById(elementId);
  const totals={};
  items.forEach(item=>totals[item.category]=(totals[item.category]||0)+Number(item.amount));
  const sorted=Object.entries(totals).sort((a,b)=>b[1]-a[1]).slice(0,6);
  const total=sorted.reduce((sum,item)=>sum+item[1],0);
  container.innerHTML=sorted.length?sorted.map(([name,value])=>`
    <div class="category-row"><div class="category-info"><span>${escapeHTML(name)}</span><span>${formatRupiah(value)}</span></div>
    <div class="progress-track"><div class="progress-fill" style="width:${total?value/total*100:0}%"></div></div></div>`).join("")
    :'<div class="empty-state">Belum ada data pengeluaran.</div>';
    }
                        
