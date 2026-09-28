// Move the second person into "ZZAUTOTEST Order No Money" so the money-related permission checks can
// be run as them. Their current role is Technician, and the staff list remembers a role filter, so
// that is the filter to arrive with.
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import { setRoleFor } from './lib-role.mjs';
import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const WHO='bilal.muzamil+serviceadvisorlimitedview@shopview.com';
const {browser,page}=await bootProdLogin('/administration/staff',{settle:14000,viewport:{width:1680,height:1000}});
page.setDefaultTimeout(30000);
const R={};
for (const from of ['Technician','ZZAUTOTEST Order No Money','Admin']) {
  R.result=await setRoleFor(page,WHO,from,'ZZAUTOTEST Order No Money');
  console.log('arriving via the',from,'filter ->',R.result);
  if(!/not listed/.test(R.result)) break;
}
// read it back
await page.goto('https://app.shopview.com/administration/staff?roles='+encodeURIComponent('ZZAUTOTEST Order No Money'),{waitUntil:'domcontentloaded'});
await page.waitForTimeout(10000);
R.readBack=await page.evaluate((e)=>{const t=[...document.querySelectorAll('tr')].find(x=>(x.innerText||'').includes(e));
  return t?(t.innerText||'').replace(/\s+/g,' ').trim():'not in this role';},WHO);
console.log('read back:',JSON.stringify(R.readBack));
await page.screenshot({path:`${EV}/s24-assigned.png`,fullPage:true}).catch(()=>{});
fs.writeFileSync(`${EV}/s24-assign.json`,JSON.stringify(R,null,1));
await browser.close();
