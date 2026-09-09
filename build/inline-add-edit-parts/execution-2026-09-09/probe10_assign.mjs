// WRITE: Admin staff Role -> "Admin" (the system role, "Full system access").
// Per QA lead 2026-09-09: "make sure ... that admin has the admin role assigned" and
// "whenever you assign a role to a staff make sure that you first reset it."
// The Admin ROLE DEFINITION is never opened. Previous value recorded for exact restore.
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/inline-add-edit-parts/execution-2026-09-09';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const PREV='Tech View See financial ON', TARGET='Admin';
const s = await boot('sv9315','/workorders','admin');
const { page } = s;
const rec={ when:new Date().toISOString(), staff:'admin@shopview.com', previousRole:PREV, target:TARGET };

await page.click('[data-test-id=profile_menu_button]'); await page.waitForTimeout(2500);
await page.evaluate(()=>{const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  [...document.querySelectorAll('.q-menu .q-item')].find(e=>/settings$/i.test(t(e)))?.click();});
await page.waitForTimeout(8000);
await page.evaluate(()=>{const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  [...document.querySelectorAll('.q-item,a,button')].find(e=>/staff$/i.test(t(e)))?.click();});
await page.waitForTimeout(8000);
await page.evaluate(()=>{const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const row=[...document.querySelectorAll('tr')].find(r=>/admin@shopview\.com/i.test(t(r)));
  [...row.querySelectorAll('button,[role=button],i,span')].find(e=>/edit_note/.test(t(e)))?.click();});
await page.waitForTimeout(6000);

// locate the Role q-select by its label
const roleSel = await page.evaluateHandle(()=>{
  const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const f=[...document.querySelectorAll('.q-field')].find(x=>{const l=x.querySelector('.q-field__label'); return l&&/^Role$/i.test(t(l));});
  return f||null;
});
// STEP 1 - RESET: clear the current selection if the field offers a clear affordance
const cleared = await page.evaluate(f=>{
  if(!f) return 'no role field';
  const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const clr=[...f.querySelectorAll('button,i,span')].find(e=>/^cancel$/.test(t(e))||/clear/i.test(e.getAttribute('aria-label')||''));
  if(clr){ clr.click(); return 'cleared via clear icon'; }
  return 'no clear affordance (select will be overwritten by the new pick)';
}, roleSel);
log('STEP 1 reset:', cleared); rec.reset=cleared;
await page.waitForTimeout(2500);
await page.screenshot({path:`${DIR}/evidence/10-a-after-reset.png`, fullPage:true});

// STEP 2 - open the select and pick "Admin" EXACTLY
await page.evaluate(f=>{ (f.querySelector('.q-field__native, input, .q-field__control')||f).click(); }, roleSel);
await page.waitForTimeout(3000);
const opts = await page.evaluate(()=>{const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  return [...document.querySelectorAll('.q-menu .q-item')].map(t);});
log('role options:', JSON.stringify(opts));
rec.options=opts;
const picked = await page.evaluate(target=>{
  const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const it=[...document.querySelectorAll('.q-menu .q-item')].find(e=>t(e)===target);
  if(!it) return 'exact option not found';
  it.click(); return 'picked '+target;
}, TARGET);
log('STEP 2 assign:', picked); rec.pick=picked;
await page.waitForTimeout(3000);
await page.screenshot({path:`${DIR}/evidence/10-b-picked.png`, fullPage:true});

const nowVal = await page.evaluate(f=>{const i=f.querySelector('input'); return i?i.value:null;}, roleSel);
log('role field now reads:', nowVal); rec.fieldAfterPick=nowVal;

// STEP 3 - save
if (nowVal===TARGET) {
  const saved = await page.evaluate(()=>{const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
    const b=[...document.querySelectorAll('.q-dialog button, button')].find(e=>/save & close/i.test(t(e)));
    if(!b) return 'no save button'; if(b.disabled) return 'save DISABLED'; b.click(); return 'saved';});
  log('STEP 3 save:', saved); rec.save=saved;
  await page.waitForTimeout(8000);
  await page.screenshot({path:`${DIR}/evidence/10-c-saved.png`, fullPage:true});
  const rowNow = await page.evaluate(()=>{const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
    const r=[...document.querySelectorAll('tr')].find(x=>/admin@shopview\.com/i.test(t(x)));
    return r?[...r.querySelectorAll('td')].map(t):null;});
  log('Admin row after save:', JSON.stringify(rowNow)); rec.rowAfter=rowNow;
} else { log('NOT SAVING - field did not take the value'); rec.save='skipped'; }
fs.writeFileSync(`${DIR}/evidence/10-assign.json`, JSON.stringify(rec,null,1));
await s.browser.close();
