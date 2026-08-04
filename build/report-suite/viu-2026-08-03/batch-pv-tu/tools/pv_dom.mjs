import { boot } from './boot8582.mjs';
import { APP } from './qa8582.mjs';
const { browser, page } = await boot('admin');
await page.goto(APP+'/reports/parts-velocity',{waitUntil:'domcontentloaded',timeout:60000});await page.waitForTimeout(10000);
// all inputs in the report toolbar region
console.log('INPUTS:', JSON.stringify(await page.$$eval('input',is=>is.map(i=>({tid:i.getAttribute('data-test-id'),ph:i.getAttribute('placeholder'),aria:i.getAttribute('aria-label'),type:i.type,cls:i.className.slice(0,60), inMain: !!i.closest('main'), rect:i.getBoundingClientRect().top+','+i.getBoundingClientRect().left}))),null,1));
console.log('\nSEARCH-ish elements in main:', JSON.stringify(await page.$$eval('main *',es=>es.filter(e=>/search/i.test(e.className+' '+(e.getAttribute('data-test-id')||'')+' '+(e.getAttribute('aria-label')||''))).slice(0,12).map(e=>({tag:e.tagName,cls:String(e.className).slice(0,70),tid:e.getAttribute('data-test-id'),aria:e.getAttribute('aria-label')}))),null,1));
// open the Type select and dump the menu DOM
const ss=await page.$$('.q-select');
for(const s of ss){const t=await s.evaluate(e=>e.innerText.replace(/\n/g,' ')); if(t.includes('Type')){const b=await s.boundingBox(); await page.mouse.click(b.x+b.width-14,b.y+b.height/2); break;}}
await page.waitForTimeout(1500);
console.log('\nTYPE MENU HTML:', (await page.$$eval('.q-menu',ms=>ms.map(m=>m.innerHTML)))[0]?.slice(0,2500));
await page.keyboard.press('Escape'); await page.waitForTimeout(600);
// date popup DOM
const dr=await page.$('span.date-range-label'); const b=await dr.boundingBox(); await page.mouse.click(b.x+b.width/2,b.y+b.height/2); await page.waitForTimeout(1500);
console.log('\nDATE MENU preset DOM:', JSON.stringify(await page.$$eval('.q-menu button, .q-menu .q-btn, .q-menu [role=button], .q-menu li, .q-menu .cursor-pointer',es=>es.slice(0,40).map(e=>({tag:e.tagName,txt:e.innerText.trim().slice(0,26),cls:String(e.className).slice(0,60),tid:e.getAttribute('data-test-id')}))),null,1));
await browser.close();
