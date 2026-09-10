// C45250, the last check. After a full reload the typed part IS on the screen, but the line's
// `part_requests` array is empty — so my counter was the wrong instrument: a part that is linked or
// picked lives under `parts`, not `part_requests`. This reads BOTH arrays and the visible parts list,
// so "was the part actually added to the Complete line?" is answered properly, and reads the line's
// status alongside it.
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
const api = (path)=>page.evaluate(async ({api,path})=>{
  const r=await fetch(`https://${api}${path}`,{headers:{Accept:'application/json'}, credentials:'include'});
  let j=null; try{ j=await r.json(); }catch(e){}
  return {status:r.status, json:j};}, {api:APIH, path});
const rowsOf=(j)=>{const pick=o=>{ for (const k of ['collection','data','rows','items','results']){ if (Array.isArray(o&&o[k])) return o[k]; }
  if (Array.isArray(o)) return o; for (const k of Object.keys(o||{})){ const v=pick(o[k]); if (v&&v.length) return v; } return []; }; return pick(j);};
const d = await api(`/api/work-orders/lines/${WOID}`);
const l = rowsOf(d.json).find(x=>x.line_id===LINEID);
R.line = l ? {
  status: l.status,
  requests:(l.part_requests||[]).map(x=>({status:x.status, desc:(x.description||'').slice(0,42), pn:x.part_number})),
  parts:(l.parts||[]).map(x=>({status:x.status, desc:(x.description||x.name||'').slice(0,42), pn:x.part_number})),
} : {missing:true};
log('line status: %s', R.line.status);
log('  part_requests: %s', JSON.stringify(R.line.requests));
log('  parts:         %s', JSON.stringify(R.line.parts));
R.landed = JSON.stringify(R.line).includes('ZZAUTOTEST c45250');
log('  did the parts typed onto the COMPLETE line land? %s', R.landed);
await page.goto(`${APP}/workorders/${WOID}/lines`,{waitUntil:'domcontentloaded',timeout:60000});
await page.waitForTimeout(9000);
await page.evaluate(()=>{[...document.querySelectorAll('.q-expansion-item')].forEach(i=>i.querySelector('.q-item')?.click());});
await page.waitForTimeout(7000);
R.visible = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const rows=[...document.querySelectorAll('[data-test-id^=button_edit_part_]')].map(b=>{
    let box=b; for(let i=0;i<8&&box.parentElement;i++){box=box.parentElement; if((box.innerText||'').split('\n').length>1) break;}
    return (box.innerText||'').replace(/\s+/g,' ').trim().slice(0,90);});
  return {rows:rows.slice(0,10), anyC45250:rows.some(r=>/ZZAUTOTEST c45250/.test(r)),
          rowOpen:!!document.querySelector('[data-test-id=input_inline_part_description]')};}, VIS);
log('on screen: rowOpen=%s | a saved c45250 row present=%s', R.visible.rowOpen, R.visible.anyC45250);
log('  rows: %s', JSON.stringify(R.visible.rows).slice(0,400));
await page.screenshot({path:`${DIR}/evidence/96-c45250.png`, fullPage:true});
fs.writeFileSync(`${DIR}/evidence/96-c45250.json`, JSON.stringify(R,null,1));
await s.browser.close();
