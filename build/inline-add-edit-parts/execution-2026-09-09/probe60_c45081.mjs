// C45081 pinned down: probe 48 saw the "Leave without saving?" dialog on an UNTOUCHED follow-on
// row (Full View / admin); probe 54 saw no dialog on the same shape (Tech View / tech). This runs
// the identical three legs in BOTH views on the same build, so the difference is either confirmed
// as view-dependent or shown to be noise.
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/inline-add-edit-parts/execution-2026-09-09';
const EST='b90d6e97-3f47-4745-8cc6-73765802d6ab';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const VIS=`(e)=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);
  return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden'&&parseFloat(c.opacity)>0.01;}`;
const R={};
for (const key of ['admin','tech']){
  for (const round of [1,2]){
    const s = await boot('sv9315','/workorders',key); const {page, APP}=s; const out={key, round};
    const fresh=async()=>{await page.goto(`${APP}/workorders/${EST}/lines`,{waitUntil:'domcontentloaded',timeout:60000});
      await page.waitForTimeout(9000);
      await page.evaluate(()=>{[...document.querySelectorAll('.q-expansion-item')].forEach(i=>i.querySelector('.q-item')?.click());});
      await page.waitForTimeout(7000);};
    const dlg=()=>page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
      return [...document.querySelectorAll('.q-dialog')].filter(isVis).map(d=>t(d).slice(0,120));}, VIS);
    const nav=()=>page.evaluate(()=>{const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
      const l=[...document.querySelectorAll('a,.q-item,.q-tab')].find(x=>/^schedule$/i.test(t(x)));
      if(l){l.click(); return t(l);} return 'none';});
    // control: a plain empty row (this is C45077, which passed)
    await fresh();
    await page.evaluate(()=>{const b=document.querySelector('[data-test-id=button_add_part]'); b.scrollIntoView({block:'center'}); b.click();});
    await page.waitForTimeout(4500);
    await nav(); await page.waitForTimeout(5000);
    out.control = { dialogs: await dlg(), url: page.url() };
    // the case under test: the follow-on row that opens after a save
    await fresh();
    await page.evaluate(()=>{const b=document.querySelector('[data-test-id=button_add_part]'); b.scrollIntoView({block:'center'}); b.click();});
    await page.waitForTimeout(4500);
    await page.fill('[data-test-id=input_inline_part_description]',`ZZAUTOTEST c45081 ${key}${round}`);
    await page.fill('[data-test-id=input_inline_part_quantity]','1');
    if (key==='admin'){
      if (await page.$('[data-test-id=input_inline_part_cost]')) await page.fill('[data-test-id=input_inline_part_cost]','1.00');
      if (await page.$('[data-test-id=input_inline_part_sell_price]')) await page.fill('[data-test-id=input_inline_part_sell_price]','2.00');
    }
    await page.waitForTimeout(1500);
    await page.evaluate(()=>document.querySelector('[data-test-id=button_save_inline_part]')?.click());
    await page.waitForTimeout(9000);
    out.followOn = await page.evaluate(()=>{const d=document.querySelector('[data-test-id=input_inline_part_description]');
      if(!d) return {open:false};
      const g=t=>{const e=document.querySelector(`[data-test-id=${t}]`); return e? (e.value||''):null;};
      return {open:true, desc:d.value, qty:g('input_inline_part_quantity'),
              cost:g('input_inline_part_cost'), sell:g('input_inline_part_sell_price')};});
    await nav(); await page.waitForTimeout(5500);
    out.afterNav = { dialogs: await dlg(), url: page.url() };
    log('%s round %d | control=%s | follow-on row=%s | navigate=%s', key, round,
        JSON.stringify(out.control.dialogs), JSON.stringify(out.followOn), JSON.stringify(out.afterNav));
    await page.screenshot({path:`${DIR}/evidence/60-${key}-${round}.png`, fullPage:true});
    R[`${key}_${round}`]=out;
    await s.browser.close();
  }
}
fs.writeFileSync(`${DIR}/evidence/60-c45081.json`, JSON.stringify(R,null,1));
