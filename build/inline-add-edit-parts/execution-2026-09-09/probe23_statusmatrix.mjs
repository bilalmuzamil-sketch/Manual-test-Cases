// Status matrix: for Declined / Invoiced / Paid work orders, is the Add Part control and the Edit
// control present? Settles C44993 + C44994 fully, and tells us whether "Declined" belongs in the
// preconditions Viktoria asked us to add it to.
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/inline-add-edit-parts/execution-2026-09-09';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const VIS=`(e)=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);
  return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden'&&parseFloat(c.opacity)>0.01;}`;
const s = await boot('sv9315','/workorders','admin');
const { page } = s;
const R={ build: await page.evaluate(()=>document.querySelector('meta[name=app-version]')?.content), rows:{} };
await page.waitForTimeout(4000);

async function openByNumber(num){
  await page.evaluate(()=>{const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
    [...document.querySelectorAll('.q-tab,[role=tab],button')].find(e=>t(e)==='All')?.click();});
  await page.waitForTimeout(6000);
  const ok = await page.evaluate(n=>{const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
    const r=[...document.querySelectorAll('tbody tr')].find(x=>t(x).includes(n));
    if(!r) return false; r.click(); return true;}, num);
  if(!ok) return null;
  await page.waitForTimeout(10000);
  await page.evaluate(()=>{[...document.querySelectorAll('.q-expansion-item')].forEach(i=>i.querySelector('.q-item')?.click());});
  await page.waitForTimeout(7000);
  return page.evaluate(vis=>{
    const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
    const add=[...document.querySelectorAll('[data-test-id=button_add_part]')];
    const ed=[...document.querySelectorAll('[data-test-id^=button_edit_part_]')];
    const partsHeads=[...document.querySelectorAll('*')].filter(e=>e.children.length===0&&/^Parts\b/i.test(t(e))&&isVis(e)).length;
    return { status:(document.body.innerText.match(/\b(Estimate|Approved|In progress|Ready for Review|Review|Declined|Complete|Invoiced|Paid)\b/)||[])[0],
             url:location.pathname, partsHeadings:partsHeads, expanded:[...document.querySelectorAll('.q-expansion-item--expanded')].length,
             addPart:add.length, addPartVisible:add.filter(isVis).length,
             edit:ed.length, editNodes:ed.length };
  }, VIS);
}

for (const [label,num] of [['Declined',null],['Invoiced','S2-15828'],['Paid','S9315-15894']]) {
  let n=num;
  if (!n) { // find the one Declined WO by scanning the All tab
    await page.evaluate(()=>{const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
      [...document.querySelectorAll('.q-tab,[role=tab],button')].find(e=>t(e)==='All')?.click();});
    await page.waitForTimeout(6000);
    n = await page.evaluate(()=>{const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
      const r=[...document.querySelectorAll('tbody tr')].find(x=>{const c=[...x.querySelectorAll('td')].map(t); return c[1]==='Declined';});
      return r? [...r.querySelectorAll('td')].map(t)[2] : null;});
    log('Declined WO number:', n);
  }
  if (!n) { log(`${label}: no work order found`); continue; }
  const out = await openByNumber(n);
  R.rows[label]={number:n, ...out};
  log(`${label} (${n}):`, JSON.stringify(out));
  await page.screenshot({path:`${DIR}/evidence/23-${label}.png`, fullPage:true});
}
fs.writeFileSync(`${DIR}/evidence/23-statusmatrix.json`, JSON.stringify(R,null,1));
await s.browser.close();
