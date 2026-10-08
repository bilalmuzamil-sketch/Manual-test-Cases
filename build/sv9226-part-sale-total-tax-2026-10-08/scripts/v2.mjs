import {ob,j} from './lib.mjs';
const s=await ob({vp:{width:1600,height:1000}}); const p=s.page; await s.go('/customers/vehicle/73823e09-e67b-4f62-a295-211bcf9f6809'); await p.waitForTimeout(4000);
console.log((await p.evaluate(()=>document.body.innerText)).replace(/\n+/g,' | ').slice(0,900));
console.log(await p.evaluate(()=>[...document.querySelectorAll('[data-test-id]')].map(e=>e.getAttribute('data-test-id')).filter(t=>/tab/i.test(t)).join(' ')));
await p.screenshot({path:'/tmp/qa9226/vehicle.png'}); await s.close();
