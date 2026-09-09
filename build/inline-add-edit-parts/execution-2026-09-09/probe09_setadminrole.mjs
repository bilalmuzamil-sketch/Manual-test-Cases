// Assign the ADMIN ROLE to the Admin staff, per the QA lead's instruction of 2026-09-09
// ("make sure ... that admin has the admin role assigned"). The Admin ROLE DEFINITION is never
// opened or edited. The previous value is recorded first so it can be restored exactly.
// Reset-before-assign per his standing instruction and Rule 26.
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/inline-add-edit-parts/execution-2026-09-09';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const PREV='Tech View See financial ON';           // recorded 2026-09-09 before any change
const TARGET='Admin';
const s = await boot('sv9315','/workorders','admin');
const { page } = s;
const rec={ previousRole:PREV, target:TARGET, steps:[] };

await page.click('[data-test-id=profile_menu_button]'); await page.waitForTimeout(2500);
await page.evaluate(()=>{const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  [...document.querySelectorAll('.q-menu .q-item')].find(e=>/settings$/i.test(t(e)))?.click();});
await page.waitForTimeout(8000);
await page.evaluate(()=>{const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  [...document.querySelectorAll('.q-item,a,button')].find(e=>/staff$/i.test(t(e)))?.click();});
await page.waitForTimeout(8000);
log('staff url:', page.url());

// open the Admin ShopView row via its pencil
const op = await page.evaluate(()=>{
  const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const row=[...document.querySelectorAll('tr')].find(r=>/admin@shopview\.com/i.test(t(r)));
  if(!row) return 'admin row not found';
  const pencil=[...row.querySelectorAll('button,[role=button],i,span')].find(e=>/edit_note/.test(t(e)));
  if(!pencil) return 'no pencil; row='+t(row).slice(0,140);
  pencil.click(); return 'opened';
});
log('open Admin staff editor:', op); rec.steps.push('open:'+op);
await page.waitForTimeout(6000);
await page.screenshot({path:`${DIR}/evidence/09-a-admin-editor.png`, fullPage:true});

const before = await page.evaluate(()=>{
  const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const d=document.querySelector('.q-dialog')||document.body;
  const f=[...d.querySelectorAll('input,select')].map(i=>({
    label:(()=>{const p=i.closest('.q-field'); const l=p&&p.querySelector('.q-field__label'); return l?t(l):null;})(),
    tid:i.getAttribute('data-test-id'), value:(i.value||'').slice(0,44)}));
  return { fields:f.filter(x=>x.label||x.tid), buttons:[...d.querySelectorAll('button')].map(b=>t(b).slice(0,24)).slice(0,14) };
});
log('editor fields:'); before.fields.forEach(f=>log('   ', JSON.stringify(f)));
log('editor buttons:', JSON.stringify(before.buttons));
rec.before = before;
fs.writeFileSync(`${DIR}/evidence/09-admin-editor.json`, JSON.stringify(rec,null,1));
log('READ-ONLY so far - no change written. Inspect 09-admin-editor.json / screenshot next.');
await s.browser.close();
