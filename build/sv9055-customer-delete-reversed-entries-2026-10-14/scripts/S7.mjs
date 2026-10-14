import {ob,J,post} from './lib.mjs'; import {loc} from './seed.mjs'; import fs from 'fs';
const A=JSON.parse(fs.readFileSync('A1.json')); const s=await ob(); const p=s.page; await loc(s);
const W=()=>s.writes.filter(w=>/customer-account|invoices|deposits|customers\//.test(w));
const dlg=async()=>J(await p.evaluate(()=>[...document.querySelectorAll('.q-dialog')].map(d=>d.innerText.replace(/\s+/g,' ').slice(0,250))),400);
const dtid=async()=>J(await p.evaluate(()=>[...document.querySelectorAll('.q-dialog [data-test-id], .q-menu [data-test-id]')].map(e=>e.getAttribute('data-test-id')+'|'+e.innerText.trim().slice(0,25))),700);
await s.go('/customers/'+A.company_id+'/payments'); await p.waitForTimeout(3500);
console.log('payments tids',J(await p.evaluate(()=>[...document.querySelectorAll('[data-test-id]')].filter(e=>e.offsetParent).map(e=>e.getAttribute('data-test-id')).filter(t=>/pay|remove|reverse|delete|row/i.test(t))),700));
await p.screenshot({path:'ev/s7a.png'});
await s.close();
