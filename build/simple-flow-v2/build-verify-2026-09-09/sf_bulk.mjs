import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const OUT='/home/user/Manual-test-Cases/build/simple-flow-v2/build-verify-2026-09-09';
const lab='e=>{const c=e.cloneNode(true);c.querySelectorAll("svg").forEach(n=>n.remove());return (c.textContent||"").replace(/\\s+/g," ").trim();}';
const { browser, page } = await boot('sv8683','/workorders?tab=work_orders','admin');
await page.waitForTimeout(7000);
await page.evaluate(L=>{const lab=eval(L);const tb=document.querySelector('table');for(const tr of tb.querySelectorAll('tbody tr')){const t=[...tr.cells].map(lab).join('');if(t.trim().length>3){tr.setAttribute('data-o','1');break;}}}, lab);
await page.locator('[data-o="1"] td').nth(1).click().catch(()=>{}); await page.waitForTimeout(9000);
await page.locator('.q-tab:has-text("Lines")').first().click().catch(()=>{}); await page.waitForTimeout(4000);
// tick line checkboxes (row-level)
await page.evaluate(()=>{const cbs=[...document.querySelectorAll('.q-checkbox')];cbs.slice(0,3).forEach(cb=>cb.click());});
await page.waitForTimeout(1500);
console.log('BULK BAR (lines selected):', JSON.stringify(await page.evaluate(()=>[...document.querySelectorAll('button,.q-btn,[role=button]')].map(e=>(e.textContent||'').replace(/\s+/g,' ').trim()).filter(t=>t&&t.length<30&&!/^(more_vert|expand|drag|Start|Pick|Complete Work Order|New Line|AI)/.test(t)).slice(0,25))));
// open a "More" in the bar
const moreOpen=await page.evaluate(L=>{const lab=eval(L);const b=[...document.querySelectorAll('button,.q-btn')].find(e=>/^More$/i.test(lab(e)));if(b){b.click();return true;}return false;}, lab);
if(moreOpen){await page.waitForTimeout(1200);console.log('BULK MORE MENU:', JSON.stringify(await page.evaluate(()=>[...document.querySelectorAll('.q-menu .q-item')].map(e=>(e.textContent||'').replace(/\s+/g,' ').trim()).filter(Boolean))));await page.keyboard.press('Escape').catch(()=>{});}
// count/label text of the bar
console.log('BAR TEXT:', JSON.stringify(await page.evaluate(()=>{const bar=document.querySelector('[class*=bulk],[class*=selection],[class*=action-bar]');return bar?bar.innerText.replace(/\s+/g,' ').slice(0,200):'(no distinct bar container)';})));
await page.screenshot({path:OUT+'/bulk-bar-sv8683.png'}).catch(()=>{});
await browser.close();
