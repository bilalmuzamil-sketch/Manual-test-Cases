// Bin Allocation data state on sv9315: raw bin payloads, so the Story 7 cases can be planned
// against parts that really exist here. Playbook §S names S31S-950 (four bins),
// TP-12-1013-CH (already negative) and 6050-P (no prices).
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/inline-add-edit-parts/execution-2026-09-09';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const s = await boot('sv9315','/workorders','admin'); const { page, APIH } = s;
const R={};
const TYPEAHEAD='/api/work-orders/part/request/inventory-parts-as-options-with-remaining-catalogue-parts';
// 1. raw shape of one row, so the bin fields are known rather than guessed
R.rawOne = await page.evaluate(async ({api,ep})=>{
  const r=await fetch(`https://${api}${ep}?pagination[rowsPerPage]=5&pagination[page]=1&search=OIL`,
    {headers:{Accept:'application/json'}, credentials:'include'});
  const j=await r.json(); const rows=j.collection||j.data||[];
  return {status:r.status, keys:Object.keys(j||{}), n:rows.length, first:JSON.stringify(rows[0]||null).slice(0,1400)};
}, {api:APIH, ep:TYPEAHEAD});
log('raw row:', R.rawOne.status, R.rawOne.keys, R.rawOne.n);
log(R.rawOne.first);
// 2. the three named parts
R.named = await page.evaluate(async ({api,ep,pns})=>{
  const out={};
  for (const pn of pns){
    const r=await fetch(`https://${api}${ep}?pagination[rowsPerPage]=25&pagination[page]=1&search=${encodeURIComponent(pn)}`,
      {headers:{Accept:'application/json'}, credentials:'include'});
    const j=await r.json(); const rows=j.collection||j.data||[];
    const hit=rows.find(x=>String(x.part_number||'').toUpperCase()===pn.toUpperCase())||rows[0]||null;
    out[pn]= hit? {pn:hit.part_number, name:(hit.name||'').slice(0,50), type:hit.part_type,
      qty:hit.quantity, cost:hit.cost, sell:hit.sell_price, bins:hit.binLocations} : {none:true, n:rows.length};
  }
  return out;}, {api:APIH, ep:TYPEAHEAD, pns:['S31S-950','TP-12-1013-CH','6050-P']});
for (const k of Object.keys(R.named)) log(k, JSON.stringify(R.named[k]).slice(0,700));
// 3. survey: parts with >=1 bin, >=3 bins, a negative bin, and no bins at all
R.survey = await page.evaluate(async ({api,ep})=>{
  const buckets={oneBin:[], threePlus:[], negative:[], noBins:[], catalogue:[], noPrice:[]};
  for (const q of ['OIL','FILTER','BOLT','SEAL','HOSE','BRAKE','PIN','KIT']){
    const r=await fetch(`https://${api}${ep}?pagination[rowsPerPage]=200&pagination[page]=1&search=${encodeURIComponent(q)}`,
      {headers:{Accept:'application/json'}, credentials:'include'});
    if(!r.ok) continue; const j=await r.json(); const rows=j.collection||j.data||[];
    for (const x of rows){
      const b=x.binLocations||[];
      const rec={pn:x.part_number, name:(x.name||'').slice(0,40), type:x.part_type, qty:x.quantity,
        cost:x.cost, sell:x.sell_price, nbins:b.length, bins:b.slice(0,5)};
      if (x.part_type!=='inventory_part' && buckets.catalogue.length<4) buckets.catalogue.push(rec);
      if (b.length>=3 && buckets.threePlus.length<4) buckets.threePlus.push(rec);
      else if (b.length===1 && Number(b[0].quantity ?? b[0].onHand ?? 0)>2 && buckets.oneBin.length<4) buckets.oneBin.push(rec);
      if (b.some(y=>Number(y.quantity ?? y.onHand ?? 0)<0) && buckets.negative.length<4) buckets.negative.push(rec);
      if (b.length===0 && x.part_type==='inventory_part' && buckets.noBins.length<4) buckets.noBins.push(rec);
      if ((!x.cost||Number(x.cost)===0) && (!x.sell_price||Number(x.sell_price)===0) && buckets.noPrice.length<4) buckets.noPrice.push(rec);
    }
  }
  return buckets;}, {api:APIH, ep:TYPEAHEAD});
for (const k of Object.keys(R.survey)) log(k, JSON.stringify(R.survey[k]).slice(0,600));
fs.writeFileSync(`${DIR}/evidence/49-bins.json`, JSON.stringify(R,null,1));
await s.browser.close();
