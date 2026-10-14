import {op,J} from './lib.mjs'; import {loc} from './seed.mjs'; import fs from 'fs';
const B=JSON.parse(fs.readFileSync('NT3.json')); const s=await op(); const p=s.page; await loc(s);
await s.go('/customers/'+B.company_id+'/invoices'); await p.waitForTimeout(4500);
console.log('inv',J(await p.evaluate(()=>document.querySelector('main, .q-page')?.innerText.replace(/\s+/g,' ').slice(0,700)),800));
await p.screenshot({path:'ev/NT6-invoices.png'});
await s.close();
