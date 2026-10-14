import {ob,J,post} from './lib.mjs'; import {loc} from './seed.mjs'; import fs from 'fs';
const A=JSON.parse(fs.readFileSync('A1.json')); const s=await ob(); const p=s.page; await loc(s);
let v=await s.api('/api/work-orders/view/'+A.work_order_id); console.log('wo',v.json?.data?.work_order?.status);
await s.go('/workorders/'+A.work_order_id+'/finance'); await p.waitForTimeout(3500);
console.log('tids',J(await p.evaluate(()=>[...document.querySelectorAll('[data-test-id]')].filter(e=>e.offsetParent).map(e=>e.getAttribute('data-test-id')+(e.disabled?'(dis)':''))),900));
await p.screenshot({path:'ev/s3.png'});
await s.close();
