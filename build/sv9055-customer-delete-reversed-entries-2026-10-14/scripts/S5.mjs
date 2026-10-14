import {ob,J,post} from './lib.mjs'; import {loc} from './seed.mjs'; import fs from 'fs';
const A=JSON.parse(fs.readFileSync('A1.json')); const s=await ob(); const p=s.page; await loc(s);
await s.go('/workorders/'+A.work_order_id+'/finance'); await p.waitForTimeout(3500);
await p.locator('[data-test-id="button_new_payment"]').click(); await p.waitForTimeout(2000);
console.log('dlg',J(await p.evaluate(()=>[...document.querySelectorAll('.q-dialog')].map(d=>d.innerText.replace(/\s+/g,' ').slice(0,600))),700));
console.log('dtids',J(await p.evaluate(()=>[...document.querySelectorAll('.q-dialog [data-test-id]')].map(e=>e.getAttribute('data-test-id')+'='+(e.value??'')+'|'+e.innerText?.trim().slice(0,25))),1500));
await p.screenshot({path:'ev/s5.png'});
await s.close();
