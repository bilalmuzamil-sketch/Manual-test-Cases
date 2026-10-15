import {ob,J,post} from './lib.mjs'; import {loc,customer,wo} from './seed.mjs'; import fs from 'fs';
const s=await ob({tz:'America/New_York'}); const p=s.page; await loc(s);
const c=await customer(s,'ZZAUTOTEST SV10795 '+Date.now()%100000); const w=await wo(s,c); fs.writeFileSync('WO1.json',JSON.stringify({...c,...w}));
await s.go('/workorders/'+w.work_order_id+'/notes'); await p.waitForTimeout(4500); console.log('url',p.url());
const tids=async()=>p.evaluate(()=>[...document.querySelectorAll('[data-test-id]')].filter(e=>e.offsetParent).map(e=>e.getAttribute('data-test-id')+'|'+(e.innerText||e.value||'').trim().replace(/\s+/g,' ').slice(0,30)));
console.log('notes tids',J((await tids()).filter(x=>!/nav_link|clock_in|notif|profile|module|skip|global|vehicle_here|copy_vin/.test(x)),2500)); await p.screenshot({path:'ev/N1-notes.png'});
await s.close();
