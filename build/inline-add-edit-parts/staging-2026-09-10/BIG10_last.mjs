// The last open cases across both suites.
//   C45022  Tech View: any other save failure keeps the row open with the data in it
//   C45035  Tech View: the job goes non-editable under an open EDIT row
//   C45060  Full View: a catalog part with no cost or sell opens those boxes EMPTY
//   C44993/C44994  the Invoiced status, the one status still unchecked
//   C45126  cancelling the print dialog still records the print
import { boot2, APP, API_HOST } from '/home/user/Manual-test-Cases/build/testing-tools/staging-boot2.mjs';
import { settle } from '/home/user/Manual-test-Cases/build/testing-tools/probe_guard.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/inline-add-edit-parts/staging-2026-09-10';
const PDIR='/home/user/Manual-test-Cases/build/printer-friendly-wo/staging-2026-09-10';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const VIS=`(e)=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);
  return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden'&&parseFloat(c.opacity)>0.01;}`;
const R={}; const save=()=>fs.writeFileSync(`${DIR}/evidence/BIG10.json`, JSON.stringify(R,null,1));
const WO='9e1934ae-a2f7-41f1-baae-0ee5690e9a96';
const rowsOf=(j)=>{const pick=o=>{ for (const k of ['collection','data','rows','items','results']){ if (Array.isArray(o&&o[k])) return o[k]; }
  if (Array.isArray(o)) return o; for (const k of Object.keys(o||{})){ const v=pick(o[k]); if (v&&v.length) return v; } return []; }; return pick(j);};
const mk=(page)=>(m,p,b)=>page.evaluate(async({api,m,p,b})=>{const r=await fetch(`https://${api}${p}`,{method:m,
  headers:{'Content-Type':'application/json',Accept:'application/json'},credentials:'include',
  body:b?JSON.stringify(b):undefined});const t=await r.text();let j=null;try{j=JSON.parse(t)}catch(e){}
  return{status:r.status,json:j,text:(t||'').slice(0,240)};},{api:API_HOST,m,p,b:b||null});
const setVal=(page,tid,val)=>page.evaluate(({tid,val})=>{const i=document.querySelector(`[data-test-id="${tid}"]`);
  if(!i) return false; i.focus();
  const proto=i.tagName==='TEXTAREA'?window.HTMLTextAreaElement.prototype:window.HTMLInputElement.prototype;
  const S=Object.getOwnPropertyDescriptor(proto,'value').set; S.call(i,val);
  i.dispatchEvent(new Event('input',{bubbles:true})); i.dispatchEvent(new Event('change',{bubbles:true}));
  return true;},{tid,val});
const openLines=async(page,id)=>{ await page.goto(`${APP}/workorders/${id}/lines`,{waitUntil:'domcontentloaded',timeout:60000});
  await settle(page,{label:'lines'});
  await page.evaluate(()=>{for(const b of document.querySelectorAll('[data-test-id^=button_line_expand_]'))
    if(/expand_more/.test(b.textContent||'')) b.click();});
  await page.waitForTimeout(3500); };
const msgs=(page)=>page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.innerText||'').replace(/\s+/g,' ').trim();
  const body=document.body.innerText||'';
  return {toasts:[...document.querySelectorAll('.q-notification,[role=alert],.q-banner')].filter(isVis).map(t),
    dialog:(()=>{const d=[...document.querySelectorAll('.q-dialog')].filter(isVis).pop(); return d?t(d).slice(0,240):null;})(),
    noLongerEdited:/no longer be edited/i.test(body), refresh:/refresh to see the latest/i.test(body),
    couldntAdd:/couldn.t add the part/i.test(body)};}, VIS);
const rowState=(page)=>page.evaluate(vis=>{const isVis=eval(vis);
  const g=t=>{const e=document.querySelector(`[data-test-id="${t}"]`); return e&&isVis(e)?e.value:null;};
  return {desc:g('input_inline_part_description'), qty:g('input_inline_part_quantity'),
    cost:g('input_inline_part_cost'), sell:g('input_inline_part_sell_price')};}, VIS);

// ================= as the TECHNICIAN (Tech View) =================
const t = await boot2('tech', {route:`/workorders/${WO}/lines`});
const tcall = mk(t.page);
await settle(t.page,{label:'tech'});
R.tech = {perms:((await tcall('GET','/api/auth/me/fe-permissions')).json?.data?.fe_permissions||[]).length};
R.tech.viewMode = await t.page.evaluate(()=>{try{return JSON.parse(localStorage.getItem('user')||'{}')?.data?.view_mode
  || JSON.parse(localStorage.getItem('fe_permissions_wrapper')||'{}')?.view_mode || null;}catch(e){return null;}});
await openLines(t.page, WO);
R.tech.controls = await t.page.evaluate(vis=>{const isVis=eval(vis);
  const add=[...document.querySelectorAll('[data-test-id=button_add_part]')];
  const ed=[...document.querySelectorAll('[data-test-id^=button_edit_part_]')];
  return {addPart:add.length, addVisible:add.filter(isVis).length, edit:ed.length,
    money:/\$/.test(document.body.innerText||'')};}, VIS);
log('tech: perms=%d view=%s controls=%s', R.tech.perms, R.tech.viewMode, JSON.stringify(R.tech.controls));
await t.page.screenshot({path:`${DIR}/evidence/BIG10-techview.png`, fullPage:true}).catch(()=>{});
save();

// ---- C45022 — the save fails for a reason other than editability
R.C45022={};
if (R.tech.controls.addVisible){
  const op = await t.page.evaluate(vis=>{const isVis=eval(vis);
    const b=[...document.querySelectorAll('[data-test-id=button_add_part]')].filter(isVis)[0];
    if(!b) return false; b.scrollIntoView({block:'center'}); b.click(); return true;}, VIS);
  R.C45022.opened = op;
  if (op){
    await t.page.waitForTimeout(4000);
    await setVal(t.page,'input_inline_part_description','ZZAUTOTEST tech view failure');
    await setVal(t.page,'input_inline_part_quantity','2');
    await t.page.waitForTimeout(1200);
    R.C45022.typed = await rowState(t.page);
    let blocked=0;
    await t.page.route('**/api/work-orders/part/**', r=>{blocked++; r.abort('failed');});
    await t.page.route('**/api/work-orders/parts/**', r=>{blocked++; r.abort('failed');});
    await t.page.evaluate(()=>{const b=document.querySelector('[data-test-id=button_save_inline_part]'); if(b) b.click();});
    await t.page.waitForTimeout(7000);
    R.C45022.blocked = blocked;
    R.C45022.msgs = await msgs(t.page);
    R.C45022.rowAfter = await rowState(t.page);
    await t.page.screenshot({path:`${DIR}/evidence/BIG10-c45022-tech.png`, fullPage:true}).catch(()=>{});
    await t.page.unroute('**/api/work-orders/part/**').catch(()=>{});
    await t.page.unroute('**/api/work-orders/parts/**').catch(()=>{});
    log('C45022 tech view -> blocked %d toast %s row %s', blocked,
      JSON.stringify(R.C45022.msgs.toasts), JSON.stringify(R.C45022.rowAfter));
  }
}
save();

// ---- C45035 — an open EDIT row while an admin moves the job to a status that cannot be edited
const a = await boot2('admin', {route:'/workorders'});
const acall = mk(a.page);
await settle(a.page,{label:'admin'});
R.C45035={};
await openLines(t.page, WO);
R.C45035.open = await t.page.evaluate(vis=>{const isVis=eval(vis);
  const ed=[...document.querySelectorAll('[data-test-id^=button_edit_part_]')];
  const v=ed.filter(isVis); const b=v[0]||ed[0];
  if(!b) return {opened:false, found:ed.length};
  b.scrollIntoView({block:'center'});
  b.dispatchEvent(new MouseEvent('mouseover',{bubbles:true})); b.click();
  return {opened:true, found:ed.length, visible:v.length, tid:b.getAttribute('data-test-id')};}, VIS);
await t.page.waitForTimeout(4000);
R.C45035.rowOpen = await rowState(t.page);
R.C45035.dialogInstead = (await msgs(t.page)).dialog;
if (R.C45035.rowOpen.desc !== null){
  await setVal(t.page,'input_inline_part_quantity','9');
  await t.page.waitForTimeout(1200);
  R.C45035.typed = await rowState(t.page);
  R.C45035.flip = (await acall('POST','/api/work-orders/change-status',{id:WO, work_order:WO, status:'declined'})).status;
  await t.page.waitForTimeout(2500);
  await t.page.evaluate(()=>{const b=document.querySelector('[data-test-id=button_save_inline_part]'); if(b) b.click();});
  await t.page.waitForTimeout(7000);
  R.C45035.msgs = await msgs(t.page);
  R.C45035.rowAfter = await rowState(t.page);
  await t.page.screenshot({path:`${DIR}/evidence/BIG10-c45035-tech.png`, fullPage:true}).catch(()=>{});
  await acall('POST','/api/work-orders/change-status',{id:WO, work_order:WO, status:'approved'});
  log('C45035 -> alert %s refresh %s toasts %s row %s', R.C45035.msgs.noLongerEdited,
    R.C45035.msgs.refresh, JSON.stringify(R.C45035.msgs.toasts), JSON.stringify(R.C45035.rowAfter));
} else log('C45035: the edit control opened %s, not an inline row', JSON.stringify(R.C45035.dialogInstead||'').slice(0,90));
save();
await t.browser.close();

// ================= as ADMIN (Full View) =================
// ---- C45060 — a catalog part with no cost and no sell price
R.C45060={};
const made = await acall('POST','/api/inventory/parts/create',
  {part_number:'ZZAUTOTEST-NOPRICE-01', description:'ZZAUTOTEST part with no price',
   cost:0, sell_price:0, quantity:0, category:'Uncategorized'});
R.C45060.created = made.status+' '+made.text.slice(0,120);
const cat = rowsOf((await acall('GET','/api/inventory/parts?limit=200&search=ZZAUTOTEST')).json);
R.C45060.found = cat.slice(0,3).map(p=>({pn:p.part_number, c:p.cost, s:p.sell_price}));
await openLines(a.page, WO);
const op2 = await a.page.evaluate(vis=>{const isVis=eval(vis);
  const b=[...document.querySelectorAll('[data-test-id=button_add_part]')].filter(isVis)[0];
  if(!b) return false; b.scrollIntoView({block:'center'}); b.click(); return true;}, VIS);
R.C45060.opened = op2;
if (op2){
  await a.page.waitForTimeout(4000);
  R.C45060.onOpen = await rowState(a.page);
  await setVal(a.page,'input_inline_part_description','ZZAUTOTEST-NOPRICE');
  await a.page.waitForTimeout(4000);
  R.C45060.options = await a.page.evaluate(vis=>{const isVis=eval(vis);
    const o=[...document.querySelectorAll('.q-menu .q-item,[role=option]')].filter(isVis);
    const texts=o.map(e=>(e.innerText||'').replace(/\s+/g,' ').trim());
    if(o.length) o[0].click(); return texts.slice(0,6);}, VIS);
  await a.page.waitForTimeout(3500);
  R.C45060.afterPick = await rowState(a.page);
  await a.page.screenshot({path:`${DIR}/evidence/BIG10-c45060.png`, fullPage:true}).catch(()=>{});
  log('C45060 -> on open %s | options %s | after picking %s', JSON.stringify(R.C45060.onOpen),
    JSON.stringify(R.C45060.options), JSON.stringify(R.C45060.afterPick));
  await a.page.keyboard.press('Escape');
}
save();

// ---- C44993 / C44994 on the Invoiced status
R.invoiced={};
for (const chain of [['invoiced'],['ready_for_review','invoiced'],['paid','invoiced']]){
  let ok=true;
  for (const st of chain){ const r=await acall('POST','/api/work-orders/change-status',{id:WO, work_order:WO, status:st});
    R.invoiced[chain.join('>')+':'+st]=r.status+' '+r.text.slice(0,70); if(r.status>=300){ok=false;break;} }
  if (ok) break;
  await acall('POST','/api/work-orders/change-status',{id:WO, work_order:WO, status:'approved'});
}
const wo=(await acall('GET',`/api/work-orders/view/${WO}`)).json; let dd=(wo&&(wo.data||wo))||{}; if(dd.work_order) dd=dd.work_order;
R.invoiced.now = dd.status;
if (/invoiced/i.test(String(dd.status||''))){
  await openLines(a.page, WO);
  R.invoiced.controls = await a.page.evaluate(vis=>{const isVis=eval(vis);
    const add=[...document.querySelectorAll('[data-test-id=button_add_part]')];
    const ed=[...document.querySelectorAll('[data-test-id^=button_edit_part_]')];
    return {addPart:add.length, addVisible:add.filter(isVis).length, edit:ed.length};}, VIS);
  await a.page.screenshot({path:`${DIR}/evidence/BIG10-invoiced.png`, fullPage:true}).catch(()=>{});
}
log('invoiced: %s -> %s', R.invoiced.now, JSON.stringify(R.invoiced.controls||null));
save();

// ---- C45126 — cancelling the print dialog still records the print
R.C45126={};
await acall('POST','/api/work-orders/change-status',{id:WO, work_order:WO, status:'approved'});
await a.page.goto(`${APP}/workorders/${WO}/lines`,{waitUntil:'domcontentloaded',timeout:60000});
await settle(a.page,{label:'print-cancel'});
const histBefore = rowsOf((await acall('GET',`/api/work-orders/${WO}/history`)).json);
R.C45126.before = histBefore.filter(h=>/print/i.test(JSON.stringify(h))).length;
// the dialog is refused the way a person pressing Cancel refuses it
await a.page.evaluate(()=>{window.__p=0; window.print=function(){window.__p++; throw new Error('user cancelled the print dialog');};});
await a.page.evaluate(()=>{const b=document.querySelector('[data-test-id=button_work_order_nav_bar_menu]'); if(b) b.click();});
await a.page.waitForTimeout(2500);
await a.page.evaluate(()=>{const b=document.querySelector('[data-test-id=menu_item_print_work_order]'); if(b) b.click();});
await a.page.waitForTimeout(8000);
R.C45126.printCalls = await a.page.evaluate(()=>window.__p);
const histAfter = rowsOf((await acall('GET',`/api/work-orders/${WO}/history`)).json);
R.C45126.after = histAfter.filter(h=>/print/i.test(JSON.stringify(h))).length;
R.C45126.newest = JSON.stringify(histAfter.slice(0,2)).slice(0,300);
await a.page.screenshot({path:`${PDIR}/evidence/BIG10-c45126.png`, fullPage:true}).catch(()=>{});
log('C45126 -> print entries %d -> %d (dialog refused, print called %d)',
  R.C45126.before, R.C45126.after, R.C45126.printCalls);
save();
log('done');
await a.browser.close();
process.exit(0);
