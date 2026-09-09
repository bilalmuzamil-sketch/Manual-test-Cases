import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const OUT='/home/user/Manual-test-Cases/build/simple-flow-v2/build-verify-2026-09-09';
const lab='e=>{const c=e.cloneNode(true);c.querySelectorAll("svg").forEach(n=>n.remove());return (c.textContent||"").replace(/\\s+/g," ").trim();}';
const { browser, page } = await boot('sv8683','/workorders?tab=work_orders','admin');
await page.waitForTimeout(7000);
// open a WO with lines
await page.evaluate(L=>{const lab=eval(L);const tb=document.querySelector('table');if(!tb)return;for(const tr of tb.querySelectorAll('tbody tr')){const t=[...tr.cells].map(lab).join('');if(t.trim().length>3){tr.setAttribute('data-o','1');break;}}}, lab);
await page.locator('[data-o="1"] td').nth(1).click().catch(()=>{}); await page.waitForTimeout(9000);
await page.locator('.q-tab:has-text("Lines")').first().click().catch(()=>{}); await page.waitForTimeout(4000);
// 1) part context menu items
await page.evaluate(()=>{const b=[...document.querySelectorAll('button,[role=button]')].find(e=>/Part context menu/i.test(e.getAttribute('aria-label')||''));if(b){b.setAttribute('data-pcm','1');}});
if(await page.locator('[data-pcm="1"]').count()){await page.locator('[data-pcm="1"]').click().catch(()=>{});await page.waitForTimeout(1500);
  console.log('PART CONTEXT MENU:', JSON.stringify(await page.evaluate(()=>[...document.querySelectorAll('.q-menu .q-item, .q-menu [role=menuitem]')].map(e=>(e.textContent||'').replace(/\s+/g,' ').trim()).filter(Boolean))));
  await page.keyboard.press('Escape').catch(()=>{});await page.waitForTimeout(500);
}
// 2) part-row action buttons (Order/Pick/Receive)
console.log('PART ROW ACTIONS:', JSON.stringify(await page.evaluate(()=>[...document.querySelectorAll('button,.q-btn')].map(e=>((e.textContent||'')+'|'+(e.getAttribute('aria-label')||'')).replace(/\s+/g,' ').trim()).filter(t=>/^(Order|Pick|Receive|Complete|Reopen|Start|Stop)\b/i.test(t)).slice(0,20))));
// 3) line-level Complete + the header More menu
console.log('HEADER MORE:', JSON.stringify(await page.evaluate(()=>{const b=[...document.querySelectorAll('button,[role=button]')].find(e=>(e.getAttribute('aria-label')||'')===''&&(e.textContent||'').trim()==='more_vert');return b?'present':'na';})));
// 4) bulk bar — select-all checkbox on the lines table
await page.evaluate(()=>{const cb=document.querySelector('thead .q-checkbox, thead input[type=checkbox], .q-checkbox');if(cb)cb.click();});
await page.waitForTimeout(1500);
console.log('BULK BAR:', JSON.stringify(await page.evaluate(()=>[...document.querySelectorAll('button,.q-btn')].map(e=>(e.textContent||'').replace(/\s+/g,' ').trim()).filter(t=>/complete|invoice|approve|decline|delete|review/i.test(t)).slice(0,20))));
// 5) Create invoice + Complete Work Order top buttons
console.log('TOP ACTIONS:', JSON.stringify(await page.evaluate(()=>[...document.querySelectorAll('button,.q-btn,a')].map(e=>(e.textContent||'').replace(/\s+/g,' ').trim()).filter(t=>/invoice|complete work order|new line/i.test(t)).slice(0,12))));
await page.screenshot({path:OUT+'/wo-actions-sv8683.png'}).catch(()=>{});
await browser.close();
