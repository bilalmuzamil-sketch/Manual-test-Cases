import fs from 'fs';
import {open} from '../../testing-tools/qa-session.mjs';
const P=JSON.parse(fs.readFileSync('/tmp/sv10579/prod-seed.json','utf8'));
const s=await open({env:'prod',dir:'/tmp/qa2',user:'bilal.muzamil+serviceadvisornoreports@shopview.com',pw:fs.readFileSync('/tmp/sv-prod-pw2.txt','utf8').trim()});
const post=async(u,b)=>{const r=await s.api(u,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(b)}); console.log('  POST',u.replace('/api/',''),r.status,JSON.stringify(r.json||r.text).slice(0,200)); return r;};
const wps=(await s.api('/api/staff/my-workplaces')).json.data.collection; const A=wps.find(w=>w.name==='Trucks Hill 2'), B=wps.find(w=>w.name==='Truck Hill 1');
const staff=(await s.api('/api/staff?limit=200')).json.data; const col=staff.collection||staff; const zz=col.filter(x=>/ZZAUTOTEST/.test(x.first_name)&&/Technician/.test(x.role_label)&&x.is_active!==false);
const tz=fs.readFileSync('/dev/stdin','utf8');
let made=null;
await post('/api/iam/change-location',{workplace_id:B.id,workplace_timezone:B.timezone});
for(const t of zz.slice(0,6)){ const r=await post('/api/technician-tasks/create',{start_date:'02/11/2026 06:00',tech_assigned_id:t.staff_id,work_order_id:P.woId,line_id:P.lineId,resolve_overlaps:true}); if(r.status===201){ made={tech:t.first_name+' '+t.last_name,staff:t.staff_id,task:r.json.data.id}; break; } }
console.log('made',JSON.stringify(made));
if(made){ const rep=JSON.stringify((await s.api('/api/reporting/punch-clock-activities/today?range=last_7_days&pagination%5Bpage%5D=1&pagination%5BrowsPerPage%5D=50')).json); console.log('in Truck Hill 1 timesheet report', rep.includes(made.task)); }
await post('/api/iam/change-location',{workplace_id:A.id,workplace_timezone:A.timezone});
const L=(await s.api('/api/work-orders?pagination%5Bpage%5D=1&pagination%5BrowsPerPage%5D=60&pagination%5BsortBy%5D=startDate&pagination%5Bdescending%5D=true')).json.data.work_orders;
const r=L.find(x=>x.id===P.woId); console.log('PROD list row', r.number, JSON.stringify({clocked:r.clockedInTechnicians,cnt:r.clockedInTechniciansCount}));
fs.writeFileSync('/tmp/sv10579/prod-before.json',JSON.stringify({...made,row:r}));
process.exit(0);
