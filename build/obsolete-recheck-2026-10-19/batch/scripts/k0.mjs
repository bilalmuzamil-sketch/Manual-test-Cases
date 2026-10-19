import {session} from './rec.mjs';
const s=await session({});
for(const n of ['S2-35903','S2-35904','S2-35905','S2-36360']){ const w=(await s.api('/api/work-orders?pagination[page]=1&pagination[rowsPerPage]=3&search='+n)).json.data.work_orders[0]; const v=(await s.api('/api/work-orders/view/'+w.id)).json.data; const W=v.work_order||v; console.log(n,w.companyName,'|',W.company_id,'|',(W.vehicle||{}).id||W.vehicle_id,'| lead',w.techAssignedLastName,'| start',w.startDate); }
const st=(await s.api('/api/staff?limit=100&search=Vic%20Hover')).json.data.collection.map(x=>x.first_name+' '+x.last_name+'|'+x.staff_id+'|'+x.clockable+'|'+x.departments.join('/')); console.log(st.join(' ; '));
await s.close();
