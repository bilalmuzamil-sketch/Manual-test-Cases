// C45047 - dump_row's PROVEN sequence verbatim (it reliably reaches the open inline row), then the
// modal-cancel. Description is the input whose closest .q-field label is "Description" (aria idx 9).
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const OUT='build/inline-add-edit-parts/build-verify-2026-09-08';
const { browser, page } = await boot('sv9315', '/', 'admin');
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const lab='e=>{const c=e.cloneNode(true);c.querySelectorAll("svg").forEach(n=>n.remove());return (c.textContent||"").replace(/\\s+/g," ").trim();}';
const tagByFieldLabel=`(want)=>{const f=[...document.querySelectorAll('input,textarea')].find(i=>{ if(!i.offsetParent) return false; const fld=i.closest('.q-field'); const t=(fld&&fld.querySelector('.q-field__label')?fld.querySelector('.q-field__label').textContent:i.getAttribute('aria-label')||'').trim(); return new RegExp(want,'i').test(t);}); if(f){f.setAttribute('data-qa-f','1');return true;} return false;}`;
await page.waitForTimeout(8000);
await page.locator('a:has-text("Work Orders")').first().click().catch(()=>{}); await page.waitForTimeout(8000);
await page.locator('.q-tab:has-text("Estimates"),button:has-text("Estimates")').first().click().catch(()=>{}); await page.waitForTimeout(7000);
await page.evaluate(L=>{const lab=eval(L); const tb=document.querySelector('table'); const head=[...tb.querySelectorAll('thead th')].map(c=>lab(c)); const li=head.findIndex(h=>/^Lines/.test(h));
  for(const tr of tb.querySelectorAll('tbody tr')){const c=[...tr.cells].map(lab); if(c.join('').trim().length<3)continue; if(parseInt(c[li])>0){tr.setAttribute('data-qa-open','1');break;}}}, lab);
await page.locator('[data-qa-open="1"] td').nth(1).click(); await page.waitForTimeout(11000);
await page.locator('.q-tab:has-text("Lines")').first().click().catch(()=>{}); await page.waitForTimeout(5000);
// if a Description field is already open (leftover), use it; else click Add Part once
let has=await page.evaluate(tagByFieldLabel,'^Description$');
if(!has){ await page.evaluate(L=>{const lab=eval(L); const b=[...document.querySelectorAll('button,.q-btn,a')].find(e=>/Add Part/i.test(lab(e))); if(b)b.setAttribute('data-qa-add1','1');}, lab);
  await page.locator('[data-qa-add1="1"]').click(); await page.waitForTimeout(4500);
  has=await page.evaluate(tagByFieldLabel,'^Description$'); }
if(!has){log('no Description field'); await page.screenshot({path:`${OUT}/c45047e-nodesc.png`,fullPage:true}); await browser.close(); process.exit(2);}
await page.locator('[data-qa-f="1"]').fill('ZZAUTOTEST c45047'); await page.evaluate(()=>document.querySelector('[data-qa-f="1"]')?.removeAttribute('data-qa-f'));
await page.waitForTimeout(800);
const before=await page.evaluate(()=>{const d=[...document.querySelectorAll('input')].find(i=>{const f=i.closest('.q-field'); return f&&/^Description$/i.test((f.querySelector('.q-field__label')?.textContent||'').trim());}); return d?d.value:null;});
log('Description filled =', JSON.stringify(before));
await page.evaluate(L=>{const lab=eval(L); const b=[...document.querySelectorAll('button,.q-btn,[role=button]')].find(e=>/More options/i.test(lab(e))); if(b)b.setAttribute('data-qa-mo','1');}, lab);
if(!(await page.locator('[data-qa-mo="1"]').count())){log('no More options'); await page.screenshot({path:`${OUT}/c45047e-nomo.png`,fullPage:true}); await browser.close(); process.exit(3);}
await page.locator('[data-qa-mo="1"]').click(); await page.waitForTimeout(4500);
const modal=await page.evaluate(L=>{const lab=eval(L); const x=[...document.querySelectorAll('.q-dialog,[role=dialog]')].pop(); if(!x)return null;
  return {title:lab(x).slice(0,90),buttons:[...x.querySelectorAll('button')].map(lab).filter(Boolean)};}, lab);
console.log('modal:', JSON.stringify(modal));
if(!modal){log('modal did not open'); await browser.close(); process.exit(4);}
await page.evaluate(()=>{const x=[...document.querySelectorAll('.q-dialog')].pop(); const d=[...x.querySelectorAll('input')].find(i=>{const f=i.closest('.q-field'); return f&&/description/i.test((f.querySelector('.q-field__label')?.textContent||''));})||x.querySelector('input'); if(d)d.setAttribute('data-qa-md','1');});
await page.locator('[data-qa-md="1"]').fill('MODAL CHANGED'); await page.waitForTimeout(1000);
const cancel=page.locator('.q-dialog button:has-text("Cancel")').first();
const clabel=await cancel.count()?await cancel.evaluate(e=>(e.textContent||'').trim()):'(escape)';
if(await cancel.count()) await cancel.click(); else await page.keyboard.press('Escape');
await page.waitForTimeout(3500);
const after=await page.evaluate(L=>{const lab=eval(L);
  const confirm=[...document.querySelectorAll('.q-dialog')].map(lab).filter(t=>/discard|are you sure|confirm|unsaved|lose/i.test(t));
  const d=[...document.querySelectorAll('input')].find(i=>{const f=i.closest('.q-field'); return f&&/^Description$/i.test((f.querySelector('.q-field__label')?.textContent||'').trim());});
  return {confirmDialogs:confirm, inlineDesc:d?d.value:null, inlineRowPresent:!!d, modalOpen:!!document.querySelector('.q-dialog')};}, lab);
console.log('cancel label:', clabel, '| AFTER:', JSON.stringify(after));
const pass=after.confirmDialogs.length===0 && after.inlineRowPresent && after.inlineDesc==='ZZAUTOTEST c45047' && !after.modalOpen;
console.log('C45047 VERDICT:', pass?'PASS - cancel: no confirmation, returned to the inline row with its original value, modal change not carried back':'REVIEW - '+JSON.stringify(after));
fs.writeFileSync(`${OUT}/c45047-result.json`, JSON.stringify({build:'v26.35.9-7f2e4fa',before,modal,after,cancelLabel:clabel,verdict:pass?'PASS':'REVIEW'},null,1));
await page.screenshot({path:`${OUT}/c45047e-final.png`, fullPage:true});
await browser.close();
