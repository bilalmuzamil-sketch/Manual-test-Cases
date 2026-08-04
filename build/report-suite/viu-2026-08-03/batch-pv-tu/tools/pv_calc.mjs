import { login, api } from './qa8582.mjs';
import fs from 'fs';
const t=await login('admin'); const S=t.sessCookie;
const HD='b3c8c820-f815-4cf1-8938-10956c5ee71a',LE='f8a8b802-7780-4b16-bf10-343caeb616b2';
const R={};
const get=async qs=>await api(S,'GET','/api/reporting/reports/parts-velocity?'+qs);
// 1. 366-day cap (server)
R.dateSpans={};
for(const [lbl,sd,ed] of [['365d','2025-08-05','2026-08-04'],['366d','2025-08-04','2026-08-04'],['367d','2025-08-03','2026-08-04'],['500d','2025-03-23','2026-08-04'],['2y','2024-08-04','2026-08-04']]){
  const r=await get(`type=both&range=custom&start_date=${sd}&end_date=${ed}&locations=${HD}&pagination[page]=1&pagination[rowsPerPage]=1`);
  R.dateSpans[lbl]={status:r.status, rows:r.body?.data?.pagination?.rowsNumber, err:(typeof r.body==='object'&&r.body.errors)?JSON.stringify(r.body.errors):null};
}
// reversed order
{const r=await get(`type=both&range=custom&start_date=2026-08-04&end_date=2026-01-01&locations=${HD}&pagination[page]=1&pagination[rowsPerPage]=1`);
 R.dateSpans.reversed={status:r.status, rows:r.body?.data?.pagination?.rowsNumber, err:(r.body&&r.body.errors)?JSON.stringify(r.body.errors):null};}
// 2. full HD page scan for the interesting rows
const all=[]; let page=1;
while(page<=25){ const r=await get(`type=both&range=this_year&locations=${HD},${LE}&pagination[page]=${page}&pagination[rowsPerPage]=500&pagination[sortBy]=demand&pagination[descending]=true`);
  const c=r.body?.data?.collection||[]; all.push(...c); if(c.length<500) break; page++; }
R.scanned=all.length;
R.fractional = all.filter(x=>x.units_sold%1!==0 || (x.on_hand!==null&&x.on_hand%1!==0)).slice(0,6).map(x=>({p:x.part_number,us:x.units_sold,oh:x.on_hand}));
R.demand1zero = all.filter(x=>x.demand>=1 && x.units_sold===0).slice(0,6).map(x=>({p:x.part_number,type:x.type,us:x.units_sold,d:x.demand,oh:x.on_hand,rev:x.revenue}));
R.negativeUnits = all.filter(x=>x.units_sold<0).slice(0,6).map(x=>({p:x.part_number,us:x.units_sold,d:x.demand,oh:x.on_hand,rev:x.revenue,tpy:x.turns_per_year}));
R.zeroKeptByRevenue = all.filter(x=>x.units_sold===0 && (x.on_hand===null||x.on_hand<1) && x.revenue>0).slice(0,6).map(x=>({p:x.part_number,type:x.type,us:x.units_sold,oh:x.on_hand,rev:x.revenue}));
R.violatesS3N1 = all.filter(x=>x.type==='inventory' && x.units_sold===0 && (x.on_hand!==null&&x.on_hand<1) && x.revenue===0).slice(0,6).map(x=>({p:x.part_number,us:x.units_sold,oh:x.on_hand,rev:x.revenue}));
R.specialOrderNulls = all.filter(x=>x.type!=='inventory').slice(0,4).map(x=>({p:x.part_number,type:x.type,oh:x.on_hand,tpy:x.turns_per_year,min:x.min,max:x.max,loc:x.location}));
// 3. per-location duplicate rows for one part number (S3-R1a)
const byPn={}; for(const x of all.filter(x=>x.type==='inventory')) (byPn[x.part_number]=byPn[x.part_number]||[]).push(x);
const dup=Object.entries(byPn).filter(([,v])=>v.length>1 && new Set(v.map(z=>z.location)).size>1)[0];
R.perLocationRows = dup? {part:dup[0], rows:dup[1].map(x=>({loc:x.location,oh:x.on_hand,min:x.min,max:x.max,us:x.units_sold}))}:null;
// 4. profitability formula checks (Revenue/COGS derived)
const chk=[]; for(const x of all.slice(0,400)){
  if(x.unit_cost===null||x.sell_price===null) continue;
  const bu = x.sell_price? (x.revenue/x.sell_price):null;      // billed units implied
  const cogs = x.revenue - x.margin;
  const mp = x.revenue>0? ((x.revenue-cogs)/x.revenue*100):null;
  chk.push({p:x.part_number, revenue:x.revenue, margin:x.margin, cogs, unit_cost:x.unit_cost, sell_price:x.sell_price,
    margin_pct:x.margin_pct, mp_recomputed: mp!==null? Math.round(mp*100)/100:null,
    impliedBilledUnitsFromSell: bu!==null? Math.round(bu*100)/100:null,
    impliedBilledUnitsFromCost: x.unit_cost? Math.round(cogs/x.unit_cost*100)/100:null,
    soldWo:x.sold_via_wo, soldPs:x.sold_via_parts_sale, unitsSold:x.units_sold});
}
R.calcSample=chk.slice(0,8);
R.marginPctMismatches = chk.filter(c=>c.mp_recomputed!==null && Math.abs(c.mp_recomputed-c.margin_pct)>0.02).slice(0,5);
R.billedUnitsConsistency = chk.filter(c=>c.impliedBilledUnitsFromSell!==null&&c.impliedBilledUnitsFromCost!==null&&Math.abs(c.impliedBilledUnitsFromSell-c.impliedBilledUnitsFromCost)>0.05).slice(0,5);
R.soldSumVsBilled = chk.slice(0,10).map(c=>({p:c.p, soldWoPlusPs:(c.soldWo+c.soldPs), impliedBilled:c.impliedBilledUnitsFromSell, unitsSold:c.unitsSold}));
// 5. Turns/Yr formula
const win=216; // Jan1..Aug4 inclusive
R.turnsCheck = all.filter(x=>x.type==='inventory'&&x.on_hand>0).slice(0,6).map(x=>({p:x.part_number,us:x.units_sold,oh:x.on_hand,tpy:x.turns_per_year,
  recomputed: Math.round(((x.units_sold/win*365)/x.on_hand)*100000)/100000}));
R.turnsZeroOnHand = all.filter(x=>x.type==='inventory'&&x.on_hand===0).slice(0,4).map(x=>({p:x.part_number,us:x.units_sold,oh:x.on_hand,tpy:x.turns_per_year}));
// 6. null-trigger combinations
R.nullMixed = {
  costNullRevenuePositive: all.filter(x=>x.unit_cost===null&&x.revenue>0).slice(0,4).map(x=>({p:x.part_number,rev:x.revenue,uc:x.unit_cost,sp:x.sell_price,mp:x.margin_pct})),
  marginPctNullSellZero: all.filter(x=>x.margin_pct===null&&x.sell_price!==null).slice(0,4).map(x=>({p:x.part_number,rev:x.revenue,uc:x.unit_cost,sp:x.sell_price,mp:x.margin_pct})),
  allThreeNull: all.filter(x=>x.unit_cost===null&&x.sell_price===null&&x.margin_pct===null).slice(0,3).map(x=>({p:x.part_number,rev:x.revenue,mg:x.margin})),
  revenueOrMarginNull: all.filter(x=>x.revenue===null||x.margin===null||x.demand===null||x.units_sold===null||x.units_returned===null).length,
  lastSaleNull: all.filter(x=>x.last_sale===null).length,
};
// 7. Core exclusion: find a core part in the catalog and confirm it is absent
const inv=await api(S,'GET','/api/inventory/parts?pagination[rowsPerPage]=200&search=P550848');
R.coreLookup = {status:inv.status, sample: (inv.body?.data?.collection||[]).slice(0,4).map(x=>({pn:x.part_number||x.number,core:x.core_charge,coreId:x.core_part_id}))};
const cores=(inv.body?.data?.collection||[]).filter(x=>x.core_charge||x.core_part_id);
R.corePartsFound = cores.slice(0,4).map(x=>x.part_number||x.number);
R.corePartsInReport = cores.slice(0,4).map(x=>{const pn=x.part_number||x.number; return {pn, presentInPV: all.some(z=>z.part_number===pn)};});
fs.writeFileSync('../evidence/pv/calc-checks.json',JSON.stringify(R,null,1));
console.log(JSON.stringify(R,null,1).slice(0,9000));
