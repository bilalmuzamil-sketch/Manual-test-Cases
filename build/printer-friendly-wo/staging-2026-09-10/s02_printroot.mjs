// The printout is built ON DEMAND into #wo-print-root — reading print media without pressing Print
// shows the ordinary screen, not the printout.
//
// The stylesheet says so plainly (read live on staging, 2026-09-10):
//     @media print { body.wo-printing > :not(#wo-print-root) { display: none !important; } }
// So the app: (1) adds `wo-printing` to <body>, (2) builds `#wo-print-root`, (3) the print rule
// hides everything except that root. Switching to print media WITHOUT clicking Print leaves the body
// without `wo-printing`, so nothing is hidden and the whole app is still on screen — which is
// exactly the "prices appear on the printout" result I nearly filed on the old branch.
// Rule 104: the control (screen 3190 vs print 3190 visible elements, unchanged) caught it.
//
// This probe presses Print for real, then reads #wo-print-root.
import { boot2, APP, API_HOST } from '/home/user/Manual-test-Cases/build/testing-tools/staging-boot2.mjs';
import { settle } from '/home/user/Manual-test-Cases/build/testing-tools/probe_guard.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/printer-friendly-wo/staging-2026-09-10';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const VIS=`(e)=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);
  return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden'&&parseFloat(c.opacity)>0.01;}`;
const R={}; const save=()=>fs.writeFileSync(`${DIR}/evidence/s02-printroot.json`, JSON.stringify(R,null,1));
const WO = process.env.WO || '9dbddca9-e460-4b8c-80a8-b0f56b3ca732';

const s = await boot2('admin', {route:`/workorders/${WO}/lines`});
const {page} = s;
await settle(page,{label:'lines'});

// hook window.print so the dialog never blocks, but let the app do all its preparation first
await page.evaluate(()=>{ window.__printCalls=0; const o=window.print;
  window.print=function(){ window.__printCalls++; /* deliberately not calling through */ }; window.__origPrint=o; });

// the toolbar menu (not a line's menu) -> Print Work Order
R.menu = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const lines=document.querySelector('[data-test-id=table_work_order_lines]');
  const b=[...document.querySelectorAll('button,[role=button]')].filter(isVis)
    .filter(x=>/more_vert|more_horiz/.test(t(x))||/more/i.test(x.getAttribute('data-test-id')||''))
    .filter(x=>!(lines&&lines.contains(x)) && !/_line_|_[0-9a-f]{8}-[0-9a-f]{4}-/.test(x.getAttribute('data-test-id')||''))[0];
  if(!b) return {opened:false}; b.scrollIntoView({block:'center'}); b.click();
  return {opened:true, testid:b.getAttribute('data-test-id')};}, VIS);
await page.waitForTimeout(3500);
R.clickPrint = await page.evaluate(()=>{const b=document.querySelector('[data-test-id=menu_item_print_work_order]');
  if(!b) return {found:false}; b.scrollIntoView({block:'center'}); b.click(); return {found:true};});
log('menu %s | Print clicked %s', JSON.stringify(R.menu), JSON.stringify(R.clickPrint));
await page.waitForTimeout(6000);

R.state = await page.evaluate(()=>({
  printCalls: window.__printCalls,
  bodyClass: document.body.className,
  hasPrintRoot: !!document.getElementById('wo-print-root'),
  printRootChars: (document.getElementById('wo-print-root')?.innerText||'').length }));
log('after Print: printCalls=%s | body class="%s" | #wo-print-root present=%s (%d chars)',
  R.state.printCalls, R.state.bodyClass, R.state.hasPrintRoot, R.state.printRootChars);
save();
if (!R.state.hasPrintRoot){
  R.fatal='#wo-print-root was not built, so there is no printout to read — nothing reported as observed';
  log(R.fatal); save(); await s.browser.close(); process.exit(0); }

await page.emulateMedia({media:'print'});
await page.waitForTimeout(2000);
R.control = await page.evaluate(()=>{
  const outside=[...document.body.children].filter(e=>e.id!=='wo-print-root')
    .filter(e=>getComputedStyle(e).display!=='none').length;
  return {siblingsStillShowing:outside,
    proof: outside===0 ? 'everything except the printout is hidden — the printout is what is read below'
                       : 'other elements are STILL showing beside the printout'};});
log('CONTROL — elements outside the printout still showing: %d (%s)',
  R.control.siblingsStillShowing, R.control.proof);

R.printout = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const root=document.getElementById('wo-print-root'); if(!root) return {found:false};
  const txt=root.innerText||'';
  const money=[...txt.matchAll(/\$[\d,]+\.?\d*/g)].map(m=>m[0]);
  return {found:true, chars:txt.length,
    headings:[...root.querySelectorAll('h1,h2,h3,h4,h5,h6')].map(t).filter(Boolean).slice(0,12),
    tableHeaders:[...root.querySelectorAll('th')].map(t).filter(Boolean),
    buttons:[...root.querySelectorAll('button')].filter(isVis).map(t).filter(Boolean),
    inputs:root.querySelectorAll('input,select,textarea').length,
    links:[...root.querySelectorAll('a')].map(t).filter(Boolean).slice(0,10),
    money, moneyCount:money.length,
    mentionsProgress:/progress/i.test(txt), mentionsAction:/\baction\b/i.test(txt),
    mentionsRate:/\brate\b/i.test(txt), mentionsMargin:/\bmargin\b/i.test(txt),
    addTechStory:/add tech story/i.test(txt),
    printedAt:[...txt.matchAll(/printed[^\n]{0,70}/ig)].map(m=>m[0]).slice(0,4),
    head: txt.slice(0,900), tail: txt.slice(-400)};}, VIS);
log('PRINTOUT: %d chars | buttons %d | inputs %d | money %d',
  R.printout.chars, R.printout.buttons.length, R.printout.inputs, R.printout.moneyCount);
log('  headings: %s', JSON.stringify(R.printout.headings));
log('  table headers: %s', JSON.stringify(R.printout.tableHeaders));
log('  progress=%s action=%s rate=%s margin=%s | "add tech story"=%s',
  R.printout.mentionsProgress, R.printout.mentionsAction, R.printout.mentionsRate,
  R.printout.mentionsMargin, R.printout.addTechStory);
log('  printed-at: %s', JSON.stringify(R.printout.printedAt));
log('  --- head of the printout ---'); log(R.printout.head.slice(0,600));
log('  --- tail ---'); log(R.printout.tail);
await page.screenshot({path:`${DIR}/evidence/s02-printout.png`, fullPage:true});
await page.pdf({path:`${DIR}/evidence/s02-printout.pdf`, format:'A4', printBackground:true}).catch(e=>log('pdf: '+e.message));
save();
await page.emulateMedia({media:'screen'});
await s.browser.close();
log('done');
