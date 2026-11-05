// usage: node inv.mjs <tag> [pay] -> story+complete every line, complete WO, invoice (+ optional cash payment)
import {sess,post} from './common.mjs'; import fs from 'fs';
const ENV=process.env.ENV||'branch'; const TAG=process.argv[2]; const F=`/tmp/sv11006/seed-${ENV}-${TAG}.json`; const S=JSON.parse(fs.readFileSync(F,'utf8'));
const s=await sess(); await s.go('/workorders'); await s.page.waitForTimeout(2000);
await post(s,'/api/work-orders/change-mileage',{work_order_id:S.wo,mileage:'123456'});
for(const l of S.lines){ await post(s,'/api/work-orders/lines/change-story',{line_id:l,tech_story:'ZZAUTOTEST done',work_order_id:S.wo}); const r=await post(s,'/api/work-orders/lines/change-status',{line_id:l,status:'complete'}); console.log('line',r.status,JSON.stringify(r.json).slice(0,100)); }
for(const st of ['ready_for_review','complete']){ const r=await post(s,'/api/work-orders/change-status',{id:S.wo,status:st}); console.log('wo',st,r.status,JSON.stringify(r.json).slice(0,140)); }
const inv=await post(s,'/api/invoices/create',{work_order_id:S.wo}); console.log('invoice',inv.status,JSON.stringify(inv.json).slice(0,240)); S.invoice=inv.json?.data; fs.writeFileSync(F,JSON.stringify(S,null,1));
await s.close(); process.exit(0);
