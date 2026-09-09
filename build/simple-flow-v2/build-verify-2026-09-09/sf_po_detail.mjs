import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
const OUT='/home/user/Manual-test-Cases/build/simple-flow-v2/build-verify-2026-09-09';
const lab='e=>{const c=e.cloneNode(true);c.querySelectorAll("svg").forEach(n=>n.remove());return (c.textContent||"").replace(/\\s+/g," ").trim();}';
const { browser, page } = await boot('sv8683','/parts/orders','admin');
await page.waitForTimeout(8000);
// heading
const h=await page.evaluate(()=>[...document.querySelectorAll('h1,h2,h3,.text-h4,.text-h5,.text-h6')].map(e=>e.textContent.trim()).filter(Boolean).slice(0,5));
console.log('HEADINGS:', JSON.stringify(h));
// click first data row body (not the checkbox) to see if it expands inline
const before=await page.evaluate(()=>document.querySelectorAll('table tbody tr').length);
await page.locator('table tbody tr').first().locator('td').nth(2).click().catch(()=>{});
await page.waitForTimeout(2500);
const after=await page.evaluate(()=>document.querySelectorAll('table tbody tr').length);
const expanded=await page.evaluate(L=>{const lab=eval(L);const d=document.querySelector('.q-dialog,[role=dialog]');return {dialog:!!d, dialogTitle:d?(d.querySelector('h1,h2,h3,.text-h6,.q-toolbar__title')?.textContent||'').trim():null, url:location.pathname};}, lab);
console.log('ROW CLICK -> rows',before,'->',after,'detail:',JSON.stringify(expanded));
await page.screenshot({path:OUT+'/po-rowclick-sv8683.png',fullPage:true}).catch(()=>{});
// go back to list and open a Receive modal
await page.goto('https://sv8683.qa.shopview.com/parts/orders',{waitUntil:'domcontentloaded'}); await page.waitForTimeout(6000);
await page.evaluate(L=>{const lab=eval(L);const b=[...document.querySelectorAll('button,.q-btn')].find(e=>/^Receive$/i.test(lab(e)));if(b){b.setAttribute('data-r','1');}}, lab);
await page.locator('[data-r="1"]').first().click().catch(()=>{});
await page.waitForTimeout(4000);
const modal=await page.evaluate(L=>{const lab=eval(L);const d=document.querySelector('.q-dialog,[role=dialog]');if(!d)return null;return {title:(d.querySelector('h1,h2,h3,.text-h6,.q-toolbar__title')?.textContent||'').trim().slice(0,40),fields:[...d.querySelectorAll('.q-field__label,label')].map(lab).filter(Boolean).slice(0,12),buttons:[...d.querySelectorAll('button,.q-btn')].map(lab).filter(Boolean).slice(0,10)};}, lab);
console.log('RECEIVE MODAL:', JSON.stringify(modal));
await page.screenshot({path:OUT+'/po-receive-modal-sv8683.png',fullPage:true}).catch(()=>{});
await browser.close();
