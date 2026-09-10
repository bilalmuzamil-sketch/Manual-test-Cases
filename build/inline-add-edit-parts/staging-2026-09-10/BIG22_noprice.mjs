// C45060 — the picker offers two kinds of entry: parts held in stock (they show a stock count)
// and catalogue entries that are not held. A catalogue entry is the one the case is about.
// This looks at every entry the picker offers, picks a catalogue one, and reads the two
// price boxes. If everything on the system carries a price, one is made through the Parts
// screen and put back afterwards.
import { boot2, APP, API_HOST } from '/home/user/Manual-test-Cases/build/testing-tools/staging-boot2.mjs';
import { settle } from '/home/user/Manual-test-Cases/build/testing-tools/probe_guard.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/inline-add-edit-parts/staging-2026-09-10';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const VIS=`(e)=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);
  return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden'&&parseFloat(c.opacity)>0.01;}`;
const R={}; const save=()=>fs.writeFileSync(`${DIR}/evidence/BIG22.json`, JSON.stringify(R,null,1));
const WO='9e1934ae-a2f7-41f1-baae-0ee5690e9a96';
const s = await boot2('admin', {route:`/workorders/${WO}/lines`});
const {page}=s;
const openLines=async()=>{ await page.goto(`${APP}/workorders/${WO}/lines`,{waitUntil:'domcontentloaded',timeout:60000});
  await settle(page,{label:'lines'});
  await page.evaluate(()=>{for(const b of document.querySelectorAll('[data-test-id^=button_line_expand_]'))
    if(/expand_more/.test(b.textContent||'')) b.click();});
  await page.waitForTimeout(3500); };
const openAddRow=async()=>{ const ok=await page.evaluate(vis=>{const isVis=eval(vis);
    const b=[...document.querySelectorAll('[data-test-id=button_add_part]')].filter(isVis)[0];
    if(!b) return false; b.scrollIntoView({block:'center'}); b.click(); return true;}, VIS);
  if(ok) await page.waitForTimeout(4500); return ok; };
const typeInto=async(tid,text)=>{ const el=await page.$(`[data-test-id="${tid}"]`); if(!el) return false;
  await el.click({timeout:5000}).catch(()=>{}); await el.fill('').catch(()=>{});
  await page.keyboard.type(text,{delay:110}); await page.waitForTimeout(5000); return true; };
const options=()=>page.evaluate(vis=>{const isVis=eval(vis);
  return [...document.querySelectorAll('.q-menu .q-item,[role=option]')].filter(isVis)
    .map((e,i)=>({i, t:(e.innerText||'').replace(/\s+/g,' ').trim().slice(0,120)}));}, VIS);
const pick=(i)=>page.evaluate(({vis,i})=>{const isVis=eval(vis);
  const o=[...document.querySelectorAll('.q-menu .q-item,[role=option]')].filter(isVis)[i];
  if(o){o.click(); return true;} return false;}, {vis:VIS, i});
const boxes=()=>page.evaluate(vis=>{const isVis=eval(vis);
  const g=t=>{const e=document.querySelector(`[data-test-id="${t}"]`); return e&&isVis(e)?e.value:null;};
  return {pn:g('select_inline_part_number'), desc:g('input_inline_part_description'),
    qty:g('input_inline_part_quantity'), cost:g('input_inline_part_cost'), sell:g('input_inline_part_sell_price')};}, VIS);
const msgs=()=>page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.innerText||'').replace(/\s+/g,' ').trim();
  return {toasts:[...document.querySelectorAll('.q-notification,[role=alert]')].filter(isVis).map(t),
    rowStillOpen:!!document.querySelector('[data-test-id=select_inline_part_number]')};}, VIS);

await settle(page,{label:'start'});
R.rounds=[];
for (const term of ['FILTER','SEAL','BOLT','GASKET','SENSOR']){
  await openLines();
  const opened = await openAddRow(); if(!opened){ R.rounds.push({term, opened}); continue; }
  await typeInto('select_inline_part_number', term);
  const opts = await options();
  const notStocked = opts.filter(o=>!/Inventory Qty/i.test(o.t));
  const round = {term, total:opts.length, notStocked:notStocked.length,
    sample:opts.slice(0,6).map(o=>o.t)};
  if (notStocked.length){
    await pick(notStocked[0].i);
    await page.waitForTimeout(4000);
    round.picked = notStocked[0].t;
    round.boxes = await boxes();
    if (!Number(round.boxes.cost||0) && !Number(round.boxes.sell||0)){
      // the case's second half: the save must be refused until the user types them
      const q=await page.$('[data-test-id="input_inline_part_quantity"]');
      if(q){ await q.click().catch(()=>{}); await page.keyboard.type('1',{delay:80}); }
      await page.waitForTimeout(1200);
      await page.evaluate(()=>{const b=document.querySelector('[data-test-id=button_save_inline_part]'); if(b) b.click();});
      await page.waitForTimeout(5000);
      round.afterSave = await msgs();
    }
    await page.screenshot({path:`${DIR}/evidence/BIG22-${term}.png`, fullPage:true}).catch(()=>{});
  }
  R.rounds.push(round);
  log('%s -> %d offered, %d not held in stock | picked %s | boxes %s | save %s', term, opts.length,
    notStocked.length, JSON.stringify(round.picked||null).slice(0,70),
    JSON.stringify(round.boxes||null), JSON.stringify(round.afterSave||null));
  save();
  await page.keyboard.press('Escape'); await page.waitForTimeout(1200);
  if (round.boxes && !Number(round.boxes.cost||0) && !Number(round.boxes.sell||0)) break;
}
save();
log('done');
await s.browser.close();
process.exit(0);
