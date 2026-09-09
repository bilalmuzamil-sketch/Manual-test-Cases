// Full View batch A: C45036 (six fields in order) · C45041 (Save/More options/X) ·
// C45050 (Tab order stays in the row) · C45044 (More Options modal) · C45045 (values carry over) ·
// C45047 (cancelling the modal returns to the row with data intact, nothing discarded).
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/inline-add-edit-parts/execution-2026-09-09';
const EST='b90d6e97-3f47-4745-8cc6-73765802d6ab';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const VIS=`(e)=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);
  return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden'&&parseFloat(c.opacity)>0.01;}`;
const s = await boot('sv9315','/workorders','admin'); const { page, APP } = s;
const R={ build: await page.evaluate(()=>document.querySelector('meta[name=app-version]')?.content),
          viewMode: await page.evaluate(()=>{const r=JSON.parse(localStorage.getItem('fe_permissions_wrapper')||'{}');return (r.data??r).view_mode;}) };
log('build', R.build, '| view', R.viewMode);
await page.goto(`${APP}/workorders/${EST}/lines`,{waitUntil:'domcontentloaded',timeout:60000});
await page.waitForTimeout(10000);
await page.evaluate(()=>{[...document.querySelectorAll('.q-expansion-item')].forEach(i=>i.querySelector('.q-item')?.click());});
await page.waitForTimeout(7000);
await page.evaluate(()=>{const b=document.querySelector('[data-test-id=button_add_part]'); b.scrollIntoView({block:'center'}); b.click();});
await page.waitForTimeout(5000);

// ---- C45036 + C45041 : fields in DOM order, and the row's actions
R.C45036_41 = await page.evaluate(vis=>{
  const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const desc=document.querySelector('[data-test-id=input_inline_part_description]');
  let box=desc; for(let i=0;i<9&&box.parentElement;i++){ box=box.parentElement;
    if(box.querySelector('[data-test-id=button_save_inline_part]')) break; }
  const fields=[...box.querySelectorAll('input,select')].filter(isVis).map(i=>({
    tid:i.getAttribute('data-test-id'),
    label:(()=>{const p=i.closest('.q-field'); const l=p&&p.querySelector('.q-field__label'); return l?t(l):null;})(),
    x:Math.round(i.getBoundingClientRect().x)}));
  fields.sort((a,b)=>a.x-b.x);
  const btns=[...box.querySelectorAll('button,.q-btn')].filter(isVis).map(b=>({
    label:t(b), tid:b.getAttribute('data-test-id'), x:Math.round(b.getBoundingClientRect().x)}));
  btns.sort((a,b)=>a.x-b.x);
  return { fieldOrder:fields.map(f=>f.label||f.tid), fields, buttons:btns };
}, VIS);
log('C45036 field order L->R:', JSON.stringify(R.C45036_41.fieldOrder));
log('C45041 actions L->R   :', JSON.stringify(R.C45036_41.buttons.map(b=>b.label)));

// ---- C45050 : Tab order, and whether focus ever leaves the row
await page.click('[data-test-id=input_inline_part_description]');
const seq=[];
for (let i=0;i<11;i++){
  const cur = await page.evaluate(()=>{const a=document.activeElement;
    return a? (a.getAttribute('data-test-id') || (a.textContent||'').replace(/\s+/g,' ').trim().slice(0,22) || a.tagName) : null;});
  seq.push(cur);
  await page.keyboard.press('Tab'); await page.waitForTimeout(260);
}
R.C45050 = { tabSequence:seq };
log('C45050 tab order:', JSON.stringify(seq));

// ---- fill the row, then C45044 / C45045 : More Options carries values into the modal
await page.fill('[data-test-id=input_inline_part_description]','ZZAUTOTEST fullview part');
await page.fill('[data-test-id=input_inline_part_quantity]','3');
await page.fill('[data-test-id=input_inline_part_cost]','12.50').catch(()=>{});
await page.fill('[data-test-id=input_inline_part_sell_price]','25.00').catch(()=>{});
await page.waitForTimeout(1500);
R.typed = await page.evaluate(()=>({d:document.querySelector('[data-test-id=input_inline_part_description]')?.value,
  q:document.querySelector('[data-test-id=input_inline_part_quantity]')?.value,
  c:document.querySelector('[data-test-id=input_inline_part_cost]')?.value,
  s:document.querySelector('[data-test-id=input_inline_part_sell_price]')?.value}));
log('typed into row:', JSON.stringify(R.typed));
await page.screenshot({path:`${DIR}/evidence/26-a-filled.png`, fullPage:true});

await page.evaluate(()=>document.querySelector('[data-test-id=button_more_options_inline_part]')?.click());
await page.waitForTimeout(6000);
R.C45044_45 = await page.evaluate(vis=>{
  const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const d=[...document.querySelectorAll('.q-dialog')].filter(isVis)[0];
  if(!d) return {modalOpen:false};
  const title=t(d.querySelector('.q-card__section,.text-h6,h1,h2,h3')||d).slice(0,60);
  const vals=[...d.querySelectorAll('input,select')].filter(isVis).map(i=>({
    label:(()=>{const p=i.closest('.q-field'); const l=p&&p.querySelector('.q-field__label'); return l?t(l):null;})(),
    tid:i.getAttribute('data-test-id'), value:(i.value||'').slice(0,26)}));
  return { modalOpen:true, title, values:vals.filter(v=>v.label||v.tid),
           buttons:[...d.querySelectorAll('button')].filter(isVis).map(b=>t(b).slice(0,22)) };
}, VIS);
log('C45044 modal:', R.C45044_45.title, '| open:', R.C45044_45.modalOpen);
log('C45045 carried values:', JSON.stringify((R.C45044_45.values||[]).filter(v=>v.value)));
await page.screenshot({path:`${DIR}/evidence/26-b-modal.png`, fullPage:true});

// ---- C45047 : change something in the modal, cancel, and check the row is untouched
await page.evaluate(()=>{const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const d=[...document.querySelectorAll('.q-dialog')].pop();
  const q=[...d.querySelectorAll('input')].find(i=>{const p=i.closest('.q-field'); const l=p&&p.querySelector('.q-field__label'); return l&&/qty|quantity/i.test(t(l));});
  if(q){ q.focus(); q.value='99'; q.dispatchEvent(new Event('input',{bubbles:true})); }});
await page.waitForTimeout(1500);
const cancelled = await page.evaluate(()=>{const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const d=[...document.querySelectorAll('.q-dialog')].pop();
  const b=[...d.querySelectorAll('button')].find(x=>/^cancel$/i.test(t(x)));
  if(b){b.click(); return 'clicked Cancel';} return 'no Cancel button: '+JSON.stringify([...d.querySelectorAll('button')].map(x=>t(x).slice(0,18)));});
log('C45047 cancel:', cancelled);
await page.waitForTimeout(5000);
R.C45047 = await page.evaluate(vis=>{
  const isVis=eval(vis);
  const dlg=[...document.querySelectorAll('.q-dialog')].filter(isVis).length;
  const g=t=>document.querySelector(`[data-test-id=${t}]`)?.value;
  return { modalsStillOpen:dlg, confirmationShown:/Discard|lost/i.test(document.body.innerText||''),
    rowStillOpen:!!document.querySelector('[data-test-id=input_inline_part_description]'),
    d:g('input_inline_part_description'), q:g('input_inline_part_quantity'),
    c:g('input_inline_part_cost'), s:g('input_inline_part_sell_price') };
}, VIS);
log('C45047 after cancel:', JSON.stringify(R.C45047));
await page.screenshot({path:`${DIR}/evidence/26-c-after-cancel.png`, fullPage:true});
fs.writeFileSync(`${DIR}/evidence/26-fv-a.json`, JSON.stringify(R,null,1));
await s.browser.close();
