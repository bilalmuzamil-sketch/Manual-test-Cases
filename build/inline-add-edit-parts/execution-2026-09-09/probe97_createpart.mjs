// UNBLOCK 1 — a multi-bin part by CREATING one, not by changing an existing one.
// Everything tried so far edited a part that already existed, and `inventory/parts/change` accepts
// the write (201) while silently ignoring the bins array. `POST /api/inventory/parts/create` is a
// different endpoint and the playbook records that it REQUIRES `bins` — so it may well honour them.
// A brand-new part also avoids touching anyone's existing stock.
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/inline-add-edit-parts/execution-2026-09-09';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const s = await boot('sv9315','/workorders','admin'); const { page, APIH } = s;
const R={};
const save=()=>fs.writeFileSync(`${DIR}/evidence/97-createpart.json`, JSON.stringify(R,null,1));
const api = (path, body)=>page.evaluate(async ({api,path,body})=>{
  const r=await fetch(`https://${api}${path}`, body? {method:'POST',
      headers:{'Content-Type':'application/json',Accept:'application/json'}, credentials:'include', body:JSON.stringify(body)}
    : {headers:{Accept:'application/json'}, credentials:'include'});
  let t=null; try{ t=await r.text(); }catch(e){}
  let j=null; try{ j=JSON.parse(t); }catch(e){}
  return {status:r.status, json:j, text:(t||'').slice(0,500)};}, {api:APIH, path, body:body||null});
const rowsOf=(j)=>{const pick=o=>{ for (const k of ['collection','data','rows','items','results']){ if (Array.isArray(o&&o[k])) return o[k]; }
  if (Array.isArray(o)) return o; for (const k of Object.keys(o||{})){ const v=pick(o[k]); if (v&&v.length) return v; } return []; }; return pick(j);};

const locs = await api('/api/inventory/bin-locations');
R.bins = rowsOf(locs.json).slice(0,4).map(x=>({id:x.id||x.value, name:x.name||x.label}));
const cats = await api('/api/inventory/categories');
R.categoryId = (rowsOf(cats.json)[0]||{}).value || (rowsOf(cats.json)[0]||{}).id;
if (!R.categoryId){ const c2 = await api('/api/parts-catalogue/categories-list');
  R.categoryId = (rowsOf(c2.json)[0]||{}).id; }
// a catalogue part with no inventory record — the natural thing to stock
const cat = await api('/api/parts-catalogue/catalogue-parts-that-are-not-on-location?pagination[rowsPerPage]=5&pagination[page]=1');
const src = rowsOf(cat.json)[0];
R.source = src && {catalogue_part_id: src.value||src.id, pn: src.partNumber||src.part_number, name:(src.name||'').slice(0,40)};
log('bins: %s', JSON.stringify(R.bins.map(b=>b.name)));
log('category: %s | catalogue part to stock: %s', R.categoryId, JSON.stringify(R.source));
save();
if (!R.bins.length || !R.categoryId || !R.source){ log('missing an input — stopping'); await s.browser.close(); process.exit(0); }

const binPayload = R.bins.map((b,i)=>({id:b.id, quantity:[8,5,3,2][i], isDefault:i===0}));
R.tries=[];
for (const [label, body] of [
  ['documented field set', {catalog_part_id:R.source.catalogue_part_id, category_id:R.categoryId,
     quantity:18, cost:12.5, tags:[], bins:binPayload}],
  ['with min/max and vendor left out', {catalog_part_id:R.source.catalogue_part_id, category_id:R.categoryId,
     quantity:18, cost:12.5, tags:[], bins:binPayload, min:0, max:0}],
]){
  const r = await api('/api/inventory/parts/create', body);
  R.tries.push({label, status:r.status, text:r.text.slice(0,300)});
  log('create [%s] -> %s %s', label, r.status, r.text.slice(0,200));
  save();
  if (r.status===200 || r.status===201){
    R.created = r.json;
    // does the inline row's own endpoint now see several bins?
    const chk = await api(`/api/work-orders/part/request/inventory-parts-as-options-with-remaining-catalogue-parts?pagination[rowsPerPage]=25&pagination[page]=1&search=${encodeURIComponent(R.source.pn)}`);
    const hit = rowsOf(chk.json).find(x=>String(x.part_number||'').toUpperCase()===String(R.source.pn).toUpperCase());
    R.binsAfter = hit ? (hit.binLocations||[]).map(b=>({name:b.name, quantity:b.quantity, isDefault:b.isDefault})) : null;
    log('the inline typeahead now reports bins: %s', JSON.stringify(R.binsAfter));
    R.multiBin = !!(R.binsAfter && R.binsAfter.length>1);
    log('*** IS THERE NOW A MULTI-BIN PART? %s (%s) ***', R.multiBin, R.source.pn);
    save();
    break;
  }
}
await s.browser.close();
