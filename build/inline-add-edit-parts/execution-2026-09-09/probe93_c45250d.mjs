// C45250 clause 2, properly. Probes 84 and 90 both ran as admin (Full View) and filled ONLY the
// description and quantity, so the save was refused with "Enter a cost and sell price to save this
// part." — a validation message, not a silent failure. That nearly went down as a defect. Every
// required field is filled here, and the leg is run in BOTH views so the Tech View path (three
// fields only) is covered too.
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/inline-add-edit-parts/execution-2026-09-09';
const WOID='6a529a5f-dff9-4c13-9636-b41500e585f0';
const LINEID='b80d7553-0a8f-45f5-910a-8052573332d5';
const LINENAME='TEST';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const VIS=`(e)=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);
  return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden'&&parseFloat(c.opacity)>0.01;}`;
const R={};
const save=()=>fs.writeFileSync(`${DIR}/evidence/93-c45250d.json`, JSON.stringify(R,null,1));
const mkApi=(page,APIH)=>(path, body)=>page.evaluate(async ({api,path,body})=>{
  const r=await fetch(`https://${api}${path}`, body? {method:'POST',
      headers:{'Content-Type':'application/json',Accept:'application/json'}, credentials:'include', body:JSON.stringify(body)}
    : {headers:{Accept:'application/json'}, credentials:'include'});
  let t=null; try{ t=await r.text(); }catch(e){}
  let j=null; try{ j=JSON.parse(t); }catch(e){}
  return {status:r.status, json:j, text:(t||'').slice(0,200)};}, {api:APIH, path, body:body||null});
const rowsOf=(j)=>{const pick=o=>{ for (const k of ['collection','data','rows','items','results']){ if (Array.isArray(o&&o[k])) return o[k]; }
  if (Array.isArray(o)) return o; for (const k of Object.keys(o||{})){ const v=pick(o[k]); if (v&&v.length) return v; } return []; }; return pick(j);};

const leg = async (key)=>{
  const s = await boot('sv9315','/workorders',key); const {page, APP, APIH}=s; const api=mkApi(page,APIH); const out={key};
  const lineNow = async ()=>{ const d = await api(`/api/work-orders/lines/${WOID}`);
    const l = rowsOf(d.json).find(x=>x.line_id===LINEID);
    return l ? {status:l.status, requests:(l.part_requests||[]).length} : {missing:true}; };
  out.before = await lineNow();
  if (String(out.before.status||'').toLowerCase()!=='complete'){
    await api('/api/work-orders/lines/change-status', {line_id:LINEID, status:'complete', workOrderId:WOID});
    out.before = await lineNow();
  }
  log('%s | line before: %s', key, JSON.stringify(out.before));
  if (String(out.before.status||'').toLowerCase()!=='complete'){
    out.skipped='the line is not Complete — nothing observed'; log('   %s', out.skipped);
    await s.browser.close(); return out; }
  await page.goto(`${APP}/workorders/${WOID}/lines`,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForTimeout(9000);
  await page.evaluate(()=>{[...document.querySelectorAll('.q-expansion-item')].forEach(i=>i.querySelector('.q-item')?.click());});
  await page.waitForTimeout(7000);
  out.clicked = await page.evaluate(({vis,name})=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
    const hit=[...document.querySelectorAll('*')].filter(e=>e.children.length===0&&isVis(e)&&t(e)===name);
    for (const h of hit){ let box=h;
      for (let i=0;i<10&&box.parentElement;i++){ box=box.parentElement;
        const add=box.querySelector('[data-test-id=button_add_part]');
        if (add){ add.scrollIntoView({block:'center'}); add.click();
          return {ok:true, block:(box.innerText||'').replace(/\s+/g,' ').trim().slice(0,140)}; } } }
    return {ok:false};}, {vis:VIS, name:LINENAME});
  await page.waitForTimeout(5000);
  const DESC = `ZZAUTOTEST c45250 ${key}`;
  out.rowOpen = await page.evaluate(()=>!!document.querySelector('[data-test-id=input_inline_part_description]'));
  log('%s | clicked=%s rowOpen=%s', key, JSON.stringify(out.clicked).slice(0,150), out.rowOpen);
  if (!out.rowOpen){ out.skipped='no row opened'; await s.browser.close(); return out; }
  await page.fill('[data-test-id=input_inline_part_description]', DESC);
  await page.fill('[data-test-id=input_inline_part_quantity]','2');
  // fill EVERY required field this view has — the step probes 84 and 90 missed
  if (await page.$('[data-test-id=input_inline_part_cost]')) await page.fill('[data-test-id=input_inline_part_cost]','4.00');
  if (await page.$('[data-test-id=input_inline_part_sell_price]')) await page.fill('[data-test-id=input_inline_part_sell_price]','9.00');
  await page.waitForTimeout(1500);
  out.filled = await page.evaluate(()=>{const g=t=>{const e=document.querySelector(`[data-test-id=${t}]`); return e? e.value : null;};
    return {desc:g('input_inline_part_description'), qty:g('input_inline_part_quantity'),
            cost:g('input_inline_part_cost'), sell:g('input_inline_part_sell_price')};});
  await page.evaluate(()=>document.querySelector('[data-test-id=button_save_inline_part]')?.click());
  await page.waitForTimeout(10000);
  out.toast = await page.evaluate(vis=>{const isVis=eval(vis);
    return [...document.querySelectorAll('.q-notification')].filter(isVis).map(n=>n.innerText.replace(/\s+/g,' ').trim());}, VIS);
  out.messages = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
    return [...new Set([...document.querySelectorAll('.q-field__messages,.text-negative,[role=alert]')].filter(isVis).map(t).filter(Boolean))]
      .filter(m=>!/Credit Hold|Build Lines|location_on|^\$/.test(m));}, VIS);
  await page.waitForTimeout(2000);
  out.after = await lineNow();
  out.onScreen = await page.evaluate(n=>new RegExp(n).test(document.body.innerText||''), DESC);
  log('%s | filled=%s', key, JSON.stringify(out.filled));
  log('%s | toast=%s messages=%s', key, JSON.stringify(out.toast), JSON.stringify(out.messages).slice(0,200));
  log('%s | line after=%s | part on screen=%s', key, JSON.stringify(out.after), out.onScreen);
  await page.screenshot({path:`${DIR}/evidence/93-${key}.png`, fullPage:true});
  await s.browser.close();
  return out;
};
R.tech = await leg('tech'); save();
R.admin = await leg('admin'); save();
