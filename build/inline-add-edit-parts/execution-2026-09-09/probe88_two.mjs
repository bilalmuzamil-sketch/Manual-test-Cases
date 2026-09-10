// (a) C45250 clause 2, settled properly. Probe 84 clicked the Complete line's OWN Add Part, the row
//     opened, a part was typed and saved — and the line by id is still `complete`, with no "Part
//     added" toast. Two very different readings: either the system did not uncomplete the line (the
//     case's clause 2 fails), or the save itself did nothing on a Complete line. This checks which.
// (b) A part held in MORE THAN ONE BIN. Four write routes were refused (400/404/405/405), but
//     Settings -> Bin Locations shows real part counts per bin — A1A 14, A1B 20, A1C 13 — so parts
//     ARE spread across bins here. The earlier "no part is in 3+ bins" came from the typeahead's
//     binLocations, which is query-shape dependent and cannot be trusted for this. The bins' own
//     part lists are intersected instead.
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/inline-add-edit-parts/execution-2026-09-09';
const WOID='6a529a5f-dff9-4c13-9636-b41500e585f0';
const LINEID='b80d7553-0a8f-45f5-910a-8052573332d5';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const VIS=`(e)=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);
  return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden'&&parseFloat(c.opacity)>0.01;}`;
const s = await boot('sv9315','/workorders','admin'); const { page, APP, APIH } = s;
const R={};
const save=()=>fs.writeFileSync(`${DIR}/evidence/88-two.json`, JSON.stringify(R,null,1));
const api = (path, body)=>page.evaluate(async ({api,path,body})=>{
  const r=await fetch(`https://${api}${path}`, body? {method:'POST',
      headers:{'Content-Type':'application/json',Accept:'application/json'}, credentials:'include', body:JSON.stringify(body)}
    : {headers:{Accept:'application/json'}, credentials:'include'});
  let t=null; try{ t=await r.text(); }catch(e){}
  let j=null; try{ j=JSON.parse(t); }catch(e){}
  return {status:r.status, json:j, text:(t||'').slice(0,300)};}, {api:APIH, path, body:body||null});
const rowsOf=(j)=>{const pick=o=>{ for (const k of ['collection','data','rows','items','results']){ if (Array.isArray(o&&o[k])) return o[k]; }
  if (Array.isArray(o)) return o; for (const k of Object.keys(o||{})){ const v=pick(o[k]); if (v&&v.length) return v; } return []; }; return pick(j);};

// ---------- (a) did the part probe 84 typed actually land? ----------
const d = await api(`/api/work-orders/lines/${WOID}`);
const line = rowsOf(d.json).find(x=>x.line_id===LINEID);
R.C45250 = line ? {
  lineStatus: line.status,
  requests:(line.part_requests||[]).map(x=>({id:x.id, status:x.status, desc:(x.description||'').slice(0,40)})),
  parts:(line.parts||[]).map(x=>({desc:(x.description||x.name||'').slice(0,40), pn:x.part_number})),
} : {missing:true};
R.C45250.probe84PartLanded = JSON.stringify(R.C45250).includes('uncompletes this line');
log('C45250 — line status now: %s', R.C45250.lineStatus);
log('   requests: %s', JSON.stringify(R.C45250.requests).slice(0,300));
log('   parts:    %s', JSON.stringify(R.C45250.parts).slice(0,300));
log('   did probe 84 part land? %s', R.C45250.probe84PartLanded);
await page.goto(`${APP}/workorders/${WOID}/lines`,{waitUntil:'domcontentloaded',timeout:60000});
await page.waitForTimeout(9000);
await page.evaluate(()=>{[...document.querySelectorAll('.q-expansion-item')].forEach(i=>i.querySelector('.q-item')?.click());});
await page.waitForTimeout(7000);
R.C45250.onScreen = await page.evaluate(()=>/uncompletes this line/i.test(document.body.innerText||''));
log('   is it on the screen? %s', R.C45250.onScreen);
await page.screenshot({path:`${DIR}/evidence/88-a-c45250.png`, fullPage:true});
save();

// ---------- (b) a part in more than one bin ----------
const locs = await api('/api/inventory/bin-locations');
R.binList = rowsOf(locs.json).slice(0,10).map(x=>({id:x.id||x.value, name:x.name||x.label}));
R.byBin = {};
for (const b of R.binList.slice(0,8)){
  for (const shape of [`/api/inventory/parts?binLocation=${b.id}&pagination[rowsPerPage]=200&pagination[page]=1`,
                       `/api/inventory/parts?bin_location_id=${b.id}&pagination[rowsPerPage]=200&pagination[page]=1`,
                       `/api/inventory/parts?binIds[]=${b.id}&pagination[rowsPerPage]=200&pagination[page]=1`]){
    const r = await api(shape);
    if (r.status!==200) continue;
    const rows = rowsOf(r.json);
    if (!rows.length) continue;
    R.byBin[b.name] = {n:rows.length, shape:shape.split('?')[1].split('&')[0],
      pns:rows.map(x=>x.part_number).filter(Boolean)};
    break;
  }
  log('bin %-16s -> %s', b.name, JSON.stringify(R.byBin[b.name] ? {n:R.byBin[b.name].n, shape:R.byBin[b.name].shape} : 'no rows'));
}
save();
const counts={};
for (const [bin, v] of Object.entries(R.byBin)) for (const pn of (v.pns||[])) (counts[pn]=counts[pn]||[]).push(bin);
R.multiBin = Object.entries(counts).filter(([,bins])=>bins.length>1).slice(0,10).map(([pn,bins])=>({pn, bins}));
log('parts appearing in more than one bin: %s', JSON.stringify(R.multiBin).slice(0,600));
R.anyMultiBin = R.multiBin.length>0;
save();
await s.browser.close();
