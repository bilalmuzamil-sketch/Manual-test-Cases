import {ob,J,post} from './lib.mjs'; import {loc,customer,wo} from './seed.mjs'; import fs from 'fs';
const s=await ob(); await loc(s);
const c=await customer(s,'ZZAUTOTEST SV9055 A1 '+Date.now()%100000); const w=await wo(s,c);
const lines=await s.api('/api/work-orders/lines/'+w.work_order_id); const ln=lines.json.data.collection[0];
console.log('lineid',ln.line_id,ln.status);
const r=await post(s,'/api/work-orders/lines/change-status',{line_id:ln.line_id,work_order_id:w.work_order_id,status:'complete'}); console.log('complete',r.status,J(r.json,300));
const v=await s.api('/api/work-orders/view/'+w.work_order_id); console.log('wo status',v.json?.data?.work_order?.status||J(v.json,200));
fs.writeFileSync('A1.json',JSON.stringify({...c,...w,line_id:ln.line_id}));
await s.close();
