import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
const OUT='/home/user/Manual-test-Cases/build/simple-flow-v2/build-verify-2026-09-09';
const lab='e=>{const c=e.cloneNode(true);c.querySelectorAll("svg").forEach(n=>n.remove());return (c.textContent||"").replace(/\\s+/g," ").trim();}';
const { browser, page } = await boot('sv8683','/parts/orders','admin');
await page.waitForTimeout(8000);
console.log('URL:', page.url());
// left sidebar labels
const nav=await page.evaluate(L=>{const lab=eval(L);return [...new Set([...document.querySelectorAll('aside a,.q-drawer a,nav a,.q-item')].map(lab).filter(t=>t&&t.length<30))];}, lab);
console.log('SIDEBAR:', JSON.stringify(nav));
// page heading + column headers
const heading=await page.evaluate(()=>{const h=[...document.querySelectorAll('h1,h2,.text-h5,.text-h6')].map(e=>e.textContent.trim()).filter(Boolean);return h.slice(0,4);});
console.log('HEADING:', JSON.stringify(heading));
const cols=await page.evaluate(L=>{const lab=eval(L);const th=[...document.querySelectorAll('table thead th, thead th, [role=columnheader]')].map(lab).filter(Boolean);return th;}, lab);
console.log('COLUMNS:', JSON.stringify(cols));
// header buttons
const btns=await page.evaluate(L=>{const lab=eval(L);return [...new Set([...document.querySelectorAll('button,.q-btn,a[role=button]')].map(lab).filter(t=>t&&t.length<24))];}, lab);
console.log('BUTTONS:', JSON.stringify(btns));
// status pills present
const pills=await page.evaluate(L=>{const lab=eval(L);return [...new Set([...document.querySelectorAll('.q-chip,.badge,[class*=status],[class*=chip]')].map(lab).filter(t=>t&&t.length<24))];}, lab);
console.log('PILLS/BADGES:', JSON.stringify(pills));
await page.screenshot({path:OUT+'/po-orders-page-sv8683.png',fullPage:true}).catch(()=>{});
// select-all -> bulk bar
await page.evaluate(()=>{const cb=document.querySelector('table thead input[type=checkbox], thead .q-checkbox, thead input');if(cb)cb.click();});
await page.waitForTimeout(2500);
const bulk=await page.evaluate(L=>{const lab=eval(L);const bar=document.querySelector('[class*=selected],[class*=bulk],.q-banner');const txt=document.body.innerText.match(/\d+\s+Purchase Orders? selected/);return {selText:txt?txt[0]:null, actions:[...new Set([...document.querySelectorAll('button,.q-btn')].map(lab).filter(t=>/receiv|clear|select|assign|vendor/i.test(t)&&t.length<30))]};}, lab);
console.log('BULK BAR:', JSON.stringify(bulk));
await page.screenshot({path:OUT+'/po-bulkbar-sv8683.png',fullPage:true}).catch(()=>{});
await browser.close();
