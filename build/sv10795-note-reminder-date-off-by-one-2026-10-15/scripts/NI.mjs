import {ob,J,post} from './lib.mjs'; import fs from 'fs';
const A=JSON.parse(fs.readFileSync('WO1.json')); const s=await ob({tz:'America/New_York'}); const p=s.page;
await post(s,'/api/iam/change-location',{workplace_id:'b3c8c820-f815-4cf1-8938-10956c5ee71a',workplace_timezone:'America/Edmonton'});
await s.go('/workorders/'+A.work_order_id+'/notes'); await p.waitForTimeout(4000);
console.log(J(await p.evaluate(()=>[...document.querySelectorAll('[data-test-id*="8ee39796"],[data-test-id*="reminder"]')].map(e=>{const r=e.getBoundingClientRect();return [e.getAttribute('data-test-id'),(e.innerText||'').trim().slice(0,40),getComputedStyle(e).color,[r.x,r.y,r.width,r.height].map(Math.round)]})),2000));
const n=(await s.api('/api/work-orders/'+A.work_order_id+'/notes')).json; console.log('notes api',J(n,600));
await s.close();
