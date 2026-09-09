// Walk the work-order list UI, read the Completed tab, open a Complete work order with lines,
// and check C44993 (no Add Part) / C44994 (no Edit control) on it.
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/inline-add-edit-parts/execution-2026-09-09';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const VIS=`(e)=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);
  return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden'&&parseFloat(c.opacity)>0.01;}`;
const s = await boot('sv9315','/workorders','admin');
const { page } = s;
const R={ build: await page.evaluate(()=>document.querySelector('meta[name=app-version]')?.content) };
await page.waitForTimeout(4000);

// filter tabs
const tabs = await page.evaluate(()=>{const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  return [...document.querySelectorAll('.q-tab,[role=tab],button')].map(t).filter(x=>/^(All|Estimates|Work Orders|Completed)$/.test(x));});
log('filter tabs:', JSON.stringify(tabs));
await page.evaluate(()=>{const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  [...document.querySelectorAll('.q-tab,[role=tab],button')].find(e=>t(e)==='Completed')?.click();});
await page.waitForTimeout(8000);
await page.screenshot({path:`${DIR}/evidence/20-a-completed-tab.png`, fullPage:true});

const rows = await page.evaluate(()=>{const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const hdr=[...document.querySelectorAll('thead th')].map(t);
  const body=[...document.querySelectorAll('tbody tr')].map(r=>[...r.querySelectorAll('td')].map(t));
  return {hdr, body:body.slice(0,15)};});
log('columns:', JSON.stringify(rows.hdr));
rows.body.slice(0,10).forEach(r=>log('   row:', JSON.stringify(r).slice(0,150)));
R.completedRows=rows;

// pick a row whose Lines count > 0 and open it
const idx = rows.hdr.findIndex(h=>/^Lines/.test(h));
const statusIdx = rows.hdr.findIndex(h=>/^Status/.test(h));
const pick = rows.body.findIndex(r=>idx>=0 && parseInt(r[idx]||'0',10)>0);
log('Lines column idx:', idx, '| chosen row:', pick, pick>=0?JSON.stringify(rows.body[pick]).slice(0,140):'none');
if (pick<0){ log('no Completed WO with lines - will need seeding'); fs.writeFileSync(`${DIR}/evidence/20-completed.json`,JSON.stringify(R,null,1)); await s.browser.close(); process.exit(0);}
R.chosenRow=rows.body[pick]; R.chosenStatus=rows.body[pick][statusIdx];
await page.evaluate(i=>{document.querySelectorAll('tbody tr')[i].click();}, pick);
await page.waitForTimeout(10000);
R.url=page.url(); log('opened:', R.url);
await page.evaluate(()=>{[...document.querySelectorAll('.q-expansion-item')].forEach(i=>i.querySelector('.q-item')?.click());});
await page.waitForTimeout(7000);
await page.screenshot({path:`${DIR}/evidence/20-b-completed-wo.png`, fullPage:true});

R.check = await page.evaluate(vis=>{
  const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const add=[...document.querySelectorAll('[data-test-id=button_add_part]')];
  const edit=[...document.querySelectorAll('[data-test-id^=button_edit_part_]')];
  return { statusOnPage:(document.body.innerText.match(/\b(Estimate|Approved|In progress|Review|Complete|Invoiced|Paid)\b/g)||[]).slice(0,6),
           addPartNodes:add.length, addPartVisible:add.filter(isVis).length,
           editNodes:edit.length, editVisible:edit.filter(isVis).length,
           partsTabText:(()=>{const e=[...document.querySelectorAll('[role=tab],.q-tab')].find(x=>/^Parts/.test(t(x))); return e?t(e):null;})() };
}, VIS);
log('C44993/C44994 on a Complete WO:', JSON.stringify(R.check));
fs.writeFileSync(`${DIR}/evidence/20-completed.json`, JSON.stringify(R,null,1));
await s.browser.close();
