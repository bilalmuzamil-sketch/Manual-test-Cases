// Which row is which? Dump the lines table row by row, before and after expanding one line, so the
// relationship between a line's marker row and its "+ Add Part" row is read rather than inferred.
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/inline-add-edit-parts/execution-2026-09-09';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const VIS=`(e)=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);
  return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden'&&parseFloat(c.opacity)>0.01;}`;
const R={}; const save=()=>fs.writeFileSync(`${DIR}/evidence/114-rowseq.json`, JSON.stringify(R,null,1));
const WO='6a529a5f-dff9-4c13-9636-b41500e585f0';
const LINE='cd8c3e17-27da-49cd-8a89-21931d12b893';

const s = await boot('sv9315', `/workorders/${WO}/lines`, 'admin');
const {page} = s;
const dump = ()=>page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const tbl=document.querySelector('[data-test-id=table_work_order_lines]');
  if(!tbl) return {tableFound:false};
  return {tableFound:true, rows:[...tbl.querySelectorAll('tr')].map((r,i)=>({
    i, cls:(r.className||'').toString().slice(0,70), visible:isVis(r),
    markers:[...r.querySelectorAll('[data-test-id]')].map(e=>e.getAttribute('data-test-id'))
      .filter(x=>/^(badge_line_status_|button_line_expand_|line_number_|button_add_part|button_action_complete_line_)/.test(x))
      .map(x=>x.replace(/([0-9a-f]{8})[0-9a-f-]{28}/,'$1…')),
    addPart:!!r.querySelector('[data-test-id=button_add_part]'),
    text:t(r).slice(0,60)}))};}, VIS);

await page.waitForTimeout(10000);
R.before = await dump();
log('BEFORE expanding — %d rows', (R.before.rows||[]).length);
for (const r of (R.before.rows||[])) log('  %2d %s%s %s | %s', r.i, r.visible?'':'(hidden) ',
  r.addPart?'[ADD PART]':'          ', JSON.stringify(r.markers), r.text);
save();

R.expand = await page.evaluate(id=>{const b=document.querySelector(`[data-test-id="button_line_expand_${id}"]`);
  if(!b) return {found:false}; b.scrollIntoView({block:'center'}); b.click(); return {found:true};}, LINE);
log('expand %s -> %s', LINE.slice(0,8), JSON.stringify(R.expand));
await page.waitForTimeout(7000);
R.after = await dump();
log('AFTER expanding — %d rows', (R.after.rows||[]).length);
for (const r of (R.after.rows||[])) log('  %2d %s%s %s | %s', r.i, r.visible?'':'(hidden) ',
  r.addPart?'[ADD PART]':'          ', JSON.stringify(r.markers), r.text);
await page.screenshot({path:`${DIR}/evidence/114-expanded.png`, fullPage:true});
save();
await s.browser.close();
log('done');
