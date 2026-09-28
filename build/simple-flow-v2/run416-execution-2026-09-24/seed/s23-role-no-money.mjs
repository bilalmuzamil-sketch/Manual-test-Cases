// SEED 3 - a person who may ORDER and RECEIVE parts but may NOT see money. Three checks need exactly
// that: receiving still works while cost/tax/subtotal/total/sell are ABSENT (not masked), the same on
// the purchase orders page, and the finish-action negative for a user without See Financial Data.
// Built as a NEW custom role from the Admin template so the shop's own roles keep their defaults
// (Rule 118 - a default is proved by Reset To Template, and I am not disturbing one here).
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import { createRole } from './lib-role.mjs';
import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const NAME='ZZAUTOTEST Order No Money';
const {browser,page}=await bootProdLogin('/administration/roles-permissions',{settle:14000,viewport:{width:1680,height:1000}});
page.setDefaultTimeout(30000);
const R={};
// does it already exist from an earlier run?
await page.waitForTimeout(4000);
R.existing=await page.evaluate((n)=>[...document.querySelectorAll('tr')].some(t=>(t.innerText||'').includes(n)),NAME);
console.log('role already exists:',R.existing);
if(!R.existing){
  R.created=await createRole(page,NAME,{'See Financial Data':false});
  console.log('create:',JSON.stringify(R.created,null,1).slice(0,700));
} else console.log('reusing the existing role');
// read back what it actually holds
await page.goto('https://app.shopview.com/administration/roles-permissions',{waitUntil:'domcontentloaded'});
await page.waitForTimeout(11000);
R.row=await page.evaluate((n)=>{const t=[...document.querySelectorAll('tr')].find(x=>(x.innerText||'').includes(n));
  return t?(t.innerText||'').replace(/\s+/g,' ').trim():null;},NAME);
console.log('the role row now reads:',JSON.stringify(R.row));
await page.screenshot({path:`${EV}/s23-roles.png`,fullPage:true}).catch(()=>{});
fs.writeFileSync(`${EV}/s23-role-no-money.json`,JSON.stringify(R,null,1));
await browser.close();
