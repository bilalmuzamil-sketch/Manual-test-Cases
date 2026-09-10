// Evidence screenshots for the three raised tickets: the full screen, with the address bar
// content and the work order number visible, so nobody can ask "which screen was that".
import { boot2, APP, API_HOST } from '/home/user/Manual-test-Cases/build/testing-tools/staging-boot2.mjs';
import { settle } from '/home/user/Manual-test-Cases/build/testing-tools/probe_guard.mjs';
import fs from 'fs';
const OUT='/home/user/Manual-test-Cases/build/defects-2026-09-10/evidence';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const VIS=`(e)=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);
  return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden'&&parseFloat(c.opacity)>0.01;}`;
const R={};
const WO='9e1934ae-a2f7-41f1-baae-0ee5690e9a96';
const rowsOf=(j)=>{const pick=o=>{ for (const k of ['collection','data','rows','items','results']){ if (Array.isArray(o&&o[k])) return o[k]; }
  if (Array.isArray(o)) return o; for (const k of Object.keys(o||{})){ const v=pick(o[k]); if (v&&v.length) return v; } return []; }; return pick(j);};
const s = await boot2('admin', {route:`/workorders/${WO}/lines`});
const {page}=s;
await page.setViewportSize({width:1600, height:1000});
const call=(m,p,b)=>page.evaluate(async({api,m,p,b})=>{const r=await fetch(`https://${api}${p}`,{method:m,
  headers:{'Content-Type':'application/json',Accept:'application/json'},credentials:'include',
  body:b?JSON.stringify(b):undefined});const t=await r.text();let j=null;try{j=JSON.parse(t)}catch(e){}
  return{status:r.status,json:j,text:(t||'').slice(0,200)};},{api:API_HOST,m,p,b:b||null});
const openLines=async(id)=>{ await page.goto(`${APP}/workorders/${id}/lines`,{waitUntil:'domcontentloaded',timeout:60000});
  await settle(page,{label:'lines'});
  await page.evaluate(()=>{for(const b of document.querySelectorAll('[data-test-id^=button_line_expand_]'))
    if(/expand_more/.test(b.textContent||'')) b.click();});
  await page.waitForTimeout(3500); };
// a caption strip along the top carrying the address and the build, so the shot proves itself
const stamp = async (text)=> page.evaluate(t=>{
  let b=document.getElementById('__stamp'); if(!b){ b=document.createElement('div'); b.id='__stamp';
    document.body.prepend(b); }
  b.setAttribute('style','position:fixed;top:0;left:0;right:0;z-index:2147483647;background:#111;'
    +'color:#fff;font:600 15px/1.5 system-ui,sans-serif;padding:7px 14px;letter-spacing:.2px');
  b.textContent = t + '   ·   ' + location.href;
}, text);

// ---- SV-9917: the Declined work order, Add Part and the pencil both present
await call('POST','/api/work-orders/change-status',{id:WO, work_order:WO, status:'declined'});
await openLines(WO);
await page.evaluate(vis=>{const isVis=eval(vis);
  const e=[...document.querySelectorAll('[data-test-id^=button_edit_part_]')].filter(isVis)[0];
  if(e) e.dispatchEvent(new MouseEvent('mouseover',{bubbles:true}));}, VIS);
await stamp('DECLINED work order — staging v26.36.2-617d8d1 — 10 Sep 2026');
await page.waitForTimeout(1200);
await page.screenshot({path:`${OUT}/declined-add-part-still-shown-RAW.png`});
R.declined = await page.evaluate(vis=>{const isVis=eval(vis);
  const a=[...document.querySelectorAll('[data-test-id=button_add_part]')].filter(isVis);
  const box=a[0]?a[0].getBoundingClientRect():null;
  const status=[...document.querySelectorAll('.q-chip,.q-badge')].filter(isVis)
    .map(e=>({t:(e.innerText||'').trim(), r:e.getBoundingClientRect()}))
    .find(x=>/declined/i.test(x.t));
  return {addPart:a.length,
    addBox: box?{x:Math.round(box.x),y:Math.round(box.y),w:Math.round(box.width),h:Math.round(box.height)}:null,
    statusBox: status?{x:Math.round(status.r.x),y:Math.round(status.r.y),w:Math.round(status.r.width),h:Math.round(status.r.height)}:null};}, VIS);
log('declined shot: %s', JSON.stringify(R.declined));

// ---- the same screen on PAID, where it is correct: the before/after pair
await call('POST','/api/work-orders/change-status',{id:WO, work_order:WO, status:'paid'});
await openLines(WO);
await stamp('PAID work order, the SAME job — Add Part correctly absent — staging v26.36.2-617d8d1');
await page.waitForTimeout(1200);
await page.screenshot({path:`${OUT}/paid-add-part-correctly-absent-RAW.png`});
await call('POST','/api/work-orders/change-status',{id:WO, work_order:WO, status:'approved'});

// ---- SV-9918: the part with no price opens at 0.00
await openLines(WO);
await page.evaluate(vis=>{const isVis=eval(vis);
  const b=[...document.querySelectorAll('[data-test-id=button_add_part]')].filter(isVis)[0];
  if(b){ b.scrollIntoView({block:'center'}); b.click(); }}, VIS);
await page.waitForTimeout(4500);
const el = await page.$('[data-test-id="select_inline_part_number"]');
if (el){ await el.click().catch(()=>{}); await page.keyboard.type('ZZAUTOTEST-CAT', {delay:110});
  await page.waitForTimeout(4500);
  await page.evaluate(vis=>{const isVis=eval(vis);
    const o=[...document.querySelectorAll('.q-menu .q-item,[role=option]')].filter(isVis)[0]; if(o) o.click();}, VIS);
  await page.waitForTimeout(4000); }
R.price = await page.evaluate(vis=>{const isVis=eval(vis);
  const g=t=>{const e=document.querySelector(`[data-test-id="${t}"]`);
    if(!e||!isVis(e)) return null; const r=e.getBoundingClientRect();
    return {v:e.value, x:Math.round(r.x), y:Math.round(r.y), w:Math.round(r.width), h:Math.round(r.height)};};
  return {cost:g('input_inline_part_cost'), sell:g('input_inline_part_sell_price'),
    pn:g('select_inline_part_number')};}, VIS);
await stamp('New part row, a catalogue part with NO price — staging v26.36.2-617d8d1 — 10 Sep 2026');
await page.waitForTimeout(1000);
await page.screenshot({path:`${OUT}/no-price-part-opens-at-zero-RAW.png`});
log('price boxes: %s', JSON.stringify(R.price));
await page.keyboard.press('Escape').catch(()=>{});

// ---- SV-9919: a work order with no lines, Print offered and not greyed out
const all = rowsOf((await call('GET','/api/work-orders?limit=200')).json);
let zero=null;
for (const w of all.slice(0,60)){
  const l = rowsOf((await call('GET',`/api/work-orders/lines/${w.id}`)).json);
  if (Array.isArray(l) && l.length===0){ zero={id:w.id, number:w.number}; break; } }
R.zero = zero;
if (zero){
  await page.goto(`${APP}/workorders/${zero.id}/lines`,{waitUntil:'domcontentloaded',timeout:60000});
  await settle(page,{label:'zero'});
  await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.innerText||'').trim();
    const d=[...document.querySelectorAll('.q-dialog')].filter(isVis).pop(); if(!d) return;
    const x=[...d.querySelectorAll('button,i')].find(e=>/close|×/i.test(t(e))); if(x) x.click();}, VIS);
  await page.waitForTimeout(2500);
  await page.evaluate(()=>{const b=document.querySelector('[data-test-id=button_work_order_nav_bar_menu]'); if(b) b.click();});
  await page.waitForTimeout(2500);
  R.menu = await page.evaluate(vis=>{const isVis=eval(vis);
    const it=[...document.querySelectorAll('.q-menu .q-item')].filter(isVis)
      .find(e=>/print work order/i.test(e.innerText||''));
    if(!it) return {found:false};
    const r=it.getBoundingClientRect();
    return {found:true, x:Math.round(r.x), y:Math.round(r.y), w:Math.round(r.width), h:Math.round(r.height),
      greyed: it.classList.contains('disabled')||getComputedStyle(it).pointerEvents==='none'};}, VIS);
  await stamp(`Work order ${zero.number} — it has NO lines — staging v26.36.2-617d8d1 — 10 Sep 2026`);
  await page.waitForTimeout(1000);
  await page.screenshot({path:`${OUT}/no-lines-print-not-greyed-out-RAW.png`});
  log('no-lines menu: %s (%s)', JSON.stringify(R.menu), zero.number);
}
fs.writeFileSync(`${OUT}/shots.json`, JSON.stringify(R,null,1));
log('done');
await s.browser.close();
process.exit(0);
