import {start,mk,OUT} from './woblib.mjs'; import fs from 'fs';
const b=await start('/workorders','admin'); const {page}=b;
const r={};
for (const p of ['/api/staff?limit=200','/api/customers?limit=200','/api/customers?search=Fibridge','/api/staff/my-workplaces']){
  r[p]=await page.evaluate(async(u)=>{const x=await fetch('https://sv10043api.qa.shopview.com'+u,{credentials:'include',headers:{Accept:'application/json'}});return x.status+' '+(await x.text()).slice(0,200000);},p);
}
fs.writeFileSync('/tmp/cln/sv10043-lists.json',JSON.stringify(r));
for (const k in r) console.log(k, r[k].slice(0,120));
const {go,dump}=mk(page); await go('/customers',9000); await dump('customers-list');
await go('/settings/staff',9000); await dump('staff-list');
await b.browser.close();
