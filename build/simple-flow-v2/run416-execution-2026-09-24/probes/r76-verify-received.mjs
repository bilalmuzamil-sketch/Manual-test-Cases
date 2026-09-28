// Before calling the vendor-lock a fault, prove the receive actually landed. If nothing was received,
// the vendor SHOULD still be changeable and there is no finding at all.
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import { openWo } from './lib3.mjs';
import fs from 'fs';
const APP='https://app.shopview.com';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const PO='806dcdca-eb70-4634-acb5-7bcb3ecdd7b8';
const WO='281adfa7-5925-4718-936d-91d12cda3873';
const {browser,page}=await bootProdLogin('/workorders',{settle:13000,viewport:{width:1680,height:1000},deviceScaleFactor:2});
page.setDefaultTimeout(30000);
const R={};
await page.goto(`${APP}/order/${PO}`,{waitUntil:'domcontentloaded'}); await page.waitForTimeout(9000);
R.po=await page.evaluate(()=>({text:document.body.innerText.replace(/\s+/g,' ').slice(0,400),
  rows:[...document.querySelectorAll('tbody tr')].filter(t=>t.getBoundingClientRect().height)
    .map(t=>(t.innerText||'').replace(/\s+/g,' ').trim().slice(0,110)),
  columns:[...document.querySelectorAll('th')].map(e=>(e.innerText||'').replace(/\s+/g,' ').trim()).filter(Boolean)}));
console.log('the purchase order page:');
console.log('  columns:',JSON.stringify(R.po.columns));
R.po.rows.forEach(r=>console.log('   ',r));
await page.screenshot({path:`${EV}/r76-po.png`,fullPage:true}).catch(()=>{});
// the work order's own view of those parts
await openWo(page,WO); await page.waitForTimeout(9000);
R.parts=await page.evaluate(()=>[...document.querySelectorAll('tr')].filter(t=>/drag_indicator|Core/i.test(t.innerText||''))
  .map(t=>(t.innerText||'').replace(/\s+/g,' ').trim().slice(0,110)));
console.log('\nthe work order now shows:'); R.parts.forEach(p=>console.log('   ',p));
R.stillAwaiting=R.parts.filter(p=>/Awaiting/.test(p)).length;
R.noAction=R.parts.filter(p=>/drag_indicator/.test(p)&&!/Awaiting|Auth To Order|In Stock/.test(p)).length;
console.log('\nparts still awaiting receipt:',R.stillAwaiting,'| parts with nothing left to do:',R.noAction);
// the purchase orders list line for this one
await page.goto(`${APP}/parts/orders`,{waitUntil:'domcontentloaded'}); await page.waitForTimeout(9000);
R.listRow=await page.evaluate(()=>{const t=[...document.querySelectorAll('tbody tr')].find(x=>/S2-917/.test(x.innerText||''));
  return t?(t.innerText||'').replace(/\s+/g,' ').trim().slice(0,130):null;});
console.log('\nits row on the purchase orders list:',JSON.stringify(R.listRow));
fs.writeFileSync(`${EV}/r76-verify.json`,JSON.stringify(R,null,1));
await browser.close();
