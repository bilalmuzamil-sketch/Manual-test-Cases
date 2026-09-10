// C45250, done properly. Probe 82 DID get a line to Complete — but it then clicked the FIRST
// "+ Add Part" on the page, which belongs to whichever line comes first, not necessarily the
// Complete one; its "the line stayed complete" reading therefore proves nothing. (Probe 65 made the
// same class of mistake and was caught.) This one finds the Complete line's OWN Parts section by the
// line's displayed name and clicks that line's button, and it reads the line's status by line_id
// before and after.
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/inline-add-edit-parts/execution-2026-09-09';
const WOID='6a529a5f-dff9-4c13-9636-b41500e585f0';
const LINEID='b80d7553-0a8f-45f5-910a-8052573332d5';   // the line probe 82 completed
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const VIS=`(e)=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);
  return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden'&&parseFloat(c.opacity)>0.01;}`;
const s = await boot('sv9315','/workorders','admin'); const { page, APP, APIH } = s;
const R={};
const save=()=>fs.writeFileSync(`${DIR}/evidence/84-c45250c.json`, JSON.stringify(R,null,1));
const api = (path, body)=>page.evaluate(async ({api,path,body})=>{
  const r=await fetch(`https://${api}${path}`, body? {method:'POST',
      headers:{'Content-Type':'application/json',Accept:'application/json'}, credentials:'include', body:JSON.stringify(body)}
    : {headers:{Accept:'application/json'}, credentials:'include'});
  let t=null; try{ t=await r.text(); }catch(e){}
  let j=null; try{ j=JSON.parse(t); }catch(e){}
  return {status:r.status, json:j, text:(t||'').slice(0,300)};}, {api:APIH, path, body:body||null});
const rowsOf=(j)=>{const pick=o=>{ for (const k of ['collection','data','rows','items','results']){ if (Array.isArray(o&&o[k])) return o[k]; }
  if (Array.isArray(o)) return o; for (const k of Object.keys(o||{})){ const v=pick(o[k]); if (v&&v.length) return v; } return []; }; return pick(j);};
const lineNow = async ()=>{ const d = await api(`/api/work-orders/lines/${WOID}`);
  const l = rowsOf(d.json).find(x=>x.line_id===LINEID);
  return l ? {status:l.status, name:l.line_name, parts:(l.part_requests||[]).length} : {missing:true}; };

R.before = await lineNow();
log('the target line before anything:', JSON.stringify(R.before));
if (R.before.missing || String(R.before.status).toLowerCase()!=='complete'){
  R.setComplete = await api('/api/work-orders/lines/change-status', {line_id:LINEID, status:'complete', workOrderId:WOID});
  log('put it back to Complete:', JSON.stringify(R.setComplete).slice(0,160));
  R.before = await lineNow();
  log('now:', JSON.stringify(R.before));
}
save();
if (String(R.before.status||'').toLowerCase()!=='complete'){
  log('the line is not Complete, so C45250 cannot be observed — stopping rather than recording a false pass');
  await s.browser.close(); process.exit(0);
}
await page.goto(`${APP}/workorders/${WOID}/lines`,{waitUntil:'domcontentloaded',timeout:60000});
await page.waitForTimeout(9000);
await page.evaluate(()=>{[...document.querySelectorAll('.q-expansion-item')].forEach(i=>i.querySelector('.q-item')?.click());});
await page.waitForTimeout(7000);
// find THIS line's own block by its displayed name, and the Add Part button inside it
R.target = await page.evaluate(({vis, name})=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const hit=[...document.querySelectorAll('*')].filter(e=>e.children.length===0&&isVis(e)&&t(e)===name);
  if(!hit.length) return {found:false, why:'line name "'+name+'" not on the page'};
  for (const h of hit){
    let box=h;
    for (let i=0;i<10&&box.parentElement;i++){
      box=box.parentElement;
      const add=box.querySelector('[data-test-id=button_add_part]');
      if (add){
        const blockText=(box.innerText||'').replace(/\s+/g,' ').trim();
        return {found:true, blockText:blockText.slice(0,220),
          saysComplete:/complete/i.test(blockText),
          addPartCount:box.querySelectorAll('[data-test-id=button_add_part]').length};
      }
    }
  }
  return {found:false, why:'no Add Part inside that line block'};}, {vis:VIS, name:R.before.name});
log('C45250 cl.1 — the Complete line\'s own block:', JSON.stringify(R.target));
await page.screenshot({path:`${DIR}/evidence/84-a-completeline.png`, fullPage:true});
save();
if (R.target.found && R.target.addPartCount){
  R.clicked = await page.evaluate(({vis, name})=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
    const hit=[...document.querySelectorAll('*')].filter(e=>e.children.length===0&&isVis(e)&&t(e)===name);
    for (const h of hit){ let box=h;
      for (let i=0;i<10&&box.parentElement;i++){ box=box.parentElement;
        const add=box.querySelector('[data-test-id=button_add_part]');
        if (add){ add.scrollIntoView({block:'center'}); add.click(); return 'clicked the line own Add Part'; } } }
    return 'not clicked';}, {vis:VIS, name:R.before.name});
  await page.waitForTimeout(5000);
  R.rowOpened = await page.evaluate(()=>!!document.querySelector('[data-test-id=input_inline_part_description]'));
  log('clicked=%s rowOpened=%s', R.clicked, R.rowOpened);
  if (R.rowOpened){
    await page.fill('[data-test-id=input_inline_part_description]','ZZAUTOTEST uncompletes this line');
    await page.fill('[data-test-id=input_inline_part_quantity]','1'); await page.waitForTimeout(1500);
    await page.evaluate(()=>document.querySelector('[data-test-id=button_save_inline_part]')?.click());
    await page.waitForTimeout(9000);
    R.toast = await page.evaluate(vis=>{const isVis=eval(vis);
      return [...document.querySelectorAll('.q-notification')].filter(isVis).map(n=>n.innerText.replace(/\s+/g,' ').trim());}, VIS);
    R.after = await lineNow();
    log('C45250 cl.2 — toast=%s | the SAME line by id is now: %s', JSON.stringify(R.toast), JSON.stringify(R.after));
    await page.screenshot({path:`${DIR}/evidence/84-b-after.png`, fullPage:true});
    save();
  }
}
await s.browser.close();
