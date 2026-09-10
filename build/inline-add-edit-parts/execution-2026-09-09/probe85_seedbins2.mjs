// SEED a multi-bin part, second attempt. Probe 81b's `inventory/parts/change` returned 201 and the
// part came back updated (quantity 21) — but the bins were UNCHANGED, still the single "Unassigned".
// So the write is accepted and the bins array is quietly ignored. Three other routes are tried here,
// each verified against the endpoint the inline row actually reads, and the first that works wins.
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/inline-add-edit-parts/execution-2026-09-09';
const PART='20047';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const s = await boot('sv9315','/workorders','admin'); const { page, APP, APIH } = s;
const R={attempts:[]};
const save=()=>fs.writeFileSync(`${DIR}/evidence/85-seedbins2.json`, JSON.stringify(R,null,1));
const api = (path, body, method)=>page.evaluate(async ({api,path,body,method})=>{
  const r=await fetch(`https://${api}${path}`, body? {method:method||'POST',
      headers:{'Content-Type':'application/json',Accept:'application/json'}, credentials:'include', body:JSON.stringify(body)}
    : {headers:{Accept:'application/json'}, credentials:'include'});
  let t=null; try{ t=await r.text(); }catch(e){}
  let j=null; try{ j=JSON.parse(t); }catch(e){}
  return {status:r.status, json:j, text:(t||'').slice(0,400)};}, {api:APIH, path, body:body||null, method:method||null});
const rowsOf=(j)=>{const pick=o=>{ for (const k of ['collection','data','rows','items','results']){ if (Array.isArray(o&&o[k])) return o[k]; }
  if (Array.isArray(o)) return o; for (const k of Object.keys(o||{})){ const v=pick(o[k]); if (v&&v.length) return v; } return []; }; return pick(j);};
const binsNow = async ()=>{
  const r = await api(`/api/work-orders/part/request/inventory-parts-as-options-with-remaining-catalogue-parts?pagination[rowsPerPage]=25&pagination[page]=1&search=${PART}`);
  const hit = rowsOf(r.json).find(x=>String(x.part_number||'').toUpperCase()===PART);
  return hit ? (hit.binLocations||[]).map(b=>({name:b.name, quantity:b.quantity, isDefault:b.isDefault})) : null;
};
const locs = await api('/api/inventory/bin-locations');
const BINS = rowsOf(locs.json).slice(0,4).map(x=>({id:x.id||x.value, name:x.name||x.label}));
const found = await api(`/api/inventory/parts?search=${PART}&pagination[rowsPerPage]=25&pagination[page]=1`);
const part = rowsOf(found.json).find(x=>String(x.part_number||'').toUpperCase()===PART);
R.part = part && {id:part.id, pn:part.part_number, currentBins:part.bins};
R.binsBefore = await binsNow();
log('bins before:', JSON.stringify(R.binsBefore), '| target bins:', JSON.stringify(BINS.map(b=>b.name)));
save();
if (!part){ log('part not found'); await s.browser.close(); process.exit(0); }

const target = BINS.map((b,i)=>({id:b.id, quantity:[6,4,9,2][i], isDefault:i===0}));
const tries = [
  ['bins with binLocationId keys', '/api/inventory/parts/change',
    {...part, catalog_part_id:part.catalogue_part_id, category_id:part.category, cost:part.purchase_price,
     tags:part.tags||[], bins: BINS.map((b,i)=>({binLocationId:b.id, quantity:[6,4,9,2][i], isDefault:i===0}))}],
  ['a dedicated bin endpoint', `/api/inventory/parts/${part.id}/bins`, {bins:target}],
  ['a transfer between bins', '/api/inventory/parts/transfer',
    {part_id:part.id, from_bin_id:(part.bins&&part.bins[0]&&part.bins[0].binLocationId), to_bin_id:BINS[1].id, quantity:2}],
  ['a bin adjustment', '/api/inventory/parts/adjust-bins', {part_id:part.id, bins:target}],
];
for (const [label, path, body] of tries){
  const r = await api(path, body);
  const after = await binsNow();
  const rec = {label, path, status:r.status, resp:r.text.slice(0,200), binsAfter:after,
               worked: !!(after && after.length>1)};
  R.attempts.push(rec);
  log('%-32s %s -> %s | bins now: %s', label, path, r.status, JSON.stringify(after));
  save();
  if (rec.worked){ log('*** MULTI-BIN PART SEEDED via %s ***', label); break; }
}
R.seeded = R.attempts.some(a=>a.worked);
log('SEEDED?', R.seeded);
if (!R.seeded){
  // is it doable through the UI at all? record what Settings -> Bin Locations offers
  await page.goto(`${APP}/administration/bins`,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForTimeout(11000);
  R.binsScreen = await page.evaluate(()=>{const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
    return {url:location.href, headers:[...document.querySelectorAll('th')].map(t),
      buttons:[...document.querySelectorAll('button')].map(t).filter(Boolean).slice(0,12),
      firstRows:[...document.querySelectorAll('tbody tr')].slice(0,3).map(r=>[...r.querySelectorAll('td')].map(t))};});
  log('Settings -> Bin Locations screen:', JSON.stringify(R.binsScreen).slice(0,500));
  await page.screenshot({path:`${DIR}/evidence/85-binsscreen.png`, fullPage:true});
  save();
}
await s.browser.close();
