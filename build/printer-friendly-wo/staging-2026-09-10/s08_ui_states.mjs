// Build the last three states THROUGH THE SCREEN. Behind the screen all of it refused:
// adding a no-parts line 500'd, and all three technician-assignment routes gave 500/404/500.
// Rule 107 route 3: try the other surface.
//
// Also corrects a misreading: the API's `parts` list on these lines is EMPTY, yet the printout
// shows "Parts | Misc hardware/ fittings | 1". Those rows are PART REQUESTS, not fulfilled parts.
// So the blank part-number column may simply be a request with no catalogue link — which is why a
// part with a REAL part number has to be added before the part-number case can be judged at all.
import { boot2, APP, API_HOST } from '/home/user/Manual-test-Cases/build/testing-tools/staging-boot2.mjs';
import { settle } from '/home/user/Manual-test-Cases/build/testing-tools/probe_guard.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/printer-friendly-wo/staging-2026-09-10';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const VIS=`(e)=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);
  return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden'&&parseFloat(c.opacity)>0.01;}`;
const R={}; const save=()=>fs.writeFileSync(`${DIR}/evidence/s08-ui-states.json`, JSON.stringify(R,null,1));
const WO='9e1934ae-a2f7-41f1-baae-0ee5690e9a96';
const rowsOf=(j)=>{const pick=o=>{ for (const k of ['collection','data','rows','items','results']){ if (Array.isArray(o&&o[k])) return o[k]; }
  if (Array.isArray(o)) return o; for (const k of Object.keys(o||{})){ const v=pick(o[k]); if (v&&v.length) return v; } return []; }; return pick(j);};

const s = await boot2('admin', {route:`/workorders/${WO}/lines`});
const {page} = s;
const call=(m,p)=>page.evaluate(async({api,m,p})=>{const r=await fetch(`https://${api}${p}`,{method:m,
  headers:{Accept:'application/json'},credentials:'include'});const t=await r.text();let j=null;try{j=JSON.parse(t)}catch(e){}
  return{status:r.status,json:j};},{api:API_HOST,m,p});
const lines=async()=>rowsOf((await call('GET',`/api/work-orders/lines/${WO}`)).json);
const clickText=(re)=>page.evaluate(({vis,re})=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const rx=new RegExp(re,'i');
  const b=[...document.querySelectorAll('button,[role=button],a')].filter(isVis).find(e=>rx.test(t(e)));
  if(!b) return {clicked:false, seen:[...document.querySelectorAll('button')].filter(isVis).map(t).filter(Boolean).slice(0,22)};
  b.scrollIntoView({block:'center'}); b.click(); return {clicked:true, label:t(b)};},{vis:VIS,re:re.source||re});
const setVal=(tid,val)=>page.evaluate(({tid,val})=>{const i=document.querySelector(`[data-test-id="${tid}"]`);
  if(!i) return {found:false}; i.focus();
  const proto=i.tagName==='TEXTAREA'?window.HTMLTextAreaElement.prototype:window.HTMLInputElement.prototype;
  const S=Object.getOwnPropertyDescriptor(proto,'value').set; S.call(i,val);
  i.dispatchEvent(new Event('input',{bubbles:true})); i.dispatchEvent(new Event('change',{bubbles:true}));
  return {found:true};},{tid,val});

await settle(page,{label:'lines'});
R.before = (await lines()).map(l=>({id:l.line_id.slice(0,8), reqs:(l.part_requests||[]).length,
  parts:(l.parts||[]).length, tech:l.line_tech_assigned_id||null}));
log('lines before: %s', JSON.stringify(R.before));

// ---- A. a line with NO parts: use New Line but do NOT pick a canned line (the canned line is what
//         drags parts in). Type a description instead and give it a time.
R.newLine = await clickText(/^\+?\s*new\s+line$/);
await page.waitForTimeout(4500);
R.formFields = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const d=[...document.querySelectorAll('.q-dialog')].filter(isVis).pop()||document;
  return [...d.querySelectorAll('input,textarea')].filter(isVis).map(i=>({
    label:(()=>{const f=i.closest('.q-field'); const l=f&&f.querySelector('.q-field__label'); return l?t(l):'';})(),
    tid:i.getAttribute('data-test-id')}));}, VIS);
log('New Line form fields: %s', JSON.stringify(R.formFields));
await setVal('input_line_description','ZZAUTOTEST line with no parts');
await setVal('input_time_estimate','1'); await setVal('input_tech_time','1');
await page.waitForTimeout(1500);
R.saveNoParts = await clickText(/save\s*&\s*close/);
await settle(page,{label:'saved'});
R.afterNoParts = (await lines()).map(l=>({id:l.line_id.slice(0,8), name:l.line_name||l.description,
  reqs:(l.part_requests||[]).length, parts:(l.parts||[]).length}));
log('after adding a no-parts line: %s', JSON.stringify(R.afterNoParts));
save();

// ---- B. assign a technician through the Labor row's own menu
await page.goto(`${APP}/workorders/${WO}/lines`,{waitUntil:'domcontentloaded',timeout:60000});
await settle(page,{label:'reload'});
await page.evaluate(()=>{for(const b of document.querySelectorAll('[data-test-id^=button_line_expand_]'))
  if(/expand_more/.test(b.textContent||'')) b.click();});
await page.waitForTimeout(4000);
R.laborControls = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  return [...document.querySelectorAll('[data-test-id]')].filter(isVis)
    .map(e=>e.getAttribute('data-test-id'))
    .filter(x=>/labor|labour|tech|assign/i.test(x)).slice(0,14);}, VIS);
log('labour/technician controls on screen: %s', JSON.stringify(R.laborControls));
save();

// ---- C. add a REAL catalogue part, so the part-number column has something to show
R.addPart = await page.evaluate(vis=>{const isVis=eval(vis);
  const b=[...document.querySelectorAll('[data-test-id=button_add_part]')].filter(isVis)[0];
  if(!b) return {found:false}; b.scrollIntoView({block:'center'}); b.click(); return {found:true};}, VIS);
if (R.addPart.found){
  await page.waitForTimeout(5000);
  await setVal('select_inline_part_number','1');
  await page.waitForTimeout(6000);
  R.typeahead = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
    const o=[...document.querySelectorAll('.q-menu .q-item,[role=option]')].filter(isVis);
    if(!o.length) return {chose:false};
    const label=t(o[0]); o[0].click(); return {chose:true, label:label.slice(0,80), of:o.length};}, VIS);
  log('part chosen from the picker: %s', JSON.stringify(R.typeahead));
  await page.waitForTimeout(3500);
  await setVal('input_inline_part_quantity','2');
  await setVal('input_inline_part_cost','10'); await setVal('input_inline_part_sell_price','20');
  await page.waitForTimeout(1500);
  await page.evaluate(()=>{const b=document.querySelector('[data-test-id=button_save_inline_part]');
    if(b){b.scrollIntoView({block:'center'}); b.click();}});
  await page.waitForTimeout(8000);
}
const ln2 = await lines();
R.afterPart = ln2.map(l=>({id:l.line_id.slice(0,8),
  reqs:(l.part_requests||[]).map(r=>({pn:r.part_number, desc:(r.description||'').slice(0,26), qty:r.quantity})),
  parts:(l.parts||[]).map(p=>({pn:p.part_number, desc:(p.description||'').slice(0,26), qty:p.quantity}))}));
log('after adding a catalogue part: %s', JSON.stringify(R.afterPart).slice(0,700));
R.anyPartNumberNow = JSON.stringify(R.afterPart).match(/"pn":"[^"]+"/g)||[];
log('part numbers now present: %s', JSON.stringify(R.anyPartNumberNow.slice(0,6)));
save();

// ---- print and read
await page.goto(`${APP}/workorders/${WO}/lines`,{waitUntil:'domcontentloaded',timeout:60000});
await settle(page,{label:'reload for print'});
await page.evaluate(()=>{window.__p=0; window.print=function(){window.__p++;};});
await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const tbl=document.querySelector('[data-test-id=table_work_order_lines]');
  const b=[...document.querySelectorAll('button,[role=button]')].filter(isVis)
    .filter(x=>/more_vert|more_horiz/.test(t(x))||/more/i.test(x.getAttribute('data-test-id')||''))
    .filter(x=>!(tbl&&tbl.contains(x)) && !/_line_|_[0-9a-f]{8}-[0-9a-f]{4}-/.test(x.getAttribute('data-test-id')||''))[0];
  if(b) b.click();}, VIS);
await page.waitForTimeout(3000);
await page.evaluate(()=>{const b=document.querySelector('[data-test-id=menu_item_print_work_order]'); if(b) b.click();});
await page.waitForTimeout(6000);
R.print = await page.evaluate(()=>({calls:window.__p, hasRoot:!!document.getElementById('wo-print-root')}));
if (R.print.hasRoot){
  await page.emulateMedia({media:'print'}); await page.waitForTimeout(1800);
  R.printout = await page.evaluate(()=>{const root=document.getElementById('wo-print-root');
    const txt=root.innerText||'';
    return {chars:txt.length, money:[...txt.matchAll(/\$[\d,]+\.?\d*/g)].length, text:txt};});
  log('PRINTOUT %d chars | money %d', R.printout.chars, R.printout.money);
  log('--- full printout ---'); log(R.printout.text.slice(0,2600));
  await page.screenshot({path:`${DIR}/evidence/s08-printout.png`, fullPage:true});
  await page.pdf({path:`${DIR}/evidence/s08-printout.pdf`, format:'A4', printBackground:true}).catch(()=>{});
  await page.emulateMedia({media:'screen'});
}
save();
await s.browser.close();
log('done');
