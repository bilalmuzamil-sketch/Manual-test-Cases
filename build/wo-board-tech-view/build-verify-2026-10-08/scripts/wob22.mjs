import {start} from './woblib.mjs'; import fs from 'fs';
const b=await start('/customers','admin'); const {page}=b;
const names=await page.evaluate(async()=>{let out=[];for(let p=1;p<40;p++){const x=await fetch('https://sv10043api.qa.shopview.com/api/customers?limit=100&page='+p+'&rowsPerPage=100',{credentials:'include',headers:{Accept:'application/json'}});const j=await x.json();const c=j.data.collection;out.push(...c.map(e=>e.name));if(c.length<100)break;}return out;});
fs.writeFileSync('/tmp/cln/sv10043-customers-all.json',JSON.stringify(names));
console.log(names.length, new Set(names).size, names.filter(n=>/Fibridge|Fisquare|Zeta|Mid Truck|Alpha Freight|Trailer Shop|ZZ/i.test(n)));
await b.browser.close();
