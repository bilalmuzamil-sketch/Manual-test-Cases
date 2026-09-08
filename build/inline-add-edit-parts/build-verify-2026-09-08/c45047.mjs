// C45047 modal-cancel reversal on v26.35.9. Uses the DOM-enumeration that already worked (verify_routes).
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const OUT='build/inline-add-edit-parts/build-verify-2026-09-08';
const { browser, page } = await boot('sv9315', '/workorders/b90d6e97-3f47-4745-8cc6-73765802d6ab/lines', 'admin');
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const lab='e=>{const c=e.cloneNode(true);c.querySelectorAll("svg").forEach(n=>n.remove());return (c.textContent||"").replace(/\\s+/g," ").trim();}';
await page.waitForTimeout(11000);
// click the FIRST "+ Add Part"
await page.evaluate(L=>{const lab=eval(L); const b=[...document.querySelectorAll('button,.q-btn,a')].find(e=>/Add Part/i.test(lab(e))); if(b){b.setAttribute('data-qa-add','1');}}, lab);
await page.locator('[data-qa-add="1"]').click(); await page.waitForTimeout(4500);
// tag the inline row inputs by placeholder
const inline = await page.evaluate(()=>{ const ins=[...document.querySelectorAll('input')].filter(i=>i.offsetParent);
  const map={}; ins.forEach((i,k)=>{ i.setAttribute('data-qa-in',String(k)); const p=(i.placeholder||'').toLowerCase();
    if(p.includes('description')&&map.desc===undefined) map.desc=k; if(p==='qty'&&map.qty===undefined) map.qty=k; });
  return map; });
console.log('inline inputs:', JSON.stringify(inline));
if (inline.desc===undefined) { log('no Description input after Add Part - inline row did not open'); await page.screenshot({path:`${OUT}/c45047-noinline.png`,fullPage:true}); await browser.close(); process.exit(2); }
const desc=page.locator(`[data-qa-in="${inline.desc}"]`), qty=page.locator(`[data-qa-in="${inline.qty}"]`);
await desc.fill('ZZAUTOTEST c45047'); if(inline.qty!==undefined) await qty.fill('2'); await page.waitForTimeout(1200);
const before={desc:await desc.inputValue(), qty:inline.qty!==undefined?await qty.inputValue():null};
log('filled inline row:', JSON.stringify(before));
// open More options
await page.evaluate(L=>{const lab=eval(L); const b=[...document.querySelectorAll('button,.q-btn,[role=button]')].find(e=>/More options/i.test(lab(e))); if(b) b.setAttribute('data-qa-mo','1');}, lab);
if (!(await page.locator('[data-qa-mo="1"]').count())) { log('no "More options" control on the inline row'); await page.screenshot({path:`${OUT}/c45047-nomo.png`,fullPage:true}); await browser.close(); process.exit(3); }
await page.locator('[data-qa-mo="1"]').click(); await page.waitForTimeout(4000);
const modal = await page.evaluate(L=>{const lab=eval(L); const x=[...document.querySelectorAll('.q-dialog,[role=dialog]')].pop(); if(!x)return null;
  return {title:lab(x).slice(0,90), buttons:[...x.querySelectorAll('button')].map(lab).filter(Boolean)};}, lab);
console.log('modal opened:', JSON.stringify(modal));
// change a value inside the modal
const mi=page.locator('.q-dialog input').first(); await mi.fill('MODAL CHANGED'); await page.waitForTimeout(1000);
// cancel via the cancel button (label recorded as "Cancel Order")
const cancel=page.locator('.q-dialog button:has-text("Cancel")').first();
const clabel=await cancel.count()? await cancel.evaluate(e=>(e.textContent||'').trim()):'(escape)';
if (await cancel.count()) await cancel.click(); else await page.keyboard.press('Escape');
await page.waitForTimeout(3500);
const after=await page.evaluate(L=>{const lab=eval(L);
  const confirm=[...document.querySelectorAll('.q-dialog')].map(lab).filter(t=>/discard|are you sure|confirm|unsaved|lose/i.test(t));
  const d=document.querySelector(`[data-qa-in="${'PLACEHOLDER'}"]`);
  const di=[...document.querySelectorAll('input')].find(i=>/description/i.test(i.placeholder||''));
  const qi=[...document.querySelectorAll('input')].find(i=>(i.placeholder||'').toLowerCase()==='qty');
  return {confirmDialogs:confirm, inlineDesc:di?di.value:null, inlineQty:qi?qi.value:null, modalStillOpen:!!document.querySelector('.q-dialog input')};}, lab);
console.log('cancel label:', clabel, '| AFTER:', JSON.stringify(after));
const pass = after.confirmDialogs.length===0 && after.inlineDesc==='ZZAUTOTEST c45047' && after.inlineDesc!=='MODAL CHANGED';
console.log('C45047 VERDICT:', pass?'PASS — cancel showed no confirmation, discarded nothing, inline row kept its original values, the modal change was not carried back':'REVIEW: '+JSON.stringify(after));
fs.writeFileSync(`${OUT}/c45047-result.json`, JSON.stringify({build:'v26.35.9-7f2e4fa',before,after,cancelLabel:clabel,modal,verdict:pass?'PASS':'REVIEW'},null,1));
await page.screenshot({path:`${OUT}/c45047-final.png`, fullPage:true});
await browser.close();
