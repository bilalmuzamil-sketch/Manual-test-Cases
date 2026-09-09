// C44997: with a populated inline add row open on one line, pressing + Add Part on ANOTHER line
// must show the unsaved-data confirmation (S6-R5) BEFORE the requested row opens.
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/inline-add-edit-parts/execution-2026-09-09';
const EST='b90d6e97-3f47-4745-8cc6-73765802d6ab';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const s = await boot('sv9315','/workorders','admin');
const { page, APP } = s;
await page.goto(`${APP}/workorders/${EST}/lines`,{waitUntil:'domcontentloaded',timeout:60000});
await page.waitForTimeout(10000);
await page.evaluate(()=>{[...document.querySelectorAll('.q-expansion-item')].forEach(i=>i.querySelector('.q-item')?.click());});
await page.waitForTimeout(7000);
const R={};
const n = await page.evaluate(()=>document.querySelectorAll('[data-test-id=button_add_part]').length);
log('Add Part controls:', n); R.addPartControls=n;
if (n<2){ log('need two lines; abort'); await s.browser.close(); process.exit(0); }

// open the row on line 1 and PUT DATA IN IT
await page.evaluate(()=>{const b=document.querySelectorAll('[data-test-id=button_add_part]')[0]; b.scrollIntoView({block:'center'}); b.click();});
await page.waitForTimeout(4500);
await page.fill('[data-test-id=input_inline_part_description]', 'ZZAUTOTEST guard check');
await page.waitForTimeout(1200);
R.rowOpenWithData = await page.$eval('[data-test-id=input_inline_part_description]', e=>e.value);
log('row 1 populated with:', R.rowOpenWithData);
await page.screenshot({path:`${DIR}/evidence/16-a-populated.png`, fullPage:true});

// now press + Add Part on ANOTHER line
await page.evaluate(()=>{const b=document.querySelectorAll('[data-test-id=button_add_part]')[1]; b.scrollIntoView({block:'center'}); b.click();});
await page.waitForTimeout(4500);
R.afterSecondClick = await page.evaluate(()=>{
  const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const d=[...document.querySelectorAll('.q-dialog')].filter(x=>x.offsetParent);
  const desc=document.querySelectorAll('[data-test-id=input_inline_part_description]');
  return { confirmationShown:d.length>0,
           dialogText: d.length? t(d[0]).slice(0,220):null,
           dialogButtons: d.length? [...d[0].querySelectorAll('button')].map(b=>t(b).slice(0,26)):[],
           inlineRowsOpen: desc.length,
           firstRowValue: desc.length? desc[0].value : null };
});
log('C44997:', JSON.stringify(R.afterSecondClick));
await page.screenshot({path:`${DIR}/evidence/16-b-guard.png`, fullPage:true});
fs.writeFileSync(`${DIR}/evidence/16-c44997.json`, JSON.stringify(R,null,1));
await s.browser.close();
