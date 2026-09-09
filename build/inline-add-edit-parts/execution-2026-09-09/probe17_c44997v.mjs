// C44997 rigorous re-test: REAL mouse click on the second line's + Add Part, with proof the click
// landed, and a sweep for the S6-R1 confirmation anywhere in the DOM (portals included).
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/inline-add-edit-parts/execution-2026-09-09';
const EST='b90d6e97-3f47-4745-8cc6-73765802d6ab';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const s = await boot('sv9315','/workorders','admin');
const { page, APP } = s;
const R={ build: await page.evaluate(()=>document.querySelector('meta[name=app-version]')?.content) };
await page.goto(`${APP}/workorders/${EST}/lines`,{waitUntil:'domcontentloaded',timeout:60000});
await page.waitForTimeout(10000);
await page.evaluate(()=>{[...document.querySelectorAll('.q-expansion-item')].forEach(i=>i.querySelector('.q-item')?.click());});
await page.waitForTimeout(7000);

const btns = await page.$$('[data-test-id=button_add_part]');
log('Add Part controls:', btns.length);
// which LINE does each belong to? (prove they are different lines)
R.lines = await page.evaluate(()=>{
  const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  return [...document.querySelectorAll('[data-test-id=button_add_part]')].map(b=>{
    let box=b; for(let i=0;i<12&&box.parentElement;i++){ box=box.parentElement;
      if(box.classList.contains('q-expansion-item')||/^\d{2}\b/.test(t(box))) break; }
    return t(box).slice(0,60);
  });
});
log('per-button line context:', JSON.stringify(R.lines));

// open row on line 1 and type
await btns[0].scrollIntoViewIfNeeded(); await btns[0].click();
await page.waitForTimeout(4500);
await page.fill('[data-test-id=input_inline_part_description]','ZZAUTOTEST guard');
await page.fill('[data-test-id=input_inline_part_quantity]','2').catch(()=>{});
await page.waitForTimeout(1500);
R.before = await page.evaluate(()=>({rows:document.querySelectorAll('[data-test-id=input_inline_part_description]').length,
  val:document.querySelector('[data-test-id=input_inline_part_description]')?.value}));
log('row 1 state:', JSON.stringify(R.before));

// REAL click on the SECOND line's Add Part, with visibility proof
const b2 = (await page.$$('[data-test-id=button_add_part]'))[1];
R.secondBtn = await b2.evaluate(e=>{const r=e.getBoundingClientRect();
  return {visible:!!e.offsetParent, disabled:e.disabled||e.getAttribute('aria-disabled')==='true',
          w:r.width,h:r.height, pointerEvents:getComputedStyle(e).pointerEvents};});
log('second Add Part button:', JSON.stringify(R.secondBtn));
await b2.scrollIntoViewIfNeeded();
let clickErr=null;
try { await b2.click({timeout:15000}); } catch(e){ clickErr=String(e).split('\n')[0].slice(0,140); }
R.clickError=clickErr; log('real click:', clickErr||'landed');
await page.waitForTimeout(5000);

R.after = await page.evaluate(()=>{
  const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const dialogs=[...document.querySelectorAll('.q-dialog,[role=dialog],.q-notification')].filter(x=>x.offsetParent);
  const bodyHasDiscard=/Discard this part\?|Discard Part|Keep Editing/i.test(document.body.innerText||'');
  const rows=[...document.querySelectorAll('[data-test-id=input_inline_part_description]')];
  return { visibleDialogs:dialogs.length,
           dialogTexts:dialogs.map(d=>t(d).slice(0,200)),
           bodyMentionsDiscardWording:bodyHasDiscard,
           inlineRows:rows.length, rowValues:rows.map(r=>r.value) };
});
log('AFTER:', JSON.stringify(R.after));
await page.screenshot({path:`${DIR}/evidence/17-after-second-addpart.png`, fullPage:true});
fs.writeFileSync(`${DIR}/evidence/17-c44997.json`, JSON.stringify(R,null,1));
await s.browser.close();
