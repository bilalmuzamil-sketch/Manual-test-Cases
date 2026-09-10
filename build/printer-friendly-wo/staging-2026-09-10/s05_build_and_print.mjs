// Build the seeded work order into the shape the remaining printed-page cases need, then print it.
// Rule 107: seed whatever the state requires, using whichever surface reaches it.
// Target shape: several job lines, at least one with parts, one with a technician's note, one with a
// VERY LONG note, one with no parts, and one cancelled — plus, separately, a job with no lines.
import { boot2, APP, API_HOST } from '/home/user/Manual-test-Cases/build/testing-tools/staging-boot2.mjs';
import { settle, afterAction } from '/home/user/Manual-test-Cases/build/testing-tools/probe_guard.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/printer-friendly-wo/staging-2026-09-10';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const VIS=`(e)=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);
  return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden'&&parseFloat(c.opacity)>0.01;}`;
const R={}; const save=()=>fs.writeFileSync(`${DIR}/evidence/s05-build-print.json`, JSON.stringify(R,null,1));
const WO = process.env.WO || '9e1934ae-a2f7-41f1-baae-0ee5690e9a96';   // seeded through the UI
const LONG = 'ZZAUTOTEST long note. ' + 'The technician found excessive play in the steering linkage and recommends replacing the drag link and both tie rod ends before the unit returns to service. '.repeat(6);
const rowsOf=(j)=>{const pick=o=>{ for (const k of ['collection','data','rows','items','results']){ if (Array.isArray(o&&o[k])) return o[k]; }
  if (Array.isArray(o)) return o; for (const k of Object.keys(o||{})){ const v=pick(o[k]); if (v&&v.length) return v; } return []; }; return pick(j);};

const s = await boot2('admin', {route:`/workorders/${WO}/lines`});
const {page, ctx} = s;
const call=(m,p,b)=>page.evaluate(async({api,m,p,b})=>{const r=await fetch(`https://${api}${p}`,{method:m,
  headers:{'Content-Type':'application/json',Accept:'application/json'},credentials:'include',
  body:b?JSON.stringify(b):undefined});const t=await r.text();let j=null;try{j=JSON.parse(t)}catch(e){}
  return{status:r.status,json:j,text:(t||'').slice(0,260)};},{api:API_HOST,m,p,b:b||null});
const lines=async()=>rowsOf((await call('GET',`/api/work-orders/lines/${WO}`)).json);
const clickText=(re)=>page.evaluate(({vis,re})=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const rx=new RegExp(re,'i');
  const b=[...document.querySelectorAll('button,[role=button],a')].filter(isVis).find(e=>rx.test(t(e)));
  if(!b) return {clicked:false, seen:[...document.querySelectorAll('button')].filter(isVis).map(t).filter(Boolean).slice(0,20)};
  b.scrollIntoView({block:'center'}); b.click(); return {clicked:true, label:t(b)};},{vis:VIS,re:re.source||re});
const setVal=(tid,val)=>page.evaluate(({tid,val})=>{const i=document.querySelector(`[data-test-id="${tid}"]`);
  if(!i) return {found:false}; i.focus();
  const proto=i.tagName==='TEXTAREA'?window.HTMLTextAreaElement.prototype:window.HTMLInputElement.prototype;
  const S=Object.getOwnPropertyDescriptor(proto,'value').set; S.call(i,val);
  i.dispatchEvent(new Event('input',{bubbles:true})); i.dispatchEvent(new Event('change',{bubbles:true}));
  return {found:true};},{tid,val});
const firstOption=async()=>{await page.waitForTimeout(2500);
  return page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
    const o=[...document.querySelectorAll('.q-menu .q-item,[role=option]')].filter(isVis);
    if(!o.length) return {chose:false}; const l=t(o[0]); o[0].click(); return {chose:true, label:l.slice(0,50)};}, VIS);};

await settle(page,{label:'lines'});
R.start = (await lines()).map(l=>({id:l.line_id, status:l.status}));
log('starting lines: %d', R.start.length);

// ---- add three job lines through the New Line form
R.added=[];
for (const [i,note] of [[1,''],[2,'ZZAUTOTEST short note for the printed page.'],[3,LONG]]){
  const open = await clickText(/^\+?\s*new\s+line$/);
  if(!open.clicked){ R.added.push({i, failed:'New Line not found', seen:open.seen}); break; }
  await page.waitForTimeout(4500);
  // "What are you doing?" is a picker; take its first entry so the line has a name and a rate
  await page.evaluate(t=>{const el=document.querySelector(`[data-test-id="${t}"]`);
    if(el){ el.scrollIntoView({block:'center'}); (el.closest('.q-field')||el).dispatchEvent(new MouseEvent('click',{bubbles:true}));
      el.dispatchEvent(new MouseEvent('click',{bubbles:true})); el.focus(); }},'select_line_canned_line');
  const chose = await firstOption();
  await page.waitForTimeout(1500);
  await setVal('input_time_estimate','2'); await setVal('input_tech_time','1');
  await page.waitForTimeout(1200);
  const saved = await clickText(/save\s*&\s*close/);
  await settle(page,{label:'line saved'});
  R.added.push({i, chose:chose.label, saved:saved.clicked, note:note?note.slice(0,30):'(none)'});
  save();
}
log('lines added: %s', JSON.stringify(R.added));
let ln = await lines();
R.afterLines = ln.map(l=>({id:l.line_id, status:l.status, name:l.line_name||l.description}));
log('the work order now has %d lines', ln.length); save();

// ---- put a technician's note on line 2 and a very long one on line 3, straight through the API
R.notes={};
for (const [idx,text] of [[1,'ZZAUTOTEST short note for the printed page.'],[2,LONG]]){
  const l = ln[idx]; if(!l) continue;
  for (const p of [`/api/work-orders/lines/change`,`/api/work-orders/lines/update`]){
    const r = await call('POST', p, {line_id:l.line_id, workOrderId:WO, tech_story:text});
    R.notes[`line${idx}_${p.split('/').pop()}`] = {http:r.status, text:r.text.slice(0,140)};
    if (r.status>=200 && r.status<300) break;
  }
  save();
}
ln = await lines();
R.storiesNow = ln.map(l=>({id:l.line_id.slice(0,8), story:(l.tech_story||'').slice(0,40)}));
log('technician notes now: %s', JSON.stringify(R.storiesNow)); save();

// ---- print, and read the printed page
await page.goto(`${APP}/workorders/${WO}/lines`,{waitUntil:'domcontentloaded',timeout:60000});
await settle(page,{label:'reloaded'});
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
R.printState = await page.evaluate(()=>({calls:window.__p, bodyClass:document.body.className,
  hasRoot:!!document.getElementById('wo-print-root')}));
log('print: %s', JSON.stringify(R.printState));
if (R.printState.hasRoot){
  await page.emulateMedia({media:'print'}); await page.waitForTimeout(1800);
  R.printout = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
    const root=document.getElementById('wo-print-root'); const txt=root.innerText||'';
    return {chars:txt.length, money:[...txt.matchAll(/\$[\d,]+\.?\d*/g)].map(m=>m[0]).length,
      buttons:root.querySelectorAll('button').length, inputs:root.querySelectorAll('input,select,textarea').length,
      tableHeaders:[...root.querySelectorAll('th')].map(t).filter(Boolean),
      hasShortNote:/ZZAUTOTEST short note/.test(txt),
      longNoteChars:(txt.match(/The technician found excessive play[\s\S]{0,2000}/)||[''])[0].length,
      longNoteFull: (txt.match(/drag link and both tie rod ends/g)||[]).length,
      addTechStory:/add tech story/i.test(txt),
      printedAt:(txt.match(/Printed:[^\n]*/)||[''])[0],
      totals:(txt.match(/Total (Actual|Estimated) Time:[^\n]*/g)||[]),
      text:txt.slice(0,2500)};}, VIS);
  log('PRINTOUT %d chars | money %d | buttons %d | inputs %d', R.printout.chars, R.printout.money,
    R.printout.buttons, R.printout.inputs);
  log('  headers: %s', JSON.stringify(R.printout.tableHeaders));
  log('  short note printed: %s | long note repeats printed: %d | "add tech story": %s',
    R.printout.hasShortNote, R.printout.longNoteFull, R.printout.addTechStory);
  log('  %s | %s', R.printout.printedAt, JSON.stringify(R.printout.totals));
  await page.screenshot({path:`${DIR}/evidence/s05-printout.png`, fullPage:true});
  await page.pdf({path:`${DIR}/evidence/s05-printout.pdf`, format:'A4', printBackground:true}).catch(()=>{});
  await page.emulateMedia({media:'screen'});
}
save();
await s.browser.close();
log('done');
