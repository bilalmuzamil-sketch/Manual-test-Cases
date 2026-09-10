// SEED: put one inventory part into SEVERAL bins, so the Story 7 cases that need a multi-bin part
// become testable — C45222 cl.2 (the "+N" chip), C45223 cl.2 (default short, another bin covers),
// C45225 cl.2 ("N bins"), C45227, C45230, C45231 cl.1, C45233's Auto, C45243.
// Recipe: playbook — `bins` on inventory parts/change take {id, quantity, isDefault};
// {binLocationId,...} is rejected. Read-only first: this run only LOOKS, then writes, then verifies.
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/inline-add-edit-parts/execution-2026-09-09';
const PART='20047';   // one bin "Unassigned", 6 on hand
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const s = await boot('sv9315','/workorders','admin'); const { page, APIH } = s;
const R={};
const save=()=>fs.writeFileSync(`${DIR}/evidence/81-seedbins.json`, JSON.stringify(R,null,1));
const api = (path, body)=>page.evaluate(async ({api,path,body})=>{
  const r=await fetch(`https://${api}${path}`, body? {method:'POST',
      headers:{'Content-Type':'application/json',Accept:'application/json'}, credentials:'include', body:JSON.stringify(body)}
    : {headers:{Accept:'application/json'}, credentials:'include'});
  let t=null; try{ t=await r.text(); }catch(e){}
  let j=null; try{ j=JSON.parse(t); }catch(e){}
  return {status:r.status, json:j, text:(t||'').slice(0,500)};}, {api:APIH, path, body:body||null});
const rowsOf=(j)=>{const pick=o=>{ for (const k of ['collection','data','rows','items','results']){ if (Array.isArray(o&&o[k])) return o[k]; }
  if (Array.isArray(o)) return o; for (const k of Object.keys(o||{})){ const v=pick(o[k]); if (v&&v.length) return v; } return []; }; return pick(j);};

// ---- 1. what bin locations exist?
for (const p of ['/api/bin-locations','/api/administration/bins','/api/inventory/bin-locations',
                 '/api/bins','/api/organizations/bin-locations','/api/inventory/bins']){
  const r = await api(p);
  if (r.status===200){
    const rows=rowsOf(r.json);
    if (rows.length){ R.binsPath=p; R.bins=rows.slice(0,12).map(x=>({id:x.id||x.value, name:x.name||x.label})); break; }
  }
}
log('bin locations:', R.binsPath, JSON.stringify(R.bins));
save();
// ---- 2. the part's current record
const found = await api(`/api/inventory/parts?search=${PART}&pagination[rowsPerPage]=25&pagination[page]=1`);
const part = rowsOf(found.json).find(x=>String(x.part_number||'').toUpperCase()===PART);
R.partBefore = part ? {id:part.id, pn:part.part_number, qty:part.quantity, cost:part.cost,
  keys:Object.keys(part).slice(0,26), bins:part.bins||part.binLocations} : {none:true, n:rowsOf(found.json).length};
log('part before:', JSON.stringify(R.partBefore).slice(0,700));
save();
if (!part || !R.bins || R.bins.length<2){
  log('cannot seed: %s', !part ? 'part not found' : 'fewer than two bin locations exist');
  await s.browser.close(); process.exit(0);
}
// ---- 3. write it into several bins
const targets = R.bins.slice(0,4);
const binPayload = targets.map((b,i)=>({id:b.id, quantity:[6,4,9,2][i], isDefault:i===0}));
R.attempt = {bins:binPayload};
const body = {...part, bins:binPayload};
delete body.binLocations;
const w = await api('/api/inventory/parts/change', body);
R.write = {status:w.status, text:w.text};
log('parts/change ->', JSON.stringify(R.write).slice(0,400));
save();
// ---- 4. verify from the endpoint the inline row actually uses
const check = await api(`/api/work-orders/part/request/inventory-parts-as-options-with-remaining-catalogue-parts?pagination[rowsPerPage]=25&pagination[page]=1&search=${PART}`);
const after = rowsOf(check.json).find(x=>String(x.part_number||'').toUpperCase()===PART);
R.partAfter = after ? {pn:after.part_number, qty:after.quantity,
  bins:(after.binLocations||[]).map(b=>({name:b.name, quantity:b.quantity, isDefault:b.isDefault}))} : {none:true};
log('part after:', JSON.stringify(R.partAfter));
R.seeded = !!(R.partAfter.bins && R.partAfter.bins.length>1);
log('SEEDED A MULTI-BIN PART?', R.seeded);
save();
await s.browser.close();
