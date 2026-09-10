// (a) Find a part held in more than one bin THROUGH THE UI. The API route is a dead end: every
//     `binLocation=<id>` query returned the same 200 rows, so the filter is ignored — the giveaway
//     was eight different bins each reporting exactly 200 parts (playbook §S: these list endpoints
//     ignore filters silently). Settings -> Bin Locations shows small, real per-bin counts
//     (A1A 14, A1B 20, A1C 13) and each count links to that bin's parts, so the UI is the truth.
// (b) Confirm C45250 clause 2. On a Complete line the "+ Add Part" button IS offered and the row
//     opens, but probe 84's part never landed — no toast, no request, no part, line still Complete.
//     Run once more before that is called.
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
const save=()=>fs.writeFileSync(`${DIR}/evidence/90-bins-ui.json`, JSON.stringify(R,null,1));
const api = (path, body)=>page.evaluate(async ({api,path,body})=>{
  const r=await fetch(`https://${api}${path}`, body? {method:'POST',
      headers:{'Content-Type':'application/json',Accept:'application/json'}, credentials:'include', body:JSON.stringify(body)}
    : {headers:{Accept:'application/json'}, credentials:'include'});
  let t=null; try{ t=await r.text(); }catch(e){}
  let j=null; try{ j=JSON.parse(t); }catch(e){}
  return {status:r.status, json:j, text:(t||'').slice(0,240)};}, {api:APIH, path, body:body||null});
const rowsOf=(j)=>{const pick=o=>{ for (const k of ['collection','data','rows','items','results']){ if (Array.isArray(o&&o[k])) return o[k]; }
  if (Array.isArray(o)) return o; for (const k of Object.keys(o||{})){ const v=pick(o[k]); if (v&&v.length) return v; } return []; }; return pick(j);};

// ---------- (a) read each small bin's parts off the screen ----------
R.byBin={};
for (const bin of ['A1A','A1B','A1C','A1D']){
  await page.goto(`${APP}/parts/inventory?binLocation=${encodeURIComponent(bin)}`,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForTimeout(12000);
  const grab = await page.evaluate(()=>{const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
    const hdr=[...document.querySelectorAll('thead th')].map(t);
    const rows=[...document.querySelectorAll('tbody tr')].map(r=>[...r.querySelectorAll('td')].map(t));
    return {url:location.href, hdr, n:rows.length, rows:rows.slice(0,40)};});
  // the part number is whichever column the header calls it
  const idx = grab.hdr.findIndex(h=>/part\s*number|part #|^part$/i.test(h));
  R.byBin[bin] = {n:grab.n, hdr:grab.hdr, col:idx,
    pns: idx>=0 ? grab.rows.map(r=>r[idx]).filter(Boolean) : grab.rows.map(r=>r[0]).filter(Boolean)};
  log('bin %-4s -> %d rows | headers %s', bin, grab.n, JSON.stringify(grab.hdr).slice(0,140));
  log('       parts: %s', JSON.stringify(R.byBin[bin].pns).slice(0,260));
  await page.screenshot({path:`${DIR}/evidence/90-bin-${bin}.png`, fullPage:true});
  save();
}
const counts={};
for (const [bin,v] of Object.entries(R.byBin)) for (const pn of v.pns) (counts[pn]=counts[pn]||[]).push(bin);
R.multiBin = Object.entries(counts).filter(([,b])=>b.length>1).map(([pn,b])=>({pn, bins:b}));
R.distinctPerBin = Object.fromEntries(Object.entries(R.byBin).map(([k,v])=>[k, v.pns.length]));
log('parts in more than one of these bins: %s', JSON.stringify(R.multiBin).slice(0,400));
save();

// ---------- (b) C45250 clause 2, once more ----------
const lineNow = async ()=>{ const d = await api(`/api/work-orders/lines/${WOID}`);
  const l = rowsOf(d.json).find(x=>x.line_id===LINEID);
  return l ? {status:l.status, requests:(l.part_requests||[]).length, parts:(l.parts||[]).length} : {missing:true}; };
R.c45250Before = await lineNow();
if (String(R.c45250Before.status||'').toLowerCase()!=='complete'){
  await api('/api/work-orders/lines/change-status', {line_id:LINEID, status:'complete', workOrderId:WOID});
  R.c45250Before = await lineNow();
}
log('C45250 line before: %s', JSON.stringify(R.c45250Before));
if (String(R.c45250Before.status||'').toLowerCase()==='complete'){
  await page.goto(`${APP}/workorders/${WOID}/lines`,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForTimeout(9000);
  await page.evaluate(()=>{[...document.querySelectorAll('.q-expansion-item')].forEach(i=>i.querySelector('.q-item')?.click());});
  await page.waitForTimeout(7000);
  R.click = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
    const hit=[...document.querySelectorAll('*')].filter(e=>e.children.length===0&&isVis(e)&&t(e)==='TEST');
    for (const h of hit){ let box=h;
      for (let i=0;i<10&&box.parentElement;i++){ box=box.parentElement;
        const add=box.querySelector('[data-test-id=button_add_part]');
        if (add){ add.scrollIntoView({block:'center'}); add.click();
          return {clicked:true, block:(box.innerText||'').replace(/\s+/g,' ').trim().slice(0,150)}; } } }
    return {clicked:false};}, VIS);
  await page.waitForTimeout(5000);
  const DESC='ZZAUTOTEST c45250 second run';
  R.rowOpen = await page.evaluate(()=>!!document.querySelector('[data-test-id=input_inline_part_description]'));
  if (R.rowOpen){
    await page.fill('[data-test-id=input_inline_part_description]', DESC);
    await page.fill('[data-test-id=input_inline_part_quantity]','2'); await page.waitForTimeout(1500);
    await page.evaluate(()=>document.querySelector('[data-test-id=button_save_inline_part]')?.click());
    await page.waitForTimeout(10000);
    R.toast = await page.evaluate(vis=>{const isVis=eval(vis);
      return [...document.querySelectorAll('.q-notification')].filter(isVis).map(n=>n.innerText.replace(/\s+/g,' ').trim());}, VIS);
    R.rowStillOpen = await page.evaluate(()=>!!document.querySelector('[data-test-id=input_inline_part_description]'));
    R.messages = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
      return [...new Set([...document.querySelectorAll('.q-field__messages,.text-negative,[role=alert],.q-dialog')].filter(isVis).map(t).filter(Boolean))]
        .filter(m=>!/Credit Hold|Build Lines|location_on|^\$/.test(m));}, VIS);
    await page.waitForTimeout(2000);
    R.c45250After = await lineNow();
    R.onScreen = await page.evaluate(n=>new RegExp(n).test(document.body.innerText||''), DESC);
    log('C45250 cl.2 second run — toast=%s rowStillOpen=%s messages=%s', JSON.stringify(R.toast), R.rowStillOpen, JSON.stringify(R.messages).slice(0,200));
    log('   line after: %s | part on screen: %s', JSON.stringify(R.c45250After), R.onScreen);
    await page.screenshot({path:`${DIR}/evidence/90-c45250.png`, fullPage:true});
  }
  save();
}
await s.browser.close();
