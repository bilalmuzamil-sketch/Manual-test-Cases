// Printer Friendly Work Orders on STAGING — one pass that gathers the evidence for the whole
// printout group (the header, the lines, the summary, and what must be hidden), rather than one
// probe per case. Rule 79: strategy first.
// Rule 104 is built in: the print stylesheet is proved to exist and to change the page BEFORE any
// "X is missing from the printout" is recorded. If it does not, nothing is reported as observed.
import { boot2, APP, API_HOST } from '/home/user/Manual-test-Cases/build/testing-tools/staging-boot2.mjs';
import { settle, afterAction } from '/home/user/Manual-test-Cases/build/testing-tools/probe_guard.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/printer-friendly-wo/staging-2026-09-10';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const VIS=`(e)=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);
  return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden'&&parseFloat(c.opacity)>0.01;}`;
const R={}; const save=()=>fs.writeFileSync(`${DIR}/evidence/s01-printout.json`, JSON.stringify(R,null,1));
const rowsOf=(j)=>{const pick=o=>{ for (const k of ['collection','data','rows','items','results']){ if (Array.isArray(o&&o[k])) return o[k]; }
  if (Array.isArray(o)) return o; for (const k of Object.keys(o||{})){ const v=pick(o[k]); if (v&&v.length) return v; } return []; }; return pick(j);};

const s = await boot2('admin', {route:'/workorders'});
const {page, ctx} = s;
const call=(m,p)=>page.evaluate(async({api,m,p})=>{const r=await fetch(`https://${api}${p}`,{method:m,
  headers:{Accept:'application/json'},credentials:'include'});const t=await r.text();let j=null;try{j=JSON.parse(t)}catch(e){}
  return{status:r.status,json:j};},{api:API_HOST,m,p});
await settle(page,{label:'work orders'});
R.identity={perms:s.feData?.fe_permissions?.length, slug:s.feData?.template_slug, view:s.feData?.view_mode};
log('signed in: %s', JSON.stringify(R.identity));

// ---- choose a work order that actually exercises the printout: lines, parts, techs, a tech story
const wos = rowsOf((await call('GET','/api/work-orders?limit=100')).json);
R.workOrderCount = wos.length;
let best=null;
for (const w of wos.slice(0,25)){
  const ln = rowsOf((await call('GET',`/api/work-orders/lines/${w.id}`)).json);
  const parts = ln.reduce((n,l)=>n+((l.parts||[]).length),0);
  const stories = ln.filter(l=>(l.tech_story||'').trim()).length;
  const score = ln.length*2 + parts*3 + stories*4;
  if (!best || score>best.score) best={id:w.id, number:w.number, status:w.status, lines:ln.length,
    parts, stories, score, lineData:ln};
}
R.chosen={id:best.id, number:best.number, status:best.status, lines:best.lines, parts:best.parts, stories:best.stories};
log('work order chosen: %s', JSON.stringify(R.chosen)); save();

// ---- what the screen shows, before printing (C45103 needs the on-screen order)
await page.goto(`${APP}/workorders/${best.id}/lines`,{waitUntil:'domcontentloaded',timeout:60000});
await settle(page,{label:'lines tab'});
R.onScreen = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const tbl=document.querySelector('[data-test-id=table_work_order_lines]');
  const order=[]; if(tbl) for (const r of tbl.querySelectorAll('tr')){
    const n=[...r.querySelectorAll('[data-test-id]')].map(e=>e.getAttribute('data-test-id'))
      .find(x=>/^line_number_/.test(x));
    if(n) order.push({line:n.replace('line_number_',''), text:t(r).slice(0,70)});}
  return {lineOrder:order, tabs:[...document.querySelectorAll('.q-tab')].filter(isVis).map(t),
    buttons:[...document.querySelectorAll('button')].filter(isVis).map(t).filter(Boolean).length};}, VIS);
log('on screen: %d lines, %d tabs', R.onScreen.lineOrder.length, R.onScreen.tabs.length);
await page.screenshot({path:`${DIR}/evidence/s01-1-screen.png`, fullPage:true});
save();

// ---- CONTROL FIRST (Rule 104): does a print stylesheet exist, and does print media change the page?
const countVisible = ()=>page.evaluate(()=>{let n=0;
  for (const e of document.querySelectorAll('body *')){ if (e.children.length) continue;
    const c=getComputedStyle(e); const r=e.getBoundingClientRect();
    if (c.display!=='none'&&c.visibility!=='hidden'&&r.width>0&&r.height>0) n++; } return n;});
await page.emulateMedia({media:'screen'}); await page.waitForTimeout(1200);
const screenN = await countVisible();
await page.emulateMedia({media:'print'});  await page.waitForTimeout(1500);
const printN = await countVisible();
R.control = {screenVisible:screenN, printVisible:printN, changed:screenN!==printN};
R.control.printRules = await page.evaluate(()=>{let n=0, samples=[];
  for (const sh of document.styleSheets){ let rules=null; try{ rules=sh.cssRules; }catch(e){ continue; }
    const walk=l=>{ for (const r of l){
      if (r.type===4 && /print/i.test(r.conditionText||r.media?.mediaText||'')){ n++;
        if(samples.length<6) samples.push((r.cssText||'').slice(0,130)); }
      if (r.cssRules) walk(r.cssRules); } };
    walk(rules); }
  return {count:n, samples};});
log('CONTROL — visible leaves screen %d vs print %d (changed: %s) | @media print rules: %d',
  screenN, printN, R.control.changed, R.control.printRules.count);
for (const x of R.control.printRules.samples) log('     %s', x);
save();

// ---- the printout itself, read under print media
R.print = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const body=(document.body.innerText||'');
  const money=[...body.matchAll(/\$[\d,]+\.?\d*/g)].map(m=>m[0]);
  return {
    chars: body.length,
    visibleLeaves: [...document.querySelectorAll('body *')].filter(e=>!e.children.length&&isVis(e)).length,
    buttons:[...document.querySelectorAll('button')].filter(isVis).map(t).filter(Boolean),
    tabs:[...document.querySelectorAll('.q-tab')].filter(isVis).map(t),
    navLinks:[...document.querySelectorAll('nav a,header a')].filter(isVis).map(t).filter(Boolean),
    inputs:[...document.querySelectorAll('input,select,textarea')].filter(isVis).length,
    money, moneyCount:money.length,
    headings:[...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].filter(isVis).map(t).filter(Boolean).slice(0,12),
    tableHeaders:[...document.querySelectorAll('th')].filter(isVis).map(t).filter(Boolean),
    mentionsProgress:/progress/i.test(body), mentionsAction:/\baction\b/i.test(body),
    mentionsRate:/\brate\b/i.test(body), mentionsMargin:/\bmargin\b/i.test(body),
    addTechStoryPlaceholder:/add tech story/i.test(body),
    printedAt:[...body.matchAll(/printed[^\n]{0,60}/ig)].map(m=>m[0]).slice(0,4),
    firstText: body.slice(0,700)};}, VIS);
log('PRINT MEDIA: %d chars, %d visible leaves | buttons %d | tabs %d | inputs %d | money %d',
  R.print.chars, R.print.visibleLeaves, R.print.buttons.length, R.print.tabs.length,
  R.print.inputs, R.print.moneyCount);
log('  headings: %s', JSON.stringify(R.print.headings));
log('  table headers: %s', JSON.stringify(R.print.tableHeaders));
log('  progress=%s action=%s rate=%s margin=%s | "add tech story"=%s | printed-at=%s',
  R.print.mentionsProgress, R.print.mentionsAction, R.print.mentionsRate, R.print.mentionsMargin,
  R.print.addTechStoryPlaceholder, JSON.stringify(R.print.printedAt));
await page.screenshot({path:`${DIR}/evidence/s01-2-printmedia.png`, fullPage:true});
await page.pdf({path:`${DIR}/evidence/s01-printout.pdf`, format:'A4', printBackground:true}).catch(e=>log('pdf: '+e.message));
save();
await page.emulateMedia({media:'screen'});
await s.browser.close();
log('done');
