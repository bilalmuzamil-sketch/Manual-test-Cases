import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const OUT='/home/user/Manual-test-Cases/build/inline-add-edit-parts/build-verify-2026-09-08';
const lab='e=>{const c=e.cloneNode(true);c.querySelectorAll("svg").forEach(n=>n.remove());return (c.textContent||"").replace(/\\s+/g," ").trim();}';
const { browser, page } = await boot('sv9315', '/', 'admin');
await page.waitForTimeout(8000);
await page.locator('a:has-text("Work Orders")').first().click().catch(()=>{}); await page.waitForTimeout(8000);
await page.locator('.q-tab:has-text("Estimates"),button:has-text("Estimates")').first().click().catch(()=>{}); await page.waitForTimeout(7000);
// open a WO that already HAS parts (Lines>0) so a Part context menu exists
await page.evaluate(L=>{const lab=eval(L); const tb=document.querySelector('table'); const head=[...tb.querySelectorAll('thead th')].map(c=>lab(c)); const li=head.findIndex(h=>/^Lines/.test(h));
  for(const tr of tb.querySelectorAll('tbody tr')){const c=[...tr.cells].map(lab); if(c.join('').trim().length<3)continue; if(parseInt(c[li])>0){tr.setAttribute('data-qa-open','1');break;}}}, lab);
await page.locator('[data-qa-open="1"] td').nth(1).click(); await page.waitForTimeout(11000);
await page.locator('.q-tab:has-text("Lines")').first().click().catch(()=>{}); await page.waitForTimeout(5000);
// click the Part context menu (existing part row)
const ok = await page.evaluate(()=>{
  const el=[...document.querySelectorAll('button,[role=button],.q-btn')].find(e=>/Part context menu/i.test(e.getAttribute('aria-label')||''));
  if(el){el.setAttribute('data-qa-ctx','1');return true;} return false;
});
console.log('found Part context menu:', ok);
if(ok){ await page.locator('[data-qa-ctx="1"]').click().catch(()=>{}); await page.waitForTimeout(2500);
  const menu = await page.evaluate(()=>[...document.querySelectorAll('.q-menu .q-item,.q-menu [role=menuitem],.q-menu .q-item__label')].map(e=>(e.textContent||'').replace(/\s+/g,' ').trim()).filter(Boolean));
  console.log('PART CONTEXT MENU:', JSON.stringify([...new Set(menu)]));
  await page.screenshot({path:OUT+'/part-context-menu-v26.35.9.png'}).catch(()=>{});
  // click Edit part request / edit to open modal
  const openedModal = await page.evaluate(()=>{
    const it=[...document.querySelectorAll('.q-menu .q-item')].find(e=>/edit part request|part request/i.test(e.textContent||''));
    if(it){it.click();return it.textContent.trim();} return null;
  });
  console.log('clicked menu item:', openedModal);
  await page.waitForTimeout(3000);
  const modalTitle = await page.evaluate(()=>{
    const d=document.querySelector('.q-dialog, [role=dialog]'); if(!d)return null;
    const h=d.querySelector('h1,h2,h3,.text-h6,.q-card__section'); return h?(h.textContent||'').trim().slice(0,60):d.textContent.trim().slice(0,60);
  });
  console.log('MODAL TITLE:', JSON.stringify(modalTitle));
  const modalBody = await page.evaluate(()=>{const d=document.querySelector('.q-dialog,[role=dialog]');return d?d.innerText.slice(0,400):'';});
  console.log('MODAL has New/Edit Part Request:', /Part Request/i.test(modalBody), '| Sell Price:', /Sell Price/i.test(modalBody), '| Cancel Order:', /Cancel Order/i.test(modalBody));
}
await browser.close();
