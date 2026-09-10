// The printout itself — header, line items, summary and the hidden-elements rule, in one pass.
// Technique: hook window.print so the native dialog cannot block the run, trigger Print Work Order,
// then switch the page to PRINT media (page.emulateMedia) and read what is actually visible under
// the print stylesheet. A PDF is written too, so the real printed output is on record as evidence.
// Nothing is judged from the screen stylesheet — the whole point of these cases is what PRINTS.
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/printer-friendly-wo/execution-2026-09-10';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const VIS=`(e)=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);
  return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden'&&parseFloat(c.opacity)>0.01;}`;
const R={}; const save=()=>fs.writeFileSync(`${DIR}/evidence/03-printout.json`, JSON.stringify(R,null,1));
const rowsOf=(j)=>{const pick=o=>{ for (const k of ['collection','data','rows','items','results']){ if (Array.isArray(o&&o[k])) return o[k]; }
  if (Array.isArray(o)) return o; for (const k of Object.keys(o||{})){ const v=pick(o[k]); if (v&&v.length) return v; } return []; }; return pick(j);};

const s = await boot('sv9315','/workorders','admin');
const {page, APP, APIH} = s;
const call=(m,p)=>page.evaluate(async({api,m,p})=>{const r=await fetch(`https://${api}${p}`,{method:m,
  headers:{Accept:'application/json'},credentials:'include'});const t=await r.text();let j=null;try{j=JSON.parse(t)}catch(e){}
  return{status:r.status,json:j};},{api:APIH,m,p});
await page.addInitScript(()=>{ window.__printCalls=0; window.print=function(){ window.__printCalls++; }; });

// a work order with real lines and parts, so the line and part rules can be judged
const wos = rowsOf((await call('GET','/api/work-orders?limit=200')).json);
let target=null;
for (const w of wos){
  if (!['approved','estimate','ready_for_review'].includes(String(w.status||'').toLowerCase())) continue;
  const lines = rowsOf((await call('GET',`/api/work-orders/lines/${w.id}`)).json);
  if (lines.some(l=>(l.parts||[]).length)){ target={id:w.id, number:w.number, status:w.status,
    lines:lines.map(l=>({id:l.line_id, status:l.status, desc:l.description,
      nParts:(l.parts||[]).length, techStory:!!l.tech_story, nTechs:(l.tech_times||[]).length}))}; break; }
}
R.workOrder = target;
log('work order: %s (%d lines)', target && target.number, target ? target.lines.length : 0);
save();
if(!target){ R.fatal='no work order with lines and parts'; save(); await s.browser.close(); process.exit(0); }
R.apiLines = target.lines;

await page.goto(`${APP}/workorders/${target.id}/lines`,{waitUntil:'domcontentloaded',timeout:60000});
await page.waitForTimeout(13000);

// ---- what the SCREEN shows, for the "same order as on screen" and "hidden on print" comparisons
const screenState = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const tbl=document.querySelector('[data-test-id=table_work_order_lines]');
  const lineOrder=[]; 
  if(tbl) for (const r of [...tbl.querySelectorAll('tr')]){
    const m=[...r.querySelectorAll('[data-test-id]')].map(e=>e.getAttribute('data-test-id'))
      .find(x=>/^line_number_/.test(x));
    if(m) lineOrder.push({id:m.replace('line_number_',''), label:t(r).slice(0,40)});}
  return {lineOrder,
    navPresent: !!document.querySelector('nav,.q-drawer,.q-header'),
    tabs:[...document.querySelectorAll('[role=tab],.q-tab')].filter(isVis).map(t).slice(0,10),
    buttons:[...document.querySelectorAll('button')].filter(isVis).map(t).filter(Boolean).slice(0,25)};}, VIS);
R.screen = screenState;
log('on screen: %d lines, %d tabs, %d buttons', screenState.lineOrder.length,
  screenState.tabs.length, screenState.buttons.length);
save();

// ---- trigger Print, then read the page under PRINT media
const TOOLBAR = `(isVis, t) => {
  const lt=document.querySelector('[data-test-id=table_work_order_lines]');
  return [...document.querySelectorAll('button,[role=button]')].filter(isVis)
    .filter(b=>/more_vert|more_horiz/.test(t(b)) || /more/i.test(b.getAttribute('data-test-id')||''))
    .filter(b=>{ if (lt && lt.contains(b)) return false;
      const id=b.getAttribute('data-test-id')||''; return !/_line_|_[0-9a-f]{8}-[0-9a-f]{4}-/.test(id); })[0] || null;
}`;
R.openMenu = await page.evaluate(({vis,fn})=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const b=eval(`(${fn})`)(isVis,t); if(!b) return {opened:false};
  b.click(); return {opened:true};}, {vis:VIS, fn:TOOLBAR});
await page.waitForTimeout(3000);
R.clickPrint = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const menu=[...document.querySelectorAll('.q-menu')].filter(isVis).pop();
  if(!menu) return {clicked:false};
  const it=[...menu.querySelectorAll('.q-item,[role=menuitem]')].filter(isVis).find(e=>/print work order/i.test(t(e)));
  if(!it) return {clicked:false};
  it.click(); return {clicked:true};}, VIS);
await page.waitForTimeout(8000);
R.printCalls = await page.evaluate(()=>window.__printCalls||0);
log('print triggered: %s (window.print called %d times)', JSON.stringify(R.clickPrint), R.printCalls);

await page.emulateMedia({media:'print'});
await page.waitForTimeout(4000);
await page.screenshot({path:`${DIR}/evidence/03-1-print-media.png`, fullPage:true});
try{ await page.pdf({path:`${DIR}/evidence/03-printout.pdf`, format:'Letter', printBackground:false}); }
catch(e){ R.pdfError=String(e).slice(0,200); }

R.print = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const text=(document.body.innerText||'').replace(/ /g,' ');
  const visText=[...document.querySelectorAll('body *')].filter(isVis)
    .filter(e=>!e.children.length).map(t).filter(Boolean);
  const tbl=document.querySelector('[data-test-id=table_work_order_lines]');
  const lineOrder=[];
  if(tbl) for (const r of [...tbl.querySelectorAll('tr')]){
    const m=[...r.querySelectorAll('[data-test-id]')].map(e=>e.getAttribute('data-test-id'))
      .find(x=>/^line_number_/.test(x));
    if(m && isVis(r)) lineOrder.push(m.replace('line_number_',''));}
  const vis_ = sel => [...document.querySelectorAll(sel)].filter(isVis);
  return {
    bodyTextLength:text.length,
    bodyText:text.slice(0,4000),
    leafCount:visText.length,
    lineOrder,
    // interactive things that should NOT print
    buttonsVisible: vis_('button').map(t).filter(Boolean).slice(0,25),
    tabsVisible: vis_('[role=tab],.q-tab').map(t).slice(0,10),
    navVisible: vis_('nav,.q-drawer,.q-header').length,
    menuTriggersVisible: vis_('[data-test-id*=more],[data-test-id*=context_menu]').length,
    // money, which must never print
    dollarMatches: (text.match(/\$\s?[\d,]+\.?\d*/g)||[]).slice(0,20),
    mentionsRate: /\brate\b/i.test(text), mentionsMargin: /\bmargin\b/i.test(text),
    mentionsTotalWord: /\btotal\b/i.test(text),
    mentionsProgress: /\bprogress\b/i.test(text), mentionsAction: /\baction\b/i.test(text),
    // header fields
    hasWoNumber: /S9315-\d+/.test(text), woNumbers:(text.match(/S9315-\d+/g)||[]).slice(0,3),
    mentionsAdvisor: /advisor/i.test(text), mentionsLeadTech: /lead tech/i.test(text),
    mentionsVin: /vin/i.test(text), mentionsMileage: /mileage/i.test(text),
    // placeholders that must be absent / present
    mentionsAddTechStory: /add tech story for this line/i.test(text),
    mentionsNoLines: /no lines on this work order/i.test(text),
    // summary and footer
    mentionsActualEstimate: /actual\s*\/\s*estimate|total actual|estimated/i.test(text),
    printedAtLike: (text.match(/printed[^\n]{0,60}/ig)||[]).slice(0,3),
  };}, VIS);
log('PRINT MEDIA: %d chars, %d visible leaves, lines shown %d',
  R.print.bodyTextLength, R.print.leafCount, R.print.lineOrder.length);
log('  buttons still visible: %d %s', R.print.buttonsVisible.length, JSON.stringify(R.print.buttonsVisible.slice(0,8)));
log('  tabs %d | nav %d | menu triggers %d', R.print.tabsVisible.length, R.print.navVisible, R.print.menuTriggersVisible);
log('  $ amounts: %s', JSON.stringify(R.print.dollarMatches));
log('  rate=%s margin=%s total=%s progress=%s action=%s', R.print.mentionsRate, R.print.mentionsMargin,
  R.print.mentionsTotalWord, R.print.mentionsProgress, R.print.mentionsAction);
log('  wo number=%s advisor=%s leadtech=%s vin=%s mileage=%s', JSON.stringify(R.print.woNumbers),
  R.print.mentionsAdvisor, R.print.mentionsLeadTech, R.print.mentionsVin, R.print.mentionsMileage);
log('  "add tech story" placeholder present: %s', R.print.mentionsAddTechStory);
log('  printed-at: %s', JSON.stringify(R.print.printedAtLike));
save();
await page.emulateMedia({media:'screen'});
await s.browser.close();
log('done');
