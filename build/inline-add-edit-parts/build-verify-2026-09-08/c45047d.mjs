// C45047 - inline-row fields are keyed by aria-label, not placeholder (diagnosed). Target accordingly.
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const OUT='build/inline-add-edit-parts/build-verify-2026-09-08';
const { browser, page } = await boot('sv9315', '/', 'admin');
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const lab='e=>{const c=e.cloneNode(true);c.querySelectorAll("svg").forEach(n=>n.remove());return (c.textContent||"").replace(/\\s+/g," ").trim();}';
const findByAria=`(want)=>{const f=[...document.querySelectorAll('input,textarea')].find(i=>i.offsetParent && new RegExp(want,'i').test(i.getAttribute('aria-label')||i.placeholder||'')); if(f){f.setAttribute('data-qa-f','1');return true;} return false;}`;
await page.waitForTimeout(8000);
await page.locator('a:has-text("Work Orders")').first().click().catch(()=>{}); await page.waitForTimeout(8000);
await page.locator('.q-tab:has-text("Estimates"),button:has-text("Estimates")').first().click().catch(()=>{}); await page.waitForTimeout(7000);
await page.evaluate(L=>{const lab=eval(L); const tb=document.querySelector('table'); const head=[...tb.querySelectorAll('thead th')].map(c=>lab(c)); const li=head.findIndex(h=>/^Lines/.test(h));
  for(const tr of tb.querySelectorAll('tbody tr')){const c=[...tr.cells].map(lab); if(c.join('').trim().length<3)continue; if(parseInt(c[li])>0){tr.setAttribute('data-qa-open','1');break;}}}, lab);
await page.locator('[data-qa-open="1"] td').nth(1).click(); await page.waitForTimeout(11000);
await page.locator('.q-tab:has-text("Lines")').first().click().catch(()=>{}); await page.waitForTimeout(5000);
await page.evaluate(L=>{const lab=eval(L); const b=[...document.querySelectorAll('button,.q-btn,a')].find(e=>/Add Part/i.test(lab(e))); if(b)b.setAttribute('data-qa-add1','1');}, lab);
await page.locator('[data-qa-add1="1"]').click();
let ok=false;
for(let t=0;t<8;t++){ await page.waitForTimeout(2000); ok=await page.evaluate(findByAria,'^description'); if(ok)break; }
if(!ok){log('no Description field after 16s'); await page.screenshot({path:`${OUT}/c45047d-nodesc.png`,fullPage:true}); await browser.close(); process.exit(2);}
log('inline Description field found');
await page.locator('[data-qa-f="1"]').fill('ZZAUTOTEST c45047'); await page.evaluate(()=>document.querySelector('[data-qa-f="1"]').removeAttribute('data-qa-f'));
if(await page.evaluate(findByAria,'^qty|quantity')) { await page.locator('[data-qa-f="1"]').fill('2'); await page.evaluate(()=>document.querySelector('[data-qa-f="1"]').removeAttribute('data-qa-f')); }
await page.waitForTimeout(1000);
const before=await page.evaluate(()=>{const d=[...document.querySelectorAll('input')].find(i=>/^description/i.test(i.getAttribute('aria-label')||i.placeholder||'')); return d?d.value:null;});
log('inline filled, Description =', JSON.stringify(before));
// More options
await page.evaluate(L=>{const lab=eval(L); const b=[...document.querySelectorAll('button,.q-btn,[role=button]')].find(e=>/More options/i.test(lab(e))); if(b)b.setAttribute('data-qa-mo','1');}, lab);
if(!(await page.locator('[data-qa-mo="1"]').count())){log('no More options'); await page.screenshot({path:`${OUT}/c45047d-nomo.png`,fullPage:true}); await browser.close(); process.exit(3);}
await page.locator('[data-qa-mo="1"]').click(); await page.waitForTimeout(4500);
const modal=await page.evaluate(L=>{const lab=eval(L); const x=[...document.querySelectorAll('.q-dialog,[role=dialog]')].pop(); if(!x)return null;
  return {title:lab(x).slice(0,90),buttons:[...x.querySelectorAll('button')].map(lab).filter(Boolean)};}, lab);
console.log('modal:', JSON.stringify(modal));
if(!modal){log('modal did not open'); await page.screenshot({path:`${OUT}/c45047d-nomodal.png`,fullPage:true}); await browser.close(); process.exit(4);}
// change a value in the modal (its Description)
await page.evaluate(()=>{const x=[...document.querySelectorAll('.q-dialog')].pop(); const d=[...x.querySelectorAll('input')].find(i=>/description/i.test(i.getAttribute('aria-label')||i.placeholder||''))||x.querySelector('input'); if(d)d.setAttribute('data-qa-md','1');});
await page.locator('[data-qa-md="1"]').fill('MODAL CHANGED'); await page.waitForTimeout(1000);
const cancel=page.locator('.q-dialog button:has-text("Cancel")').first();
const clabel=await cancel.count()?await cancel.evaluate(e=>(e.textContent||'').trim()):'(escape)';
if(await cancel.count()) await cancel.click(); else await page.keyboard.press('Escape');
await page.waitForTimeout(3500);
const after=await page.evaluate(L=>{const lab=eval(L);
  const confirm=[...document.querySelectorAll('.q-dialog')].map(lab).filter(t=>/discard|are you sure|confirm|unsaved|lose/i.test(t));
  const d=[...document.querySelectorAll('input')].find(i=>/^description/i.test(i.getAttribute('aria-label')||i.placeholder||''));
  return {confirmDialogs:confirm, inlineDesc:d?d.value:null, inlineRowPresent:!!d, modalOpen:!!document.querySelector('.q-dialog')};}, lab);
console.log('cancel label:', clabel, '| AFTER:', JSON.stringify(after));
const pass=after.confirmDialogs.length===0 && after.inlineRowPresent && after.inlineDesc==='ZZAUTOTEST c45047';
console.log('C45047 VERDICT:', pass?'PASS - cancel showed no confirmation, returned to the inline row with its original value, the modal change was not carried back':'REVIEW - '+JSON.stringify(after));
fs.writeFileSync(`${OUT}/c45047-result.json`, JSON.stringify({build:'v26.35.9-7f2e4fa',before,modal,after,cancelLabel:clabel,verdict:pass?'PASS':'REVIEW'},null,1));
await page.screenshot({path:`${OUT}/c45047d-final.png`, fullPage:true});
await browser.close();
