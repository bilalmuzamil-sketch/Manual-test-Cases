// Two last things for suite 6597.
// (a) C45035 + C45061. Every spare work order now carries part requests — my own testing used them
//     all up — and work order S9315-15893 has one line permanently blocked by a request stuck at
//     `waiting_to_receive` (pick refuses it; remove-request and delete-request both 404). The
//     playbook records that a LINE can be deleted in any status except Complete, and that line is
//     `authorized`, so it is removed and the work order is left with one clean line.
// (b) C45250 clause 2, verified after a full reload rather than while the row is still on screen —
//     probe 93's "the description is on the page" could simply have been the open row.
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/inline-add-edit-parts/execution-2026-09-09';
const WOID='12c9684e-50d7-4043-86d2-f8a83d321431';
const BLOCKED_LINE='a52af727-7b35-49a5-9138-e679b24c48e7';
const KEEP_LINE='e004c99a-16c7-48b5-8ee9-1b430a526ec3';
const C45250_WO='6a529a5f-dff9-4c13-9636-b41500e585f0';
const C45250_LINE='b80d7553-0a8f-45f5-910a-8052573332d5';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const VIS=`(e)=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);
  return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden'&&parseFloat(c.opacity)>0.01;}`;
const R={};
const save=()=>fs.writeFileSync(`${DIR}/evidence/95-final.json`, JSON.stringify(R,null,1));
const mkApi=(page,APIH)=>(path, body)=>page.evaluate(async ({api,path,body})=>{
  const r=await fetch(`https://${api}${path}`, body? {method:'POST',
      headers:{'Content-Type':'application/json',Accept:'application/json'}, credentials:'include', body:JSON.stringify(body)}
    : {headers:{Accept:'application/json'}, credentials:'include'});
  let t=null; try{ t=await r.text(); }catch(e){}
  let j=null; try{ j=JSON.parse(t); }catch(e){}
  return {status:r.status, json:j, text:(t||'').slice(0,220)};}, {api:APIH, path, body:body||null});
const rowsOf=(j)=>{const pick=o=>{ for (const k of ['collection','data','rows','items','results']){ if (Array.isArray(o&&o[k])) return o[k]; }
  if (Array.isArray(o)) return o; for (const k of Object.keys(o||{})){ const v=pick(o[k]); if (v&&v.length) return v; } return []; }; return pick(j);};

// ================= (b) C45250 clause 2, after a reload =================
{
  const s = await boot('sv9315','/workorders','tech'); const {page, APP, APIH}=s; const api=mkApi(page,APIH);
  const lineNow = async ()=>{ const d = await api(`/api/work-orders/lines/${C45250_WO}`);
    const l = rowsOf(d.json).find(x=>x.line_id===C45250_LINE);
    return l ? {status:l.status, requests:(l.part_requests||[]).length,
                names:(l.part_requests||[]).map(x=>(x.description||'').slice(0,34))} : {missing:true}; };
  R.c45250 = {before: await lineNow()};
  await page.goto(`${APP}/workorders/${C45250_WO}/lines`,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForTimeout(9000);
  await page.evaluate(()=>{[...document.querySelectorAll('.q-expansion-item')].forEach(i=>i.querySelector('.q-item')?.click());});
  await page.waitForTimeout(7000);
  R.c45250.savedRowsOnScreen = await page.evaluate(()=>/ZZAUTOTEST c45250 tech/.test(document.body.innerText||''));
  R.c45250.after = await lineNow();
  log('C45250 cl.2 after a full reload — line: %s | the typed part on screen: %s',
      JSON.stringify(R.c45250.after), R.c45250.savedRowsOnScreen);
  await page.screenshot({path:`${DIR}/evidence/95-a-c45250.png`, fullPage:true});
  save();
  await s.browser.close();
}
// ================= (a) clear the blocked line, then C45035 / C45061 =================
{
  const s = await boot('sv9315','/workorders','admin'); const {page, APP, APIH}=s; const api=mkApi(page,APIH);
  await api('/api/work-orders/change-status', {id:WOID, status:'approved'});
  await api('/api/work-orders/lines/change-status', {line_id:BLOCKED_LINE, status:'authorized', workOrderId:WOID});
  for (const body of [{line_ids:[BLOCKED_LINE], workOrderId:WOID}, {lineIds:[BLOCKED_LINE], workOrderId:WOID},
                      {ids:[BLOCKED_LINE], work_order_id:WOID}]){
    const res = await api('/api/work-orders/lines/delete-lines', body);
    R.deleteLine = {body:Object.keys(body), status:res.status, text:res.text.slice(0,140)};
    log('delete the blocked line -> %s %s', res.status, res.text.slice(0,110));
    if (res.status===200||res.status===201) break;
  }
  const d = await api(`/api/work-orders/lines/${WOID}`);
  R.linesLeft = rowsOf(d.json).map(l=>({id:l.line_id, status:l.status, reqs:(l.part_requests||[]).length}));
  log('lines left:', JSON.stringify(R.linesLeft));
  save();
  await s.browser.close();
}
