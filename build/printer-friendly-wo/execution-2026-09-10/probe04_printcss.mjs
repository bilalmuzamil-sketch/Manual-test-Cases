// Does this build have a print stylesheet at all, and is my print-media emulation even working?
// probe03 read the page under print media and found EVERYTHING still there — 25 buttons, 5 tabs, the
// navigation, 20 money amounts. That would fail a dozen cases at once, which is exactly the shape of
// result that has been my own fault five times today. Rule 104: prove the instrument first.
//   CONTROL 1 — does anything at all change between screen media and print media? If literally
//               nothing changes, my emulation may not be applying.
//   CONTROL 2 — do the loaded stylesheets contain ANY @media print rules? If they do and nothing
//               changes, the emulation is broken. If they contain none, the finding is real.
//   CONTROL 3 — does the app build a separate print view (a hidden container, an iframe, a route)?
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import { settle } from '/home/user/Manual-test-Cases/build/testing-tools/probe_guard.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/printer-friendly-wo/execution-2026-09-10';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const R={}; const save=()=>fs.writeFileSync(`${DIR}/evidence/04-printcss.json`, JSON.stringify(R,null,1));
const WO='6a529a5f-dff9-4c13-9636-b41500e585f0';
const countVisible = (page)=>page.evaluate(()=>{
  let n=0; for (const e of document.querySelectorAll('body *')){
    if (e.children.length) continue;
    const c=getComputedStyle(e); const r=e.getBoundingClientRect();
    if (c.display!=='none' && c.visibility!=='hidden' && r.width>0 && r.height>0) n++; }
  return n;});

const s = await boot('sv9315', `/workorders/${WO}/lines`, 'admin');
const {page} = s;
await settle(page,{label:'work order'});

await page.emulateMedia({media:'screen'});
await page.waitForTimeout(1500);
R.screenVisible = await countVisible(page);
await page.emulateMedia({media:'print'});
await page.waitForTimeout(1500);
R.printVisible = await countVisible(page);
R.control1_somethingChanges = R.screenVisible !== R.printVisible;
log('CONTROL 1 — visible leaf elements: screen %d, print %d -> emulation changes the page: %s',
  R.screenVisible, R.printVisible, R.control1_somethingChanges);
save();

R.control2 = await page.evaluate(()=>{
  const out={sheets:0, unreadable:0, printRules:0, samples:[], printSheets:[]};
  for (const sh of document.styleSheets){
    out.sheets++;
    if (sh.media && /print/i.test(sh.media.mediaText||'')) out.printSheets.push(sh.href||'(inline)');
    let rules=null;
    try { rules = sh.cssRules; } catch(e){ out.unreadable++; continue; }
    const walk=(list)=>{ for (const r of list){
      if (r.type===4 /* CSSMediaRule */){
        if (/print/i.test(r.conditionText||r.media?.mediaText||'')){
          out.printRules++;
          if (out.samples.length<8) out.samples.push((r.cssText||'').slice(0,150));
        }
        if (r.cssRules) walk(r.cssRules);
      } else if (r.cssRules) walk(r.cssRules); } };
    walk(rules);
  }
  return out;});
log('CONTROL 2 — stylesheets %d (%d unreadable) | @media print rules found: %d | print-media sheets: %s',
  R.control2.sheets, R.control2.unreadable, R.control2.printRules, JSON.stringify(R.control2.printSheets));
for (const x of R.control2.samples) log('     %s', x);
save();

R.control3 = await page.evaluate(()=>({
  iframes: document.querySelectorAll('iframe').length,
  printContainers: [...document.querySelectorAll('[class*=print],[id*=print],[data-test-id*=print]')]
    .map(e=>({tag:e.tagName.toLowerCase(), cls:(e.className||'').toString().slice(0,60),
      id:e.id||null, testid:e.getAttribute('data-test-id'),
      visible:getComputedStyle(e).display!=='none'})).slice(0,12),
}));
log('CONTROL 3 — iframes %d | print-named containers: %s', R.control3.iframes,
  JSON.stringify(R.control3.printContainers));
save();

R.conclusion = !R.control2.printRules
  ? 'NO @media print rules are loaded at all — a real finding, and the instrument is not in question'
  : (R.control1_somethingChanges
      ? 'print rules exist AND the emulation changes the page — any remaining visible element is a real finding'
      : 'print rules EXIST but nothing changed — MY EMULATION IS SUSPECT, do not report a finding');
log('CONCLUSION: %s', R.conclusion);
save();
await page.emulateMedia({media:'screen'});
await s.browser.close();
log('done');
