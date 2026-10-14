import {ob,J,post} from './lib.mjs'; import {loc} from './seed.mjs'; import fs from 'fs';
const A=JSON.parse(fs.readFileSync('A1.json')); const s=await ob(); const p=s.page; await loc(s);
let r=await post(s,'/api/work-orders/lines/change-status',{line_id:A.line_id,work_order_id:A.work_order_id,status:'complete'}); console.log('complete',r.status,J(r.json,200));
let v=await s.api('/api/work-orders/view/'+A.work_order_id); console.log('wo',v.json?.data?.work_order?.status);
await s.go('/workorders/'+A.work_order_id+'/lines'); await p.waitForTimeout(3000);
const tids=async()=>p.evaluate(()=>[...document.querySelectorAll('[data-test-id]')].filter(e=>e.offsetParent).map(e=>e.getAttribute('data-test-id')).filter(t=>/review|invoice|payment|complete/i.test(t)));
console.log('tids',J(await tids(),600));
const b=p.locator('[data-test-id="button_mark_reviewed"]');
if(await b.count()){ await b.click(); await p.waitForTimeout(1500);
  console.log('dialog',J(await p.evaluate(()=>[...document.querySelectorAll('.q-dialog')].map(d=>d.innerText.replace(/\s+/g,' ').slice(0,300))),400));
  console.log('dlgbtn',J(await p.evaluate(()=>[...document.querySelectorAll('.q-dialog [data-test-id]')].map(e=>e.getAttribute('data-test-id')+'='+e.innerText.trim().slice(0,30))),600)); }
await p.screenshot({path:'ev/s2.png'});
await s.close();
