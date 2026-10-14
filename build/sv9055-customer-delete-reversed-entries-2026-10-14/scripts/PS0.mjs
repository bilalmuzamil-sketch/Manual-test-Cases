import {ob,J,post} from './lib.mjs'; import {loc,customer} from './seed.mjs'; import fs from 'fs';
const s=await ob(); const p=s.page; await loc(s);
const inv=await s.api('/api/inventory/parts?limit=50'); const P=(inv.json?.data?.collection||[]).filter(x=>Number(x.quantity)>20).slice(0,3).map(x=>[x.part_number,x.quantity,x.sell_price]); console.log('parts',J(P,300));
const c=await customer(s,'ZZAUTOTEST SV9055 A2 part-sale '+Date.now()%100000);
const ps=await post(s,'/api/part-sales',{company_id:c.company_id}); console.log('ps',ps.status,J(ps.json,200));
const A={...c,ps_id:ps.json?.data?.[0]?.id, part_number:P[0]?.[0]}; fs.writeFileSync('A2.json',JSON.stringify(A));
await s.go('/parts/part-sale/'+A.ps_id+'/part-requests'); await p.waitForTimeout(3500);
console.log('tids',J(await p.evaluate(()=>[...document.querySelectorAll('[data-test-id]')].filter(e=>e.offsetParent).map(e=>e.getAttribute('data-test-id')).filter(t=>!/nav|profile|module|clock|notif|global|skip/.test(t))),900));
await p.screenshot({path:'ev/ps0.png'}); await s.close();
