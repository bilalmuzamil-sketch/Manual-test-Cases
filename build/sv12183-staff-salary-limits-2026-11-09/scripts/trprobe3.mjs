import {sess,j} from './common.mjs';
const s=await sess();
const L=(await s.api('/api/staff?limit=400&search=ShopView')).json?.data; const a=L?.collection||L?.staff||L||[];
console.log('staff',j((Array.isArray(a)?a:[]).filter(x=>/admin@shopview/.test(JSON.stringify(x))).map(x=>({id:x.id,sid:x.staff_id,salary:x.salary,t:x.salary_type,clock:x.clockable,bill:x.billable}))));
const w=(await s.api('/api/work-orders?limit=100')).json?.data?.work_orders||[];
const c=w.filter(x=>['approved','in_progress'].includes(x.status)); console.log('candidates',c.length, j(c.slice(0,5).map(x=>({id:x.id,n:x.displayNumber||x.number,st:x.status}))));
for(const x of c.slice(0,8)){ const r=(await s.api('/api/work-orders/lines/'+x.id)).json?.data; const ls=r?.lines||r||[]; const ok=(Array.isArray(ls)?ls:[]).filter(l=>['authorized','in_progress'].includes(l.status)); if(ok.length){ console.log('PICK',x.id,x.displayNumber||x.number,j(ok.slice(0,3).map(l=>({id:l.id,name:l.line_name||l.name,st:l.status})))); break; } }
await s.close(); process.exit(0);
