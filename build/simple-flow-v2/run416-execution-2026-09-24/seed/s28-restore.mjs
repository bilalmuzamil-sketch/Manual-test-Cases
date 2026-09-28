// Put the second person back in Technician and prove that role is default (Rule 118), so the next
// session starts from a known state rather than inheriting the roles I needed today.
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import { setRoleFor } from './lib-role.mjs';
import fs from 'fs';
const APP='https://app.shopview.com';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const WHO='bilal.muzamil+serviceadvisorlimitedview@shopview.com';
const {browser,page}=await bootProdLogin('/administration/staff',{settle:14000,viewport:{width:1680,height:1000}});
page.setDefaultTimeout(30000);
const R={};
for(const from of ['ZZAUTOTEST Receive Later','ZZAUTOTEST Order No Money','Technician','Admin']){
  R.restored=await setRoleFor(page,WHO,from,'Technician');
  console.log('via the',from,'filter ->',R.restored);
  if(!/not listed/.test(R.restored)) break;
}
await page.goto(`${APP}/administration/staff?roles=Technician`,{waitUntil:'domcontentloaded'}); await page.waitForTimeout(9000);
R.readBack=await page.evaluate((e)=>{const t=[...document.querySelectorAll('tr')].find(x=>(x.innerText||'').includes(e));
  return t?(t.innerText||'').replace(/\s+/g,' ').trim():'not in Technician';},WHO);
console.log('read back:',JSON.stringify(R.readBack));
fs.writeFileSync(`${EV}/s28-restore.json`,JSON.stringify(R,null,1));
await browser.close();
