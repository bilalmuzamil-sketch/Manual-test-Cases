import { login, api } from './qa8582.mjs';
import fs from 'fs';
const t=await login('admin'); const S=t.sessCookie;
const HD='b3c8c820-f815-4cf1-8938-10956c5ee71a';
const R={};
// 366-day boundary refinement
R.spanBoundary={};
for(const [lbl,sd] of [['368incl','2025-08-02'],['369incl','2025-08-01'],['400incl','2025-07-01'],['367incl','2025-08-03']]){
  const r=await api(S,'GET',`/api/reporting/reports/parts-velocity?type=both&range=custom&start_date=${sd}&end_date=2026-08-04&locations=${HD}&pagination[page]=1&pagination[rowsPerPage]=1`);
  R.spanBoundary[lbl]={status:r.status, err:(r.body&&r.body.errors)?JSON.stringify(r.body.errors):null, rows:r.body?.data?.pagination?.rowsNumber};
}
// core-flagged parts across the whole inventory catalogue
let page=1, cores=[], scanned=0;
while(page<=30){ const r=await api(S,'GET',`/api/inventory/parts?pagination[page]=${page}&pagination[rowsPerPage]=500`);
  const c=r.body?.data?.collection||[]; scanned+=c.length;
  cores.push(...c.filter(x=>Number(x.core_charge)>0 || x.core_part_id));
  if(c.length<500) break; page++; }
R.inventoryScanned=scanned; R.coreFlaggedCount=cores.length;
R.coreFlaggedSample=cores.slice(0,8).map(x=>({pn:x.part_number||x.number, core:x.core_charge, coreId:x.core_part_id, oh:x.quantity??x.on_hand}));
// catalogue parts (non-inventory) with core
const cat=await api(S,'GET','/api/parts?pagination[rowsPerPage]=5');
R.catalogProbe={status:cat.status, keys: cat.body?.data?.collection? Object.keys(cat.body.data.collection[0]||{}) : (typeof cat.body==='string'?cat.body.slice(0,120):JSON.stringify(cat.body).slice(0,160))};
// Last Sale all-time vs window (S5-R4): pick a part with last_sale > window length
const r2=await api(S,'GET',`/api/reporting/reports/parts-velocity?type=both&range=this_month&locations=${HD}&pagination[page]=1&pagination[rowsPerPage]=200&pagination[sortBy]=last_sale&pagination[descending]=true`);
const c2=r2.body?.data?.collection||[];
R.lastSaleBeyondWindow = c2.filter(x=>x.last_sale && x.last_sale>31).slice(0,5).map(x=>({p:x.part_number,lastSale:x.last_sale,us:x.units_sold,demand:x.demand}));
R.thisMonthWindowDays = 4;
// TU: verify Summary weighted vs average of rows
const tu=(await api(S,'GET',`/api/reporting/reports/technician-utilization?range=this_year&locations=${HD},f8a8b802-7780-4b16-bf10-343caeb616b2`)).body.data.collection;
const tot=tu.reduce((a,x)=>a+x.total_seconds,0), wo=tu.reduce((a,x)=>a+x.wo_seconds,0);
const avgOfRows = tu.reduce((a,x)=>a+(x.total_seconds? x.wo_seconds/x.total_seconds*100:0),0)/tu.length;
R.tuSummary={rows:tu.length, totalHours:(tot/3600).toFixed(2), woHours:(wo/3600).toFixed(2),
  internalHours:(tu.reduce((a,x)=>a+x.internal_seconds,0)/3600).toFixed(2),
  weightedPct:(wo/tot*100).toFixed(1), averageOfRowPct:avgOfRows.toFixed(1),
  ellSumCents: tu.reduce((a,x)=>a+(x.est_lost_labor_cents||0),0)};
// TU reconciliation vs Timesheet Activities for one technician
const tech=tu.find(x=>x.internal_seconds>0);
R.reconcileTarget={name:tech.technician_name, staff_id:tech.staff_id, total:(tech.total_seconds/3600).toFixed(2)};
for(const p of [`/api/reporting/reports/punch-clock-activities?range=this_year&technicianId=${tech.staff_id}`,
                `/api/reporting/punch-clock?range=this_year&technicianId=${tech.staff_id}`,
                `/api/reporting/reports/punch-clock?range=this_year`]){
  const r=await api(S,'GET',p); if(r.status===200){R.timesheetEndpoint={path:p,keys:Object.keys(r.body?.data||{})}; break;}
  R.timesheetProbe=(R.timesheetProbe||[]).concat([p+' -> '+r.status]);
}
fs.writeFileSync('../evidence/pv/extra-checks.json',JSON.stringify(R,null,1));
console.log(JSON.stringify(R,null,1).slice(0,6000));
