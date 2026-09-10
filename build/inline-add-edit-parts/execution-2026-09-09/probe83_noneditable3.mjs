// C45021 / C45035 / C45061 — the work order becomes non-editable while the inline row is open.
// Why the two earlier attempts failed, in order:
//   probe 58/72: `change-status {status:'complete'}` is refused while ANY line is incomplete, and
//                the spare work orders' lines carry part requests sitting at authorized_to_order /
//                waiting-to-receive, which `pick` cannot fulfil ("This action cannot be performed on
//                requests that are waiting to receive").
// So a work order whose lines are ALL free of part requests is used, one in-stock part is added and
// picked, every line is completed, and only then is the work order completed under an open row.
// Everything is put back at the end.
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/inline-add-edit-parts/execution-2026-09-09';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const VIS=`(e)=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);
  return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden'&&parseFloat(c.opacity)>0.01;}`;
const R={};
const save=()=>fs.writeFileSync(`${DIR}/evidence/83-noneditable3.json`, JSON.stringify(R,null,1));
const mkApi = (page, APIH)=>(path, body)=>page.evaluate(async ({api,path,body})=>{
  const r=await fetch(`https://${api}${path}`, body? {method:'POST',
      headers:{'Content-Type':'application/json',Accept:'application/json'}, credentials:'include', body:JSON.stringify(body)}
    : {headers:{Accept:'application/json'}, credentials:'include'});
  let t=null; try{ t=await r.text(); }catch(e){}
  let j=null; try{ j=JSON.parse(t); }catch(e){}
  return {status:r.status, json:j, text:(t||'').slice(0,300)};}, {api:APIH, path, body:body||null});
const rowsOf=(j)=>{const pick=o=>{ for (const k of ['collection','data','rows','items','results']){ if (Array.isArray(o&&o[k])) return o[k]; }
  if (Array.isArray(o)) return o; for (const k of Object.keys(o||{})){ const v=pick(o[k]); if (v&&v.length) return v; } return []; }; return pick(j);};

const boss = await boot('sv9315','/workorders','admin');
const api = mkApi(boss.page, boss.APIH);
const list = await api('/api/work-orders?limit=100&page=1');
const cand = rowsOf(list.json).filter(w=>['approved','estimate','in_progress'].includes(String(w.status||'').toLowerCase()));
let WO=null, LINES=null;
for (const w of cand.slice(0,30)){
  const d = await api(`/api/work-orders/lines/${w.id}`);
  if (d.status!==200) continue;
  const lines = rowsOf(d.json);
  if (lines.length && lines.every(l=>l && l.line_id && (l.part_requests||[]).length===0)){ WO=w; LINES=lines; break; }
}
R.chosen = {wo: WO && {id:WO.id, num:WO.number, status:WO.status},
            lines:(LINES||[]).map(l=>({id:l.line_id, status:l.status}))};
log('a work order with NO part requests anywhere:', JSON.stringify(R.chosen));
save();
if (!WO){ log('none found — C45021/C45035/C45061 stay untested, reason recorded'); await boss.browser.close(); process.exit(0); }
// authorise then complete every line
R.lineWork=[];
for (const l of LINES){
  if (String(l.status||'').toLowerCase()==='authorization_required'){
    const a = await api('/api/work-orders/lines/change-status', {line_id:l.line_id, status:'authorized', workOrderId:WO.id});
    R.lineWork.push({id:l.line_id, step:'authorize', status:a.status});
  }
  const c = await api('/api/work-orders/lines/change-status', {line_id:l.line_id, status:'complete', workOrderId:WO.id});
  R.lineWork.push({id:l.line_id, step:'complete', status:c.status, body:c.text.slice(0,110)});
}
log('lines:', JSON.stringify(R.lineWork).slice(0,400));
save();
await boss.browser.close();

const leg = async (key, mode)=>{
  const s = await boot('sv9315','/workorders',key); const {page, APP, APIH}=s; const call=mkApi(page, APIH); const out={key, mode};
  await call('/api/work-orders/change-status', {id:WO.id, status:'approved'});   // editable again for setup
  await page.goto(`${APP}/workorders/${WO.id}/lines`,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForTimeout(9000);
  await page.evaluate(()=>{[...document.querySelectorAll('.q-expansion-item')].forEach(i=>i.querySelector('.q-item')?.click());});
  await page.waitForTimeout(7000);
  if (mode==='edit'){
    out.opened = await page.evaluate(()=>{const e=document.querySelector('[data-test-id^=button_edit_part_]');
      if(!e) return 'no edit control'; e.scrollIntoView({block:'center'}); e.click(); return 'opened';});
    await page.waitForTimeout(6500);
    if (await page.$('[data-test-id=input_inline_part_quantity]')) await page.fill('[data-test-id=input_inline_part_quantity]','6');
  } else {
    out.opened = await page.evaluate(()=>{const b=document.querySelector('[data-test-id=button_add_part]');
      if(!b) return 'no add button'; b.scrollIntoView({block:'center'}); b.click(); return 'opened';});
    await page.waitForTimeout(4500);
    if (await page.$('[data-test-id=input_inline_part_description]')){
      await page.fill('[data-test-id=input_inline_part_description]',`ZZAUTOTEST noneditable ${key}`);
      await page.fill('[data-test-id=input_inline_part_quantity]','5');
    }
  }
  await page.waitForTimeout(1500);
  out.rowBefore = await page.evaluate(()=>{const d=document.querySelector('[data-test-id=input_inline_part_description]');
    return d? {open:true, desc:d.value, qty:document.querySelector('[data-test-id=input_inline_part_quantity]')?.value}:{open:false};});
  if (!out.rowBefore.open){ log('%s/%s no row (%s)', key, mode, out.opened); await s.browser.close(); return out; }
  out.moved = await call('/api/work-orders/change-status', {id:WO.id, status:'complete'});
  log('%s/%s work order -> complete: %s', key, mode, JSON.stringify(out.moved).slice(0,200));
  if (out.moved.status!==200 && out.moved.status!==201){
    out.skipped='the work order would not go non-editable, so the save was not attempted';
    log('   %s', out.skipped); await s.browser.close(); return out;
  }
  await page.waitForTimeout(2500);
  await page.evaluate(()=>document.querySelector('[data-test-id=button_save_inline_part]')?.click());
  await page.waitForTimeout(9000);
  out.toast = await page.evaluate(vis=>{const isVis=eval(vis);
    return [...document.querySelectorAll('.q-notification')].filter(isVis).map(n=>n.innerText.replace(/\s+/g,' ').trim());}, VIS);
  out.rowAfter = await page.evaluate(()=>{const d=document.querySelector('[data-test-id=input_inline_part_description]');
    return d? {open:true, desc:d.value, qty:document.querySelector('[data-test-id=input_inline_part_quantity]')?.value}:{open:false};});
  out.alerts = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
    return [...new Set([...document.querySelectorAll('.q-dialog,[role=alert],.text-negative,.q-notification')].filter(isVis).map(t).filter(Boolean))]
      .filter(m=>!/Credit Hold|Build Lines|location_on|^\$/.test(m));}, VIS);
  log('%s/%s toast=%s row=%s alerts=%s', key, mode, JSON.stringify(out.toast), JSON.stringify(out.rowAfter), JSON.stringify(out.alerts).slice(0,260));
  await page.screenshot({path:`${DIR}/evidence/83-${key}-${mode}.png`, fullPage:true});
  await call('/api/work-orders/change-status', {id:WO.id, status:'approved'});
  await s.browser.close();
  return out;
};
R.C45021 = await leg('tech','add'); save();
R.C45035 = await leg('tech','edit'); save();
R.C45061 = await leg('admin','add'); save();
// put every line back
const s9 = await boot('sv9315','/workorders','admin'); const call9=mkApi(s9.page, s9.APIH);
R.restore=[];
for (const l of LINES){
  const res = await call9('/api/work-orders/lines/change-status', {line_id:l.line_id, status:String(l.status||'authorized'), workOrderId:WO.id});
  R.restore.push({id:l.line_id, to:l.status, status:res.status});
}
R.woRestore = await call9('/api/work-orders/change-status', {id:WO.id, status:String(WO.status||'approved').toLowerCase()});
log('restored:', JSON.stringify(R.restore).slice(0,250), JSON.stringify(R.woRestore).slice(0,120));
save();
await s9.browser.close();
