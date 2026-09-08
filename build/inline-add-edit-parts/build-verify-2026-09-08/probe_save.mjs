import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const OUT='/home/user/Manual-test-Cases/build/inline-add-edit-parts/build-verify-2026-09-08';
const lab='e=>{const c=e.cloneNode(true);c.querySelectorAll("svg").forEach(n=>n.remove());return (c.textContent||"").replace(/\\s+/g," ").trim();}';
const ROLE='04cfb2b8-3e29-41be-a4ee-5d589bad7974';
const { browser, page } = await boot('sv9315', '/administration/roles-permissions/'+ROLE+'/edit', 'admin');
await page.waitForTimeout(6000);
async function setView(w){return await page.evaluate((w)=>{const els=[...document.querySelectorAll('*')].filter(e=>(e.textContent||'').trim()===w&&e.children.length<=2&&e.offsetParent);const el=els[0];if(!el)return 'nf';let c=el;for(let i=0;i<4&&c;i++){if(c.matches('[role=radio],.q-radio,button,label,.q-toggle,[role=option],[class*=segment]')){c.click();return 'clk';}c=c.parentElement;}el.click();return 'raw';},w);}
await setView('Full View'); await page.waitForTimeout(1000);
await page.evaluate(L=>{const lab=eval(L);const b=[...document.querySelectorAll('button,.q-btn')].find(e=>/^Save$/.test(lab(e)));if(b)b.setAttribute('data-s','1');}, lab);
await page.locator('[data-s="1"]').click().catch(()=>{}); await page.waitForTimeout(3500);
await page.goto('https://sv9315.qa.shopview.com/workorders?tab=estimate',{waitUntil:'domcontentloaded'}); await page.waitForTimeout(7000);
await page.evaluate(L=>{const lab=eval(L);const tb=document.querySelector('table');const head=[...tb.querySelectorAll('thead th')].map(c=>lab(c));const li=head.findIndex(h=>/^Lines/.test(h));for(const tr of tb.querySelectorAll('tbody tr')){const c=[...tr.cells].map(lab);if(c.join('').trim().length<3)continue;if(parseInt(c[li])>0){tr.setAttribute('data-o','1');break;}}}, lab);
await page.locator('[data-o="1"] td').nth(1).click(); await page.waitForTimeout(11000);
await page.locator('.q-tab:has-text("Lines")').first().click().catch(()=>{}); await page.waitForTimeout(5000);
await page.evaluate(L=>{const lab=eval(L);const b=[...document.querySelectorAll('button,.q-btn,a')].find(e=>/Add Part/i.test(lab(e)));if(b)b.setAttribute('data-a','1');}, lab);
await page.locator('[data-a="1"]').first().click().catch(()=>{}); await page.waitForTimeout(3500);
await page.locator('input[aria-label="Description"]').last().type('ZZAUTOTEST Custom Widget',{delay:30}).catch(()=>{});
await page.locator('input[aria-label="Part number"]').last().type('ZZNOCAT'+Date.now().toString().slice(-5),{delay:40}).catch(()=>{});
await page.waitForTimeout(800);
const qty=page.locator('input[aria-label="Qty"]').last(); await qty.click().catch(()=>{}); await qty.type('1',{delay:40}).catch(()=>{});
await page.waitForTimeout(800);
// click Save on the inline row
await page.evaluate(L=>{const lab=eval(L);const bs=[...document.querySelectorAll('button,.q-btn')].filter(e=>/^Save$/.test(lab(e))&&e.offsetParent);const el=bs[bs.length-1];if(el)el.setAttribute('data-save','1');}, lab);
await page.locator('[data-save="1"]').click().catch(()=>{});
await page.waitForTimeout(4000);
const dlg=await page.evaluate(()=>{const d=document.querySelector('.q-dialog,[role=dialog]');if(!d)return null;const h=d.querySelector('h1,h2,h3,.text-h6,.q-toolbar__title,.q-card__section');return {title:h?(h.textContent||'').trim().slice(0,60):'',hasPartRequest:/Part Request/i.test(d.innerText),hasSellPrice:/Sell Price/i.test(d.innerText),hasCancelOrder:/Cancel Order/i.test(d.innerText),snippet:d.innerText.replace(/\s+/g,' ').slice(0,200)};});
console.log('AFTER SAVE dialog:', JSON.stringify(dlg,null,1));
await page.screenshot({path:OUT+'/after-save-v26.35.9.png'}).catch(()=>{});
// clean up: if a modal opened, cancel it; if the part saved, remove it to keep WO clean
await page.evaluate(()=>{const c=[...document.querySelectorAll('button,.q-btn')].find(e=>/Cancel Order|Cancel|Discard/i.test(e.textContent||''));if(c)c.click();});
await page.waitForTimeout(1500);
// restore Tech view
await page.goto('https://sv9315.qa.shopview.com/administration/roles-permissions/'+ROLE+'/edit',{waitUntil:'domcontentloaded'}); await page.waitForTimeout(6000);
await setView('Tech view'); await page.waitForTimeout(1000);
await page.evaluate(L=>{const lab=eval(L);const b=[...document.querySelectorAll('button,.q-btn')].find(e=>/^Save$/.test(lab(e)));if(b)b.setAttribute('data-s2','1');}, lab);
await page.locator('[data-s2="1"]').click().catch(()=>{}); await page.waitForTimeout(3500);
console.log('RESTORED Tech view');
await browser.close();
