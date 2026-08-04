import { login, api } from './qa8582.mjs';
import fs from 'fs';
const t=await login('admin'); let S=t.sessCookie;
const p=(n,r,l=350)=>console.log('#',n,r.status,(typeof r.body==='string'?r.body:JSON.stringify(r.body)).slice(0,l));
const staff=(await api(S,'GET','/api/staff?limit=300')).body.data.collection;
const cands=staff.filter(s=>s.is_active&&s.confirmed_invitation_on&&/Technician/i.test(s.role_label||''));
console.log('candidates', cands.length, cands.slice(0,8).map(s=>[s.first_name+' '+s.last_name,s.id,s.role_label,s.workplace_id||s.workplace||'']));
// pick one whose name we saw in TU rows? none of those are 'Technician' role necessarily. Print who is in TU rows
const tu=(await api(S,'GET','/api/reporting/reports/technician-utilization?range=this_year')).body.data.collection;
const names=new Set(tu.map(x=>x.technician_name));
const inBoth=cands.filter(s=>names.has(s.first_name+' '+s.last_name));
console.log('techs already in TU rows:', inBoth.map(s=>[s.first_name+' '+s.last_name,s.id]));
fs.writeFileSync('/tmp/report-suite-viu/staff.json', JSON.stringify(staff));
p('my-current-task(admin)', await api(S,'GET','/api/technician-tasks/my-current-task'));
