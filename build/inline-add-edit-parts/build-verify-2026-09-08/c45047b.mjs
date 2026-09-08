// C45047 on v26.35.9 - EXPAND a line first, then the Parts-section "+ Add Part" opens the inline row.
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const OUT='build/inline-add-edit-parts/build-verify-2026-09-08';
const { browser, page } = await boot('sv9315', '/workorders/b90d6e97-3f47-4745-8cc6-73765802d6ab/lines', 'admin');
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const lab='e=>{const c=e.cloneNode(true);c.querySelectorAll("svg").forEach(n=>n.remove());return (c.textContent||"").replace(/\\s+/g," ").trim();}';
await page.waitForTimeout(12000);
// expand the first line: click a line row/header (not the Add Part)
await page.evaluate(L=>{const lab=eval(L);
  // a line is usually a card/expansion; click its header text (Labor/Parts live inside)
  const exp=[...document.querySelectorAll('.q-expansion-item__container,.q-expansion-item,[class*=line]')].find(e=>/Parts|Labor/i.test(lab(e)));
  if(exp){const h=exp.querySelector('.q-expansion-item__toggle-icon,.q-item,[class*=header]')||exp; h.setAttribute('data-qa-line','1');}}, lab);
if (await page.locator('[data-qa-line="1"]').count()) { await page.locator('[data-qa-line="1"]').click().catch(()=>{}); await page.waitForTimeout(3000); }
// now find + Add Part and click
const n = await page.evaluate(L=>{const lab=eval(L); const bs=[...document.querySelectorAll('button,.q-btn,a')].filter(e=>/Add Part/i.test(lab(e)));
  bs.forEach((b,i)=>b.setAttribute('data-qa-add',String(i))); return bs.length;}, lab);
log('Add Part buttons:', n);
for (let i=0;i<n;i++){
  await page.locator(`[data-qa-add="${i}"]`).click().catch(()=>{}); await page.waitForTimeout(3500);
  const has = await page.evaluate(()=>{ const di=[...document.querySelectorAll('input')].find(x=>/description/i.test(x.placeholder||'')&&x.offsetParent); return !!di; });
  if (has) { log('inline row opened via Add Part #'+i); break; }
}
const di = await page.evaluate(()=>{ const d=[...document.querySelectorAll('input')].find(x=>/description/i.test(x.placeholder||'')&&x.offsetParent);
  if(!d) return null; d.setAttribute('data-qa-desc','1'); const q=[...document.querySelectorAll('input')].find(x=>(x.placeholder||'').toLowerCase()==='qty'&&x.offsetParent); if(q)q.setAttribute('data-qa-qty','1'); return true; });
if (!di) { log('STILL no inline row - dumping the line structure'); 
  const dump=await page.evaluate(L=>{const lab=eval(L); return {btns:[...new Set([...document.querySelectorAll('button,.q-btn')].map(lab).filter(x=>x&&x.length<26))].slice(0,25)};}, lab);
  console.log(JSON.stringify(dump)); await page.screenshot({path:`${OUT}/c45047b-noinline.png`,fullPage:true}); await browser.close(); process.exit(2); }
await page.locator('[data-qa-desc="1"]').fill('ZZAUTOTEST c45047');
if (await page.locator('[data-qa-qty="1"]').count()) await page.locator('[data-qa-qty="1"]').fill('2');
await page.waitForTimeout(1200);
const before={desc:await page.locator('[data-qa-desc="1"]').inputValue()};
log('filled:', JSON.stringify(before));
await page.evaluate(L=>{const lab=eval(L); const b=[...document.querySelectorAll('button,.q-btn,[role=button]')].find(e=>/More options/i.test(lab(e))); if(b)b.setAttribute('data-qa-mo','1');}, lab);
if(!(await page.locator('[data-qa-mo="1"]').count())){log('no More options'); await page.screenshot({path:`${OUT}/c45047b-nomo.png`,fullPage:true}); await browser.close(); process.exit(3);}
await page.locator('[data-qa-mo="1"]').click(); await page.waitForTimeout(4000);
const modal=await page.evaluate(L=>{const lab=eval(L); const x=[...document.querySelectorAll('.q-dialog,[role=dialog]')].pop(); if(!x)return null;
  return {title:lab(x).slice(0,80),buttons:[...x.querySelectorAll('button')].map(lab).filter(Boolean)};}, lab);
console.log('modal:', JSON.stringify(modal));
await page.locator('.q-dialog input').first().fill('MODAL CHANGED'); await page.waitForTimeout(1000);
const cancel=page.locator('.q-dialog button:has-text("Cancel")').first();
const clabel=await cancel.count()?await cancel.evaluate(e=>(e.textContent||'').trim()):'(escape)';
if(await cancel.count()) await cancel.click(); else await page.keyboard.press('Escape');
await page.waitForTimeout(3500);
const after=await page.evaluate(L=>{const lab=eval(L);
  const confirm=[...document.querySelectorAll('.q-dialog')].map(lab).filter(t=>/discard|are you sure|confirm|unsaved|lose/i.test(t));
  const d=[...document.querySelectorAll('input')].find(x=>/description/i.test(x.placeholder||'')&&x.offsetParent);
  return {confirmDialogs:confirm, inlineDesc:d?d.value:null, inlineRowPresent:!!d, modalOpen:!!document.querySelector('.q-dialog input')};}, lab);
console.log('cancel label:', clabel, '| AFTER:', JSON.stringify(after));
const pass=after.confirmDialogs.length===0 && after.inlineDesc==='ZZAUTOTEST c45047';
console.log('C45047 VERDICT:', pass?'PASS - no confirmation, returned to inline row with original value, modal change not carried back':'REVIEW');
fs.writeFileSync(`${OUT}/c45047-result.json`, JSON.stringify({build:'v26.35.9-7f2e4fa',before,after,cancelLabel:clabel,modal,verdict:pass?'PASS':'REVIEW'},null,1));
await page.screenshot({path:`${OUT}/c45047b-final.png`, fullPage:true});
await browser.close();
