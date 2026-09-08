// C45047 - follow the PROVEN nav path (verify_routes), then drive the modal-cancel.
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const OUT='build/inline-add-edit-parts/build-verify-2026-09-08';
const { browser, page } = await boot('sv9315', '/', 'admin');
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const lab='e=>{const c=e.cloneNode(true);c.querySelectorAll("svg").forEach(n=>n.remove());return (c.textContent||"").replace(/\\s+/g," ").trim();}';
await page.waitForTimeout(8000);
await page.locator('a:has-text("Work Orders"),button:has-text("Work Orders")').first().click().catch(()=>{});
await page.waitForTimeout(8000);
await page.locator('.q-tab:has-text("Estimates"),[role=tab]:has-text("Estimates"),button:has-text("Estimates")').first().click().catch(()=>{});
await page.waitForTimeout(7000);
// open the first estimate with lines>0
const pick = await page.evaluate(L=>{const lab=eval(L); const tb=document.querySelector('table');
  const head=[...tb.querySelectorAll('thead th')].map(c=>lab(c).replace('arrow_drop_up','')); const li=head.findIndex(h=>/^Lines/.test(h));
  const rs=[...tb.querySelectorAll('tbody tr')]; for(let i=0;i<rs.length;i++){const c=[...rs[i].cells].map(lab); if(c.join('').trim().length<3)continue;
    if(parseInt(c[li])>0){rs[i].setAttribute('data-qa-open','1'); return {num:c.find(x=>/^S9315|^S2-/.test(x)),lines:c[li]};}} return null;}, lab);
log('opening estimate:', JSON.stringify(pick));
await page.locator('[data-qa-open="1"] td').nth(1).click(); await page.waitForTimeout(11000);
log('url:', page.url());
// Lines tab, then + Add Part
await page.locator('.q-tab:has-text("Lines"),[role=tab]:has-text("Lines")').first().click().catch(()=>{}); await page.waitForTimeout(5000);
const n=await page.evaluate(L=>{const lab=eval(L); const bs=[...document.querySelectorAll('button,.q-btn,a')].filter(e=>/Add Part/i.test(lab(e))); bs.forEach((b,i)=>b.setAttribute('data-qa-add',String(i))); return bs.length;}, lab);
log('Add Part buttons:', n);
let opened=false;
for(let i=0;i<n && !opened;i++){ await page.locator(`[data-qa-add="${i}"]`).click().catch(()=>{}); await page.waitForTimeout(3500);
  opened=await page.evaluate(()=>!![...document.querySelectorAll('input')].find(x=>/description/i.test(x.placeholder||'')&&x.offsetParent)); }
if(!opened){log('inline row did not open'); await page.screenshot({path:`${OUT}/c45047c-fail.png`,fullPage:true}); await browser.close(); process.exit(2);}
await page.evaluate(()=>{const d=[...document.querySelectorAll('input')].find(x=>/description/i.test(x.placeholder||'')&&x.offsetParent); d.setAttribute('data-qa-desc','1');
  const q=[...document.querySelectorAll('input')].find(x=>(x.placeholder||'').toLowerCase()==='qty'&&x.offsetParent); if(q)q.setAttribute('data-qa-qty','1');});
await page.locator('[data-qa-desc="1"]').fill('ZZAUTOTEST c45047');
if(await page.locator('[data-qa-qty="1"]').count()) await page.locator('[data-qa-qty="1"]').fill('2');
await page.waitForTimeout(1000);
const before={desc:await page.locator('[data-qa-desc="1"]').inputValue()};
log('inline filled:', JSON.stringify(before));
await page.evaluate(L=>{const lab=eval(L); const b=[...document.querySelectorAll('button,.q-btn,[role=button]')].find(e=>/More options/i.test(lab(e))); if(b)b.setAttribute('data-qa-mo','1');}, lab);
if(!(await page.locator('[data-qa-mo="1"]').count())){log('no More options control'); await page.screenshot({path:`${OUT}/c45047c-nomo.png`,fullPage:true}); await browser.close(); process.exit(3);}
await page.locator('[data-qa-mo="1"]').click(); await page.waitForTimeout(4500);
const modal=await page.evaluate(L=>{const lab=eval(L); const x=[...document.querySelectorAll('.q-dialog,[role=dialog]')].pop(); if(!x)return null;
  return {title:lab(x).slice(0,90),buttons:[...x.querySelectorAll('button')].map(lab).filter(Boolean),firstInput:(x.querySelector('input')||{}).value};}, lab);
console.log('modal:', JSON.stringify(modal));
if(!modal){log('modal did not open'); await browser.close(); process.exit(4);}
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
const pass=after.confirmDialogs.length===0 && after.inlineRowPresent && after.inlineDesc==='ZZAUTOTEST c45047';
console.log('C45047 VERDICT:', pass?'PASS':'REVIEW');
fs.writeFileSync(`${OUT}/c45047-result.json`, JSON.stringify({build:'v26.35.9-7f2e4fa',pick,before,modal,after,cancelLabel:clabel,verdict:pass?'PASS':'REVIEW'},null,1));
await page.screenshot({path:`${OUT}/c45047c-final.png`, fullPage:true});
await browser.close();
