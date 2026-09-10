// Bin Allocation data check: confirm the bin data state on sv9315 (playbook §S names
// S31S-950 in four bins, TP-12-1013-CH already negative, 6050-P with no prices).
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/inline-add-edit-parts/execution-2026-09-09';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const s = await boot('sv9315','/workorders','admin'); const { page, APIH } = s;
const R={};
const q = async (pn)=>page.evaluate(async ({p,api})=>{
  const r=await fetch(`https://${api}/api/inventory/parts?search=${encodeURIComponent(p)}&pagination[rowsPerPage]=50&pagination[page]=1`,
    {headers:{'Accept':'application/json'}, credentials:'include'});
  const j=await r.json(); const rows=j.data||j.rows||j;
  return {status:r.status, n:Array.isArray(rows)?rows.length:null,
    rows:(Array.isArray(rows)?rows:[]).slice(0,3).map(x=>({pn:x.part_number, desc:(x.description||'').slice(0,50),
      qty:x.quantity ?? x.on_hand, cost:x.cost, sell:x.sell_price, is_core:x.is_core,
      bins:(x.bins||x.bin_locations||[]).map(b=>({name:b.name||b.bin_name||b.label, qty:b.quantity ?? b.on_hand, def:b.isDefault ?? b.is_default}))}))};
}, {p:pn, api:APIH});
for (const pn of ['S31S-950','TP-12-1013-CH','6050-P']){
  R[pn] = await q(pn);
  log(pn, JSON.stringify(R[pn]));
}
// any part in 3+ bins, for the "+N" chip case
R.multi = await page.evaluate(async (api)=>{
  const out=[]; 
  for (let p=1;p<=6;p++){
    const r=await fetch(`https://${api}/api/inventory/parts?pagination[rowsPerPage]=200&pagination[page]=${p}`,{headers:{Accept:'application/json'}, credentials:'include'});
    const j=await r.json(); const rows=j.data||j.rows||[];
    for (const x of rows){ const b=x.bins||x.bin_locations||[];
      if (b.length>=3) out.push({pn:x.part_number, nbins:b.length,
        bins:b.map(y=>({name:y.name||y.bin_name, qty:y.quantity ?? y.on_hand, def:y.isDefault ?? y.is_default}))});
      if (out.length>=8) return out; }
    if (!rows.length) break;
  }
  return out;}, APIH);
log('parts in 3+ bins:', JSON.stringify(R.multi).slice(0,1200));
fs.writeFileSync(`${DIR}/evidence/49-bins.json`, JSON.stringify(R,null,1));
await s.browser.close();
