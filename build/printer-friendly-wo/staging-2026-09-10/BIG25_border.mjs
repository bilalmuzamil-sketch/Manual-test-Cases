// The QA lead's own printout shows a heavy rule between line blocks. My earlier reading said there
// was none, so the reading was wrong. This finds where the rule actually lives: every element in
// the print root, every edge, plus outlines, box-shadows and ::before/::after.
import { boot2, APP, API_HOST } from '/home/user/Manual-test-Cases/build/testing-tools/staging-boot2.mjs';
import { settle } from '/home/user/Manual-test-Cases/build/testing-tools/probe_guard.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/printer-friendly-wo/staging-2026-09-10';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const R={}; const save=()=>fs.writeFileSync(`${DIR}/evidence/BIG25.json`, JSON.stringify(R,null,1));
const WO='9e1934ae-a2f7-41f1-baae-0ee5690e9a96';
const s = await boot2('admin', {route:`/workorders/${WO}/lines`});
const {page}=s;
await settle(page,{label:'start'});
await page.evaluate(()=>{window.__p=0; window.print=function(){window.__p++;};});
await page.evaluate(()=>{const b=document.querySelector('[data-test-id=button_work_order_nav_bar_menu]'); if(b) b.click();});
await page.waitForTimeout(2500);
await page.evaluate(()=>{const b=document.querySelector('[data-test-id=menu_item_print_work_order]'); if(b) b.click();});
await page.waitForTimeout(7000);
R.printed = await page.evaluate(()=>({calls:window.__p, hasRoot:!!document.getElementById('wo-print-root')}));

await page.emulateMedia({media:'print'});
await page.waitForTimeout(2000);
R.scan = await page.evaluate(()=>{
  const root=document.getElementById('wo-print-root'); if(!root) return {found:false};
  const num=v=>parseFloat(v)||0;
  const out=[];
  const all=[...root.querySelectorAll('*')];
  for (const e of all){
    const c=getComputedStyle(e);
    const edges={
      bt: c.borderTopStyle!=='none'?num(c.borderTopWidth):0,
      bb: c.borderBottomStyle!=='none'?num(c.borderBottomWidth):0,
      ol: c.outlineStyle!=='none'?num(c.outlineWidth):0,
    };
    const before=getComputedStyle(e,'::before'), after=getComputedStyle(e,'::after');
    const pseudo = (before.content!=='none'&&(num(before.height)>0||before.borderTopStyle!=='none'))
                || (after.content!=='none'&&(num(after.height)>0||after.borderTopStyle!=='none'));
    const shadow = c.boxShadow && c.boxShadow!=='none';
    const thinBox = e.offsetHeight>0 && e.offsetHeight<=4 && e.offsetWidth>200
                 && c.backgroundColor && !/rgba\(0, 0, 0, 0\)|transparent/.test(c.backgroundColor);
    if (edges.bt>=1.5||edges.bb>=1.5||edges.ol>=1.5||pseudo||shadow||thinBox){
      const r=e.getBoundingClientRect();
      out.push({tag:e.tagName, cls:(e.className||'').toString().slice(0,50),
        txt:(e.innerText||'').replace(/\s+/g,' ').slice(0,42),
        ...edges, pseudo, shadow: shadow?c.boxShadow.slice(0,40):null,
        thinBox: thinBox?c.backgroundColor:null, y:Math.round(r.top), h:Math.round(r.height)});
    }
  }
  // and the rows again, so the two readings sit side by side
  const rows=[...root.querySelectorAll('tr')].map((tr,i)=>{
    const c=getComputedStyle(tr);
    const cells=[...tr.children].map(td=>{const s2=getComputedStyle(td);
      return {bt:s2.borderTopStyle!=='none'?num(s2.borderTopWidth):0,
              bb:s2.borderBottomStyle!=='none'?num(s2.borderBottomWidth):0};});
    return {i, t:(tr.innerText||'').replace(/\s+/g,' ').slice(0,40),
      trBt:c.borderTopStyle!=='none'?num(c.borderTopWidth):0,
      trBb:c.borderBottomStyle!=='none'?num(c.borderBottomWidth):0,
      cellBt:Math.max(0,...cells.map(x=>x.bt)), cellBb:Math.max(0,...cells.map(x=>x.bb)),
      cls:(tr.className||'').toString().slice(0,40), h:tr.offsetHeight};
  });
  return {found:true, heavy:out, rows, totalElems:all.length};
});
log('elements in the printed page: %d | things that draw a heavy edge: %d',
  R.scan.totalElems, (R.scan.heavy||[]).length);
for (const h of (R.scan.heavy||[]).slice(0,25))
  log('   %s.%s  top=%s bottom=%s outline=%s pseudo=%s thinbox=%s  y=%d  "%s"',
    h.tag, h.cls, h.bt, h.bb, h.ol, h.pseudo, h.thinBox, h.y, h.txt);
save();
await page.screenshot({path:`${DIR}/evidence/BIG25-print.png`, fullPage:true}).catch(()=>{});
const html = await page.evaluate(()=>{const r=document.getElementById('wo-print-root'); return r?r.outerHTML:'';});
fs.writeFileSync(`${DIR}/evidence/BIG25-printroot.html`, html);
await page.emulateMedia({media:'screen'});
log('rows, both readings:');
for (const r of (R.scan.rows||[]))
  log('   %d trTop=%s trBot=%s cellTop=%s cellBot=%s h=%d cls=%s | %s',
    r.i, r.trBt, r.trBb, r.cellBt, r.cellBb, r.h, r.cls, r.t);
save();
log('done');
await s.browser.close();
process.exit(0);
