// The receive window only offers Receive Later to somebody who holds the "Receive later" permission
// (r67 saw the button on a person who had it). Find which role my account is in and whether that
// permission is on.
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
const {browser,page}=await bootProdLogin('/administration/staff',{settle:14000,viewport:{width:1680,height:1000}});
page.setDefaultTimeout(35000);
const me=await page.evaluate(()=>{const rows=[...document.querySelectorAll('tr')].filter(t=>/bilal\.muzamil@shopview\.com/.test(t.innerText||''));
  return rows.map(t=>(t.innerText||'').replace(/\s+/g,' ').trim().slice(0,120));});
console.log('my staff row:',JSON.stringify(me));
await page.goto('https://app.shopview.com/administration/roles-permissions',{waitUntil:'domcontentloaded'});
await page.waitForTimeout(11000);
const roles=await page.evaluate(()=>[...document.querySelectorAll('tr,.q-item')].map(e=>(e.innerText||'').replace(/\s+/g,' ').trim())
  .filter(t=>t&&t.length<70).slice(0,30));
console.log('\nroles on the page:'); roles.forEach(r=>console.log('  ',r));
await browser.close();
