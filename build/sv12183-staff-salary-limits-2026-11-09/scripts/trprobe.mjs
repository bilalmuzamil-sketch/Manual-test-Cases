import {sess,j} from './common.mjs';
const s=await sess(); console.log('marker',JSON.stringify(await s.marker()));
const pr=(await s.api('/api/iam/view-profile/')).json?.data; console.log('profile',j({id:pr?.id,first:pr?.first_name,last:pr?.last_name,email:pr?.email,staff:pr?.staff_id}));
const L=(await s.api('/api/staff?limit=400&search='+encodeURIComponent(pr?.last_name||''))).json?.data; const a=L?.collection||L||[];
console.log('staff',j(a.filter(x=>x.email===pr?.email).map(x=>({id:x.id,sid:x.staff_id,salary:x.salary,t:x.salary_type,clock:x.clockable,bill:x.billable,wp:x.workplace_id}))));
const cur=await s.api('/api/technician-tasks/my-current-task'); console.log('current',cur.status,j(cur.json));
const w=(await s.api('/api/work-orders?pagination[rowsPerPage]=15&filters[0][field]=status&filters[0][value]=in_progress')).json?.data; const ws=w?.collection||w?.items||w||[];
console.log('wos',j((Array.isArray(ws)?ws:[]).slice(0,6).map(x=>({id:x.id,n:x.number||x.display_number,st:x.status}))));
await s.close(); process.exit(0);
