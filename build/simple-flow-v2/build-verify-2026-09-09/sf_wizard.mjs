import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const OUT='/home/user/Manual-test-Cases/build/simple-flow-v2/build-verify-2026-09-09';
const lab='e=>{const c=e.cloneNode(true);c.querySelectorAll("svg").forEach(n=>n.remove());return (c.textContent||"").replace(/\\s+/g," ").trim();}';
const { browser, page } = await boot('sv8683','/workorders?tab=work_orders','admin');
await page.waitForTimeout(7000);
await page.evaluate(L=>{const lab=eval(L);const tb=document.querySelector('table');for(const tr of tb.querySelectorAll('tbody tr')){const t=[...tr.cells].map(lab).join('');if(t.trim().length>3){tr.setAttribute('data-o','1');break;}}}, lab);
await page.locator('[data-o="1"] td').nth(1).click().catch(()=>{}); await page.waitForTimeout(9000);
await page.locator('.q-tab:has-text("Lines")').first().click().catch(()=>{}); await page.waitForTimeout(3000);
// open WO header more_vert -> Create invoice
await page.evaluate(()=>{const b=[...document.querySelectorAll('button,[role=button]')].find(e=>(e.textContent||'').trim()==='more_vert'&&!(e.getAttribute('aria-label')||''));if(b)b.setAttribute('data-hm','1');});
await page.locator('[data-hm="1"]').first().click().catch(()=>{}); await page.waitForTimeout(1200);
await page.evaluate(()=>{const it=[...document.querySelectorAll('.q-menu .q-item')].find(e=>/Create invoice/i.test(e.textContent||''));if(it)it.click();});
await page.waitForTimeout(4000);
// capture whatever dialog opened (wizard or invoice confirm)
const dlg=await page.evaluate(()=>{const d=document.querySelector('.q-dialog,[role=dialog]');if(!d)return null;return {title:(d.querySelector('h1,h2,h3,.text-h6,.q-toolbar__title,.q-card__section')?.textContent||'').trim().slice(0,60),pills:[...d.querySelectorAll('.q-chip,.q-tab,[class*=step],[class*=pill]')].map(e=>(e.textContent||'').replace(/\s+/g,' ').trim()).filter(Boolean).slice(0,10),buttons:[...d.querySelectorAll('button,.q-btn')].map(e=>(e.textContent||'').replace(/\s+/g,' ').trim()).filter(Boolean).slice(0,12),snippet:d.innerText.replace(/\s+/g,' ').slice(0,180)};});
console.log('AFTER CREATE INVOICE dialog:', JSON.stringify(dlg));
await page.screenshot({path:OUT+'/completion-wizard-sv8683.png'}).catch(()=>{});
// close without completing
await page.locator('.q-dialog button:has-text("close"), .q-dialog [aria-label=close], .q-dialog button:has-text("Cancel")').first().click().catch(()=>{});
await page.keyboard.press('Escape').catch(()=>{});
await browser.close();
