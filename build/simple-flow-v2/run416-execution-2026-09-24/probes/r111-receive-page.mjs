// The receive page reached from Parts is a full page, not the modal - read what it actually asks
// for before trying to drive it.
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const PO='5062602f-6d2d-4f02-88fc-5c7893e4cdf3';   // S2-781, vendor Delete Test
const {browser,page}=await bootProdLogin(`/order/${PO}`,{settle:15000,viewport:{width:1680,height:1000},deviceScaleFactor:2});
page.setDefaultTimeout(30000);
const R={};
R.fields=await page.evaluate(()=>[...document.querySelectorAll('.q-field')].filter(e=>e.getBoundingClientRect().width)
  .map(e=>({label:(e.innerText||'').replace(/\s+/g,' ').trim().slice(0,44),val:(e.querySelector('input')||{}).value||'',
            req:/required|\*/i.test(e.innerText||'')})));
console.log('the page asks for:'); R.fields.forEach(f=>console.log('   ',JSON.stringify(f)));
R.buttons=await page.evaluate(()=>[...document.querySelectorAll('button,.q-btn')].filter(e=>e.getBoundingClientRect().width)
  .map(e=>({t:(e.innerText||'').replace(/\s+/g,' ').trim(),dis:/disabled/.test(e.className||'')})).filter(b=>b.t&&b.t.length<40));
console.log('\nits buttons:',JSON.stringify(R.buttons.map(b=>b.t+(b.dis?' [off]':''))));
R.text=await page.evaluate(()=>{const m=document.querySelector('main,.q-page')||document.body; return (m.innerText||'').replace(/\s+/g,' ').trim().slice(0,700);});
console.log('\nwhat it says:',JSON.stringify(R.text.slice(0,520)));
R.columns=await page.evaluate(()=>{const h=[...document.querySelectorAll('tr')].find(t=>t.getBoundingClientRect().height);
  return h?(h.innerText||'').replace(/\s+/g,' ').trim().slice(0,180):null;});
console.log('\nits columns:',JSON.stringify(R.columns));
R.mentionsSell=/sell/i.test(R.columns||'')||/sell price/i.test(R.text||'');
console.log('does it show a sell price:',R.mentionsSell);
await page.screenshot({path:`${EV}/r111-receive-page.png`,fullPage:true}).catch(()=>{});
fs.writeFileSync(`${EV}/r111-receive-page.json`,JSON.stringify(R,null,1));
await browser.close();
