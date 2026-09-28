// Confirm the new inventory part carries a core and has no stock, then put it on an open line and
// see what the product makes of it: does it have to be ordered, and does a core row appear?
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import { openWo } from '../probes/lib3.mjs';
import { addPart } from './lib-seed.mjs';
import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const WO='281adfa7-5925-4718-936d-91d12cda3873';
const LINE='e1988527-1828-4703-9358-5f2a3fa5dad1';
const PN='bj679453';
const {browser,page}=await bootProdLogin('/parts',{settle:14000,viewport:{width:1680,height:1000},deviceScaleFactor:2});
page.setDefaultTimeout(40000);
const R={};
const box=page.locator('input[type=search], .q-field input').first();
if(await box.count()){ await box.click(); await box.type(PN,{delay:70}); await page.waitForTimeout(6000); }
R.stock=await page.evaluate((pn)=>[...document.querySelectorAll('tr')].filter(t=>t.getBoundingClientRect().height&&new RegExp(pn,'i').test(t.innerText||''))
  .map(t=>(t.innerText||'').replace(/\s+/g,' ').trim().slice(0,130)),PN);
console.log('the part in stock:'); R.stock.forEach(s=>console.log('  ',s));
await openWo(page,WO); await page.waitForTimeout(9000);
const rowsOf=async()=>await page.evaluate(()=>[...document.querySelectorAll('tr')].filter(t=>t.getBoundingClientRect().height)
  .map(t=>{const b=[...t.querySelectorAll('button,.q-btn')].filter(e=>e.getBoundingClientRect().width)
      .map(e=>(e.innerText||'').replace(/\s+/g,' ').trim()).filter(x=>x&&!/drag_indicator/.test(x));
    return (t.innerText||'').replace(/\s+/g,' ').trim().slice(0,92)+'  ->  '+b.join('|');}));
try{ console.log('\nadded:',await addPart(page,LINE,{number:PN,description:'Item-6086',qty:1,source:'inventory'})); }
catch(e){ console.log('\nadding it failed:',e.message.slice(0,260));
  try{ console.log('trying the catalogue suggestion instead:',await addPart(page,LINE,{number:PN,description:'Item-6086',qty:1,source:'catalog'})); }
  catch(e2){ console.log('that failed too:',e2.message.slice(0,200)); } }
await page.reload({waitUntil:'domcontentloaded'}); await page.waitForTimeout(11000);
R.after=(await rowsOf()).filter(r=>new RegExp(PN+'|Item-6086|Core','i').test(r));
console.log('\nhow it sits on the line:'); R.after.forEach(x=>console.log('  ',x));
await page.screenshot({path:`${EV}/s39-added.png`,fullPage:true}).catch(()=>{});
fs.writeFileSync(`${EV}/s39-add-core-part.json`,JSON.stringify(R,null,1));
await browser.close();
