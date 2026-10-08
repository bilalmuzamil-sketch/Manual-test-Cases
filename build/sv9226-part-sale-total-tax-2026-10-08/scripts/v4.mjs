import {ob,j} from './lib.mjs';
const s=await ob({dpr:2,vp:{width:1600,height:1000}}); const p=s.page;
await s.go('/customers/vehicle/73823e09-e67b-4f62-a295-211bcf9f6809/work-orders?companyId=6a7b6afc-084d-4584-aacb-773bcd71cbcd'); await p.waitForTimeout(4000);
console.log(j(await p.evaluate(()=>[...document.querySelectorAll('tbody tr')].map(r=>r.innerText.replace(/\s+/g,' ').slice(0,160))),1500));
await s.close();
