// C45250 and the C45021/C45035/C45061 preparation, third attempt.
// What is known now: the lines come from GET /api/work-orders/lines/{workOrderId} and the key is
// `line_id`. What blocked probe 65: GET /api/work-orders/part/list-requests ignores every filter and
// returns the first 100 rows from across the estate (playbook §S), so filtering it client-side by
// work_order_id found nothing. The part requests are read off the LINE object here instead.
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/inline-add-edit-parts/execution-2026-09-09';
const SUITE_WO='b90d6e97-3f47-4745-8cc6-73765802d6ab';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const VIS=`(e)=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);
  return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden'&&parseFloat(c.opacity)>0.01;}`;
const s = await boot('sv9315','/workorders','admin'); const { page, APP, APIH } = s;
const R={};
const save=()=>fs.writeFileSync(`${DIR}/evidence/78-c45250b.json`, JSON.stringify(R,null,1));
const api = (path, body)=>page.evaluate(async ({api,path,body})=>{
  const r=await fetch(`https://${api}${path}`, body? {method:'POST',
      headers:{'Content-Type':'application/json',Accept:'application/json'}, credentials:'include', body:JSON.stringify(body)}
    : {headers:{Accept:'application/json'}, credentials:'include'});
  let t=null; try{ t=await r.text(); }catch(e){}
  let j=null; try{ j=JSON.parse(t); }catch(e){}
  return {status:r.status, json:j, text:(t||'').slice(0,400)};}, {api:APIH, path, body:body||null});
const rowsOf=(j)=>{const pick=o=>{ for (const k of ['collection','data','rows','items','results']){ if (Array.isArray(o&&o[k])) return o[k]; }
  if (Array.isArray(o)) return o; for (const k of Object.keys(o||{})){ const v=pick(o[k]); if (v&&v.length) return v; } return []; }; return pick(j);};

const WOID='6a529a5f-dff9-4c13-9636-b41500e585f0';   // the spare probe 65 chose
const lines = await api(`/api/work-orders/lines/${WOID}`);
const L = rowsOf(lines.json);
R.lineShape = L[0] ? {keys:Object.keys(L[0]), sample:JSON.stringify(L[0]).slice(0,1200)} : {none:true};
log('line keys:', JSON.stringify(R.lineShape.keys));
log('line sample:', R.lineShape.sample);
save();
// find part-request ids wherever they live on the line
R.requestIds = L.flatMap(l=>{
  const out=[];
  for (const [k,v] of Object.entries(l)){
    if (Array.isArray(v) && v.length && typeof v[0]==='object'){
      for (const item of v){ if (item && (item.part_request_id || item.id) && (item.status!==undefined || item.part_number!==undefined))
        out.push({line:l.line_id, key:k, id:item.part_request_id||item.id, status:item.status, pn:item.part_number}); }
    }
  }
  return out;});
log('part requests found on the lines:', JSON.stringify(R.requestIds).slice(0,600));
save();
if (!R.requestIds.length){
  // last resort: the unfiltered list, matched on the work order id inside each row
  const all = await api('/api/work-orders/part/list-requests');
  const rows = rowsOf(all.json);
  R.listRequestsShape = rows[0] ? Object.keys(rows[0]) : null;
  R.matched = rows.filter(x=>JSON.stringify(x).includes(WOID)).map(x=>({id:x.id, status:x.status, pn:x.part_number}));
  log('list-requests keys:', JSON.stringify(R.listRequestsShape));
  log('rows mentioning this work order:', JSON.stringify(R.matched).slice(0,400));
  save();
}
const ids = (R.requestIds.length? R.requestIds : (R.matched||[])).map(x=>x.id).filter(Boolean);
R.picks=[];
for (const id of ids){
  const res = await api('/api/work-orders/part/perform-request-status-action', {part_request_id:id, action:'pick'});
  R.picks.push({id, status:res.status, body:res.text.slice(0,120)});
}
log('pick results:', JSON.stringify(R.picks).slice(0,500));
save();
const LINE = L[0];
R.lineComplete = await api('/api/work-orders/lines/change-status', {line_id:LINE.line_id, status:'complete', workOrderId:WOID});
log('line -> complete:', JSON.stringify(R.lineComplete).slice(0,300));
save();
if (R.lineComplete.status===200 || R.lineComplete.status===201){
  const openWO=async()=>{await page.goto(`${APP}/workorders/${WOID}/lines`,{waitUntil:'domcontentloaded',timeout:60000});
    await page.waitForTimeout(9000);
    await page.evaluate(()=>{[...document.querySelectorAll('.q-expansion-item')].forEach(i=>i.querySelector('.q-item')?.click());});
    await page.waitForTimeout(7000);};
  await openWO();
  R.C45250_cl1 = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
    const add=[...document.querySelectorAll('[data-test-id=button_add_part]')];
    return {addPart:add.length, addPartVisible:add.filter(isVis).length,
      statuses:[...document.querySelectorAll('.q-chip,.q-badge')].filter(isVis).map(t).filter(x=>/complete|approved|authorized/i.test(x)).slice(0,6)};}, VIS);
  log('C45250 clause 1 — Add Part on a Complete line:', JSON.stringify(R.C45250_cl1));
  await page.screenshot({path:`${DIR}/evidence/78-a-complete.png`, fullPage:true});
  save();
  if (R.C45250_cl1.addPartVisible){
    await page.evaluate(()=>{const b=document.querySelector('[data-test-id=button_add_part]'); b.scrollIntoView({block:'center'}); b.click();});
    await page.waitForTimeout(5000);
    if (await page.$('[data-test-id=input_inline_part_description]')){
      await page.fill('[data-test-id=input_inline_part_description]','ZZAUTOTEST uncomplete check');
      await page.fill('[data-test-id=input_inline_part_quantity]','1'); await page.waitForTimeout(1200);
      await page.evaluate(()=>document.querySelector('[data-test-id=button_save_inline_part]')?.click());
      await page.waitForTimeout(9000);
      const after = await api(`/api/work-orders/lines/${WOID}`);
      const l2 = rowsOf(after.json).find(x=>x.line_id===LINE.line_id);
      R.C45250_cl2 = { toast: await page.evaluate(vis=>{const isVis=eval(vis);
          return [...document.querySelectorAll('.q-notification')].filter(isVis).map(n=>n.innerText.replace(/\s+/g,' ').trim());}, VIS),
        lineStatusAfter: l2 && l2.status };
      log('C45250 clause 2 — after adding to the Complete line:', JSON.stringify(R.C45250_cl2));
      await page.screenshot({path:`${DIR}/evidence/78-b-uncompleted.png`, fullPage:true});
      save();
    }
  }
  R.restore = await api('/api/work-orders/lines/change-status', {line_id:LINE.line_id, status:String(LINE.status||'authorized'), workOrderId:WOID});
  log('line restored:', JSON.stringify(R.restore).slice(0,200));
  save();
}
await s.browser.close();
