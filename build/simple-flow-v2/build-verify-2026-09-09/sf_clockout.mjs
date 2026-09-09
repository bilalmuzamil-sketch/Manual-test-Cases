import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const OUT='/home/user/Manual-test-Cases/build/simple-flow-v2/build-verify-2026-09-09';
const lab='e=>{const c=e.cloneNode(true);c.querySelectorAll("svg").forEach(n=>n.remove());return (c.textContent||"").replace(/\\s+/g," ").trim();}';
const { browser, page } = await boot('sv8683','/workorders?tab=work_orders','admin');
await page.waitForTimeout(7000);
await page.evaluate(L=>{const lab=eval(L);const tb=document.querySelector('table');for(const tr of tb.querySelectorAll('tbody tr')){const t=[...tr.cells].map(lab).join('');if(t.trim().length>3){tr.setAttribute('data-o','1');break;}}}, lab);
await page.locator('[data-o="1"] td').nth(1).click().catch(()=>{}); await page.waitForTimeout(9000);
await page.locator('.q-tab:has-text("Lines")').first().click().catch(()=>{}); await page.waitForTimeout(4000);
// Top-of-WO actions: header More menu + Create invoice / Complete Work Order
await page.evaluate(()=>{const b=[...document.querySelectorAll('button,[role=button]')].find(e=>(e.textContent||'').trim()==='more_vert'&&!(e.getAttribute('aria-label')||''));if(b)b.setAttribute('data-hm','1');});
if(await page.locator('[data-hm="1"]').count()){await page.locator('[data-hm="1"]').first().click().catch(()=>{});await page.waitForTimeout(1200);
  console.log('WO HEADER MORE MENU:', JSON.stringify(await page.evaluate(()=>[...document.querySelectorAll('.q-menu .q-item')].map(e=>(e.textContent||'').replace(/\s+/g,' ').trim()).filter(Boolean))));
  await page.keyboard.press('Escape').catch(()=>{});await page.waitForTimeout(500);
}
// Start a timer then Stop to open clock-out modal
await page.locator('button:has-text("Start"),.q-btn:has-text("Start")').first().click().catch(()=>{});
await page.waitForTimeout(3000);
const stopBtn=page.locator('button:has-text("Stop"),.q-btn:has-text("Stop")').first();
if(await stopBtn.count()){await stopBtn.click().catch(()=>{});await page.waitForTimeout(3000);
  const modal=await page.evaluate(()=>{const d=document.querySelector('.q-dialog,[role=dialog]');if(!d)return null;return {title:(d.querySelector('h1,h2,h3,.text-h6,.q-card__section')?.textContent||'').trim().slice(0,50),buttons:[...d.querySelectorAll('button,.q-btn')].map(b=>(b.textContent||'').replace(/\s+/g,' ').trim()).filter(Boolean),hasTickBox:/line completed/i.test(d.innerText),hasTechStory:/tech story|story/i.test(d.innerText)};});
  console.log('CLOCK-OUT MODAL:', JSON.stringify(modal));
  await page.screenshot({path:OUT+'/clockout-modal-sv8683.png'}).catch(()=>{});
  // cancel out to not complete
  await page.locator('.q-dialog button:has-text("Clock out")').first().click().catch(()=>{});
}
await browser.close();
