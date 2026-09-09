import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const OUT='/home/user/Manual-test-Cases/build/simple-flow-v2/build-verify-2026-09-09';
const lab='e=>{const c=e.cloneNode(true);c.querySelectorAll("svg").forEach(n=>n.remove());return (c.textContent||"").replace(/\\s+/g," ").trim();}';
const { browser, page } = await boot('sv8683','/workorders?tab=work_orders','admin');
await page.waitForTimeout(7000);
// scan up to 6 WOs for a part row with a "Receive" action
let found=false;
const rows=await page.evaluate(L=>{const lab=eval(L);const tb=document.querySelector('table');return [...tb.querySelectorAll('tbody tr')].slice(0,8).map((tr,i)=>({i,t:[...tr.cells].map(lab).join(' ').slice(0,40)}));}, lab);
for(const r of rows){
  await page.locator('table tbody tr').nth(r.i).locator('td').nth(1).click().catch(()=>{});
  await page.waitForTimeout(6000);
  await page.locator('.q-tab:has-text("Lines")').first().click().catch(()=>{}); await page.waitForTimeout(3000);
  const hasReceive=await page.evaluate(L=>{const lab=eval(L);const b=[...document.querySelectorAll('button,.q-btn')].find(e=>/^Receive/i.test(lab(e)));if(b){b.setAttribute('data-rcv','1');return true;}return false;}, lab);
  if(hasReceive){
    await page.locator('[data-rcv="1"]').first().click().catch(()=>{}); await page.waitForTimeout(3500);
    const modal=await page.evaluate(()=>{const d=document.querySelector('.q-dialog,[role=dialog]');if(!d)return null;return {title:(d.querySelector('h1,h2,h3,.text-h6,.q-toolbar__title')?.textContent||'').trim().slice(0,50),fields:[...d.querySelectorAll('.q-field__label,label')].map(e=>(e.textContent||'').replace(/\s+/g,' ').trim()).filter(Boolean).slice(0,15),buttons:[...d.querySelectorAll('button,.q-btn')].map(e=>(e.textContent||'').replace(/\s+/g,' ').trim()).filter(Boolean).slice(0,10)};});
    console.log('RECEIVE MODAL:', JSON.stringify(modal));
    await page.screenshot({path:OUT+'/receive-modal-sv8683.png'}).catch(()=>{});
    found=true; break;
  }
  await page.goBack().catch(()=>{}); await page.waitForTimeout(3000);
  await page.goto('https://sv8683.qa.shopview.com/workorders?tab=work_orders',{waitUntil:'domcontentloaded'}).catch(()=>{}); await page.waitForTimeout(4000);
}
if(!found) console.log('NO existing part with a Receive action found in first 8 WOs (need to seed an ordered part)');
await browser.close();
