import {ob,J,post} from './lib.mjs'; import {loc} from './seed.mjs'; import fs from 'fs';
const A=JSON.parse(fs.readFileSync('A1.json')); const s=await ob(); const p=s.page; await loc(s);
const r=await post(s,'/api/invoices/create',{work_order_id:A.work_order_id}); console.log('invoice',r.status,J(r.json,200));
A.invoice_id=r.json?.data?.invoice_id||r.json?.data?.id; fs.writeFileSync('A1.json',JSON.stringify(A));
await s.go('/workorders/'+A.work_order_id+'/finance'); await p.waitForTimeout(3500);
console.log('tids',J(await p.evaluate(()=>[...document.querySelectorAll('[data-test-id]')].filter(e=>e.offsetParent).map(e=>e.getAttribute('data-test-id')+(e.disabled?'(dis)':'')).filter(t=>/pay|invoice|deposit|credit|reverse|menu/i.test(t))),900));
await p.screenshot({path:'ev/s4.png'});
await s.close();
