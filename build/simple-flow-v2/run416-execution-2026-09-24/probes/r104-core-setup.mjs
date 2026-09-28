// C53489 needs a part that CARRIES A CORE and is ordered from a vendor. The copies of A158 taken
// from stock show a core row; the copy that was ordered showed none, before or after receiving.
// Before concluding anything, look at where a core charge is actually configured on a part.
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const {browser,page}=await bootProdLogin('/parts',{settle:14000,viewport:{width:1680,height:1000},deviceScaleFactor:2});
page.setDefaultTimeout(35000);
const R={};
console.log('the parts page:',page.url().replace('https://app.shopview.com',''));
const tabs=await page.evaluate(()=>[...document.querySelectorAll('.q-tab,[role=tab]')].filter(e=>e.getBoundingClientRect().width)
  .map(e=>(e.innerText||'').replace(/\s+/g,' ').trim()).filter(Boolean));
console.log('its tabs:',JSON.stringify(tabs));
// search for the part
const box=page.locator('input[type=search], .q-field input').first();
if(await box.count()){ await box.click(); await box.type('1237944',{delay:70}); await page.waitForTimeout(6000); }
R.hits=await page.evaluate(()=>[...document.querySelectorAll('tr')].filter(t=>t.getBoundingClientRect().height)
  .map(t=>(t.innerText||'').replace(/\s+/g,' ').trim().slice(0,120)).slice(0,10));
console.log('\nwhat the search finds:'); R.hits.forEach(h=>console.log('  ',h));
// open the first real row
const opened=await page.evaluate(()=>{const t=[...document.querySelectorAll('tr')].filter(x=>x.getBoundingClientRect().height&&/1237944/.test(x.innerText||''))[0];
  if(!t)return 'no row'; t.click(); return 'opened '+(t.innerText||'').replace(/\s+/g,' ').trim().slice(0,60);});
console.log('\n',opened); await page.waitForTimeout(8000);
R.detail=await page.evaluate(()=>{const txt=document.body.innerText.replace(/\s+/g,' ');
  const i=txt.search(/core/i);
  return {url:location.pathname, coreMentioned:i>=0, around:i>=0?txt.slice(Math.max(0,i-220),i+260):null,
    fields:[...document.querySelectorAll('.q-field')].filter(e=>e.getBoundingClientRect().width)
      .map(e=>({label:(e.innerText||'').replace(/\s+/g,' ').trim().slice(0,34),val:(e.querySelector('input')||{}).value||''})).slice(0,24)};});
console.log('\nthe part record:',R.detail.url);
console.log('does it mention a core:',R.detail.coreMentioned);
if(R.detail.around) console.log('  ...',JSON.stringify(R.detail.around.slice(0,420)));
console.log('its fields:',JSON.stringify(R.detail.fields));
await page.screenshot({path:`${EV}/r104-part-record.png`,fullPage:true}).catch(()=>{});
fs.writeFileSync(`${EV}/r104-core-setup.json`,JSON.stringify(R,null,1));
await browser.close();
