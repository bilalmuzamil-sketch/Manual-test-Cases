import {ob,J} from './lib.mjs'; import {loc} from './seed.mjs'; import fs from 'fs';
const A=JSON.parse(fs.readFileSync('A2.json')); const s=await ob(); const p=s.page; await loc(s);
await s.go('/parts/part-sale/'+A.ps_id+'/part-requests'); await p.waitForTimeout(4000);
console.log('dialog open?',await p.locator('.q-dialog').count());
console.log('tids',J(await p.evaluate(()=>[...document.querySelectorAll('[data-test-id*="part_request"]')].map(e=>e.getAttribute('data-test-id')+'|vis='+(e.getBoundingClientRect().width>0))),700));
await p.screenshot({path:'ev/ps10.png'}); await s.close();
