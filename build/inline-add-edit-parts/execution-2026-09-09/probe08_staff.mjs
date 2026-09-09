// READ-ONLY. Settings -> Staff -> find tech@shopview.com -> open its editor and read the role
// controls. Records the CURRENT role so it can be restored. Admin staff is never opened.
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/inline-add-edit-parts/execution-2026-09-09';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const s = await boot('sv9315','/workorders','admin');
const { page } = s;
await page.click('[data-test-id=profile_menu_button]'); await page.waitForTimeout(2500);
await page.evaluate(()=>{const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  [...document.querySelectorAll('.q-menu .q-item')].find(e=>/settings$/i.test(t(e)))?.click();});
await page.waitForTimeout(8000);
await page.evaluate(()=>{const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  [...document.querySelectorAll('.q-item,a,button')].find(e=>/staff$/i.test(t(e)))?.click();});
await page.waitForTimeout(8000);
log('url:', page.url());
await page.screenshot({path:`${DIR}/evidence/08-staff.png`, fullPage:true});

// search for the tech user
const sb = await page.$('input[type=search], input[aria-label*=Search i], [data-test-id*=search] input');
if (sb) { await sb.fill('tech@shopview.com'); await page.waitForTimeout(5000); }
else log('no search box found');
const rows = await page.evaluate(()=>{
  const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  return [...document.querySelectorAll('tr')].map(r=>({cells:[...r.querySelectorAll('td,th')].map(t)}))
    .filter(r=>r.cells.length>1).slice(0,12);
});
log('staff rows after search:'); rows.forEach(r=>log('   ', JSON.stringify(r.cells).slice(0,160)));
await page.screenshot({path:`${DIR}/evidence/08-staff-search.png`, fullPage:true});

// open the row's editor via the pencil (edit_note) - never the row itself
const opened = await page.evaluate(()=>{
  const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const row=[...document.querySelectorAll('tr')].find(r=>/tech@shopview\.com/i.test(t(r)));
  if(!row) return 'tech row not found';
  const pencil=[...row.querySelectorAll('button,[role=button],i,span')]
    .find(e=>/edit/i.test(t(e))||/edit/i.test(e.getAttribute('data-test-id')||''));
  if(!pencil) return 'no edit control in row; row='+t(row).slice(0,120);
  pencil.click(); return 'clicked edit';
});
log('open editor:', opened);
await page.waitForTimeout(6000);
await page.screenshot({path:`${DIR}/evidence/08-staff-edit.png`, fullPage:true});
const dlg = await page.evaluate(()=>{
  const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const d=document.querySelector('.q-dialog'); if(!d) return {none:true, body:(document.body.innerText||'').replace(/\s+/g,' ').slice(0,400)};
  return { title:t(d).slice(0,120),
    fields:[...d.querySelectorAll('input,select')].map(i=>({tid:i.getAttribute('data-test-id'),
      label:(()=>{const p=i.closest('.q-field'); const l=p&&p.querySelector('.q-field__label'); return l?t(l):null;})(),
      value:(i.value||'').slice(0,40), ro:i.readOnly})),
    buttons:[...d.querySelectorAll('button')].map(b=>({l:t(b).slice(0,26),tid:b.getAttribute('data-test-id'),dis:b.disabled})) };
});
log('dialog:', JSON.stringify(dlg,null,1).slice(0,1600));
fs.writeFileSync(`${DIR}/evidence/08-staff.json`, JSON.stringify({rows,dlg},null,1));
await s.browser.close();
