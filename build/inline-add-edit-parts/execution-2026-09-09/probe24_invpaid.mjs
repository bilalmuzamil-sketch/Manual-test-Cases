import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/inline-add-edit-parts/execution-2026-09-09';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const VIS=`(e)=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);
  return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden'&&parseFloat(c.opacity)>0.01;}`;
const s = await boot('sv9315','/workorders','admin'); const { page } = s;
const R={rows:{}};
await page.waitForTimeout(4000);
// scan BOTH tabs for every status, collecting numbers
for (const tab of ['All','Completed']) {
  await page.evaluate(t0=>{const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
    [...document.querySelectorAll('.q-tab,[role=tab],button')].find(e=>t(e)===t0)?.click();}, tab);
  await page.waitForTimeout(7000);
  const rows = await page.evaluate(()=>{const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
    return [...document.querySelectorAll('tbody tr')].map(r=>[...r.querySelectorAll('td')].map(t)).filter(r=>r.length>3)
      .map(r=>({status:r[1], num:r[2], lines:r[11]}));});
  const wanted=rows.filter(r=>/Invoiced|Paid/i.test(r.status));
  log(`${tab} tab: ${rows.length} rows | Invoiced/Paid here:`, JSON.stringify(wanted));
  for (const w of wanted) if(!R.rows[w.status]) R.rows[w.status]={...w, tab};
}
log('targets:', JSON.stringify(R.rows));
for (const [st,info] of Object.entries(R.rows)) {
  await page.evaluate(t0=>{const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
    [...document.querySelectorAll('.q-tab,[role=tab],button')].find(e=>t(e)===t0)?.click();}, info.tab);
  await page.waitForTimeout(7000);
  const ok = await page.evaluate(n=>{const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
    const r=[...document.querySelectorAll('tbody tr')].find(x=>t(x).includes(n)); if(!r) return false; r.click(); return true;}, info.num);
  if(!ok){ log(st,'row not clickable'); continue; }
  await page.waitForTimeout(10000);
  await page.evaluate(()=>{[...document.querySelectorAll('.q-expansion-item')].forEach(i=>i.querySelector('.q-item')?.click());});
  await page.waitForTimeout(7000);
  const out = await page.evaluate(vis=>{
    const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
    const add=[...document.querySelectorAll('[data-test-id=button_add_part]')];
    const ed=[...document.querySelectorAll('[data-test-id^=button_edit_part_]')];
    return { statusSeen:(document.body.innerText.match(/\b(Estimate|Approved|In progress|Ready for Review|Declined|Complete|Invoiced|Paid)\b/)||[])[0],
      partsHeadings:[...document.querySelectorAll('*')].filter(e=>e.children.length===0&&/^Parts\b/i.test(t(e))&&isVis(e)).length,
      expanded:[...document.querySelectorAll('.q-expansion-item--expanded')].length,
      addPart:add.length, addPartVisible:add.filter(isVis).length, editControls:ed.length };
  }, VIS);
  R.rows[st].result=out;
  log(`${st} (${info.num}):`, JSON.stringify(out));
  await page.screenshot({path:`${DIR}/evidence/24-${st}.png`, fullPage:true});
}
fs.writeFileSync(`${DIR}/evidence/24-invpaid.json`, JSON.stringify(R,null,1));
await s.browser.close();
