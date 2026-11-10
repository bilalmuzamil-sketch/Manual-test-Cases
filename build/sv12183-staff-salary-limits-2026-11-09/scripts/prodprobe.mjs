import {sess,j} from './common.mjs';
const s=await sess(); console.log('marker',JSON.stringify(await s.marker()));
let r=await s.api('/api/staff?pagination[rowsPerPage]=500'); const arr=r.json?.data?.collection||[];
console.log('me',j(arr.filter(x=>/bilal\.muzamil/.test(x.email)).map(x=>({id:x.id,sid:x.staff_id,salary:x.salary,t:x.salary_type,clock:x.clockable,bill:x.billable,wp:x.defaultWorkplaceName}))));
const w=(await s.api('/api/work-orders?limit=100')).json?.data?.work_orders||[]; const c=w.filter(x=>['approved','in_progress'].includes(x.status));
for(const x of c.slice(0,10)){ const ls=(await s.api('/api/work-orders/lines/'+x.id)).json?.data?.collection||[]; const ok=ls.filter(l=>l.status==='authorized'&&(l.tasks||[]).length); if(ok.length){ console.log('PICK',x.id,x.displayNumber||x.number,j(ok.slice(0,2).map(l=>({id:l.line_id,name:l.line_name})))); break; } }
console.log('cur',j((await s.api('/api/technician-tasks/my-current-task')).json));
await s.close(); process.exit(0);
