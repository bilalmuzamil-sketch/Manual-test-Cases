// Put technician notes on the seeded lines, then print.
// The direct route refused with "Labor or fixed prices must be set." — i.e. that call replaces the
// whole line and needs every field, not just the note. Two routes, in order (Rule 107):
//   A. send the line back COMPLETE with the note merged in
//   B. if that still refuses, type it on the screen via "Add tech story for this line"
import { boot2, APP, API_HOST } from '/home/user/Manual-test-Cases/build/testing-tools/staging-boot2.mjs';
import { settle } from '/home/user/Manual-test-Cases/build/testing-tools/probe_guard.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/printer-friendly-wo/staging-2026-09-10';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const VIS=`(e)=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);
  return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden'&&parseFloat(c.opacity)>0.01;}`;
const R={}; const save=()=>fs.writeFileSync(`${DIR}/evidence/s06-stories.json`, JSON.stringify(R,null,1));
const WO='9e1934ae-a2f7-41f1-baae-0ee5690e9a96';
const SHORT='ZZAUTOTEST short note for the printed page.';
const LONG='ZZAUTOTEST long note. ' + 'The technician found excessive play in the steering linkage and recommends replacing the drag link and both tie rod ends before the unit returns to service. '.repeat(6);
const rowsOf=(j)=>{const pick=o=>{ for (const k of ['collection','data','rows','items','results']){ if (Array.isArray(o&&o[k])) return o[k]; }
  if (Array.isArray(o)) return o; for (const k of Object.keys(o||{})){ const v=pick(o[k]); if (v&&v.length) return v; } return []; }; return pick(j);};

const s = await boot2('admin', {route:`/workorders/${WO}/lines`});
const {page} = s;
const call=(m,p,b)=>page.evaluate(async({api,m,p,b})=>{const r=await fetch(`https://${api}${p}`,{method:m,
  headers:{'Content-Type':'application/json',Accept:'application/json'},credentials:'include',
  body:b?JSON.stringify(b):undefined});const t=await r.text();let j=null;try{j=JSON.parse(t)}catch(e){}
  return{status:r.status,json:j,text:(t||'').slice(0,220)};},{api:API_HOST,m,p,b:b||null});
const lines=async()=>rowsOf((await call('GET',`/api/work-orders/lines/${WO}`)).json);
await settle(page,{label:'lines'});
let ln = await lines();
R.lines = ln.map(l=>({id:l.line_id, keys:Object.keys(l).length, story:(l.tech_story||'')}));
log('%d lines, notes now: %s', ln.length, JSON.stringify(R.lines.map(x=>x.story)));

// ---- route A: send the line back complete, with the note merged in
R.routeA={};
for (const [i,text] of [[1,SHORT],[2,LONG]]){
  const l = ln[i]; if(!l) continue;
  const body = {...l, workOrderId:WO, line_id:l.line_id, tech_story:text};
  delete body.parts; delete body.part_requests; delete body.tasks; delete body.task_records;
  delete body.tech_times;
  const r = await call('POST','/api/work-orders/lines/change', body);
  R.routeA[`line${i}`] = {http:r.status, text:r.text.slice(0,150)};
  log('  route A line %d -> %s %s', i, r.status, r.text.slice(0,110));
  save();
}
ln = await lines();
R.afterA = ln.map(l=>(l.tech_story||'').slice(0,32));
log('after route A: %s', JSON.stringify(R.afterA)); save();

// ---- route B: type it on the screen
if (!R.afterA.some(x=>x)){
  log('route A did not take — typing the notes on the screen instead');
  await page.goto(`${APP}/workorders/${WO}/lines`,{waitUntil:'domcontentloaded',timeout:60000});
  await settle(page,{label:'reload'});
  await page.evaluate(()=>{for(const b of document.querySelectorAll('[data-test-id^=button_line_expand_]'))
    if(/expand_more/.test(b.textContent||'')) b.click();});
  await page.waitForTimeout(4000);
  R.storySlots = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
    return [...document.querySelectorAll('*')].filter(isVis)
      .filter(e=>!e.children.length && /add tech story/i.test(t(e)))
      .map(e=>({text:t(e), tid:e.getAttribute('data-test-id'),
        parentTid:(e.closest('[data-test-id]')||{}).getAttribute?.('data-test-id')}));}, VIS);
  log('note slots on screen: %s', JSON.stringify(R.storySlots).slice(0,300));
  R.routeB={};
  for (const [idx,text] of [[0,SHORT],[1,LONG]]){
    const done = await page.evaluate(async ({vis,idx,text})=>{
      const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
      const slots=[...document.querySelectorAll('*')].filter(isVis)
        .filter(e=>!e.children.length && /add tech story/i.test(t(e)));
      const el=slots[idx]; if(!el) return {found:false, slots:slots.length};
      el.scrollIntoView({block:'center'}); el.click();
      await new Promise(r=>setTimeout(r,2500));
      const box=[...document.querySelectorAll('textarea,input[type=text],[contenteditable=true]')]
        .filter(isVis).pop();
      if(!box) return {found:true, typed:false};
      box.focus();
      if (box.isContentEditable){ box.textContent=text; box.dispatchEvent(new Event('input',{bubbles:true})); }
      else { const proto=box.tagName==='TEXTAREA'?window.HTMLTextAreaElement.prototype:window.HTMLInputElement.prototype;
        const S=Object.getOwnPropertyDescriptor(proto,'value').set; S.call(box,text);
        box.dispatchEvent(new Event('input',{bubbles:true})); box.dispatchEvent(new Event('change',{bubbles:true})); }
      await new Promise(r=>setTimeout(r,1200));
      box.blur();
      document.body.click();
      return {found:true, typed:true, tag:box.tagName};}, {vis:VIS, idx, text});
    R.routeB[`slot${idx}`]=done;
    log('  route B slot %d -> %s', idx, JSON.stringify(done));
    await page.waitForTimeout(4000);
    save();
  }
  await settle(page,{label:'after typing'});
  ln = await lines();
  R.afterB = ln.map(l=>(l.tech_story||'').slice(0,32));
  log('after route B: %s', JSON.stringify(R.afterB));
}
save();
R.storiesLanded = (await lines()).map(l=>(l.tech_story||'').length);
log('note lengths on the lines now: %s', JSON.stringify(R.storiesLanded));

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
    return {chars:txt.length, money:[...txt.matchAll(/\$[\d,]+\.?\d*/g)].length,
      buttons:root.querySelectorAll('button').length, inputs:root.querySelectorAll('input,select,textarea').length,
      shortNote:/ZZAUTOTEST short note/.test(txt),
      longNoteRepeats:(txt.match(/drag link and both tie rod ends/g)||[]).length,
      addTechStory:/add tech story/i.test(txt),
      printedAt:(txt.match(/Printed:[^\n]*/)||[''])[0],
      totals:(txt.match(/Total (Actual|Estimated) Time:[^\n]*/g)||[]),
      text:txt.slice(0,1800)};});
  log('PRINTOUT %d chars | money %d | short note %s | long note repeats %d | placeholder %s',
    R.printout.chars, R.printout.money, R.printout.shortNote, R.printout.longNoteRepeats, R.printout.addTechStory);
  log('  %s | %s', R.printout.printedAt, JSON.stringify(R.printout.totals));
  log('--- printout ---'); log(R.printout.text.slice(0,1200));
  await page.screenshot({path:`${DIR}/evidence/s06-printout.png`, fullPage:true});
  await page.pdf({path:`${DIR}/evidence/s06-printout.pdf`, format:'A4', printBackground:true}).catch(()=>{});
  await page.emulateMedia({media:'screen'});
}
save();
await s.browser.close();
log('done');
