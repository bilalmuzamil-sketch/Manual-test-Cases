import fs from 'fs';
import {open} from '../../testing-tools/qa-session.mjs';
const rd=f=>fs.readFileSync('/tmp/sv10579/'+f,'utf8').trim(); const S=JSON.parse(rd('br-seed.json')); const [X,Y]=S.wos; const Z=JSON.parse(rd('br-z.json'));
const s=await open({env:'branch',ticket:'10579',dir:'/tmp/qa1',cookies:{sv_sso_session:rd('sso'),PHPSESSID:rd('phpsess'),cf_clearance:rd('cfc')}});
const post=async(u,b)=>{const r=await s.api(u,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(b)}); console.log('  POST',u.replace('/api/',''),r.status,JSON.stringify(r.json||r.text).slice(0,180)); return r;};
const wps=(await s.api('/api/staff/my-workplaces')).json.data.collection; const A=wps.find(w=>w.id===S.A);
await post('/api/iam/change-location',{workplace_id:A.id,workplace_timezone:A.timezone});
await post('/api/work-orders/part-request/move-to-line',{part_request_id:Z.prId,target_line_id:X.lineId});
// third WO at A with an OPEN timesheet entry made AT A (control for X's open Lethbridge entry)
const L=(await s.api('/api/work-orders?pagination%5Bpage%5D=1&pagination%5BrowsPerPage%5D=60&pagination%5BsortBy%5D=startDate&pagination%5Bdescending%5D=true')).json.data.work_orders;
const d=(await s.api('/api/work-orders/view/'+X.woId)).json.data; const w0=d.work_order||d;
const c=await post('/api/work-orders/create',{company_id:w0.company_id||w0.company?.id,vehicle_id:w0.vehicle_id||w0.vehicle?.id,workplace_id:A.id,start_date:new Date().toISOString().slice(0,10),is_vehicle_here:true}); const wId=c.json.data.work_order_id;
const cl=(await s.api('/api/work-orders/canned-lines?limit=100')).json.data.collection.filter(x=>x.workplace_id===A.id);
await post(`/api/work-orders/${wId}/lines/create-from-canned-line`,{canned_line_id:cl[0].id,status:'authorized'});
const lr=(await s.api('/api/work-orders/lines/'+wId)).json.data; const wLine=(Array.isArray(lr)?lr:lr.collection)[0].line_id;
const staff=(await s.api('/api/staff?limit=200')).json.data; const col=staff.collection||staff; const t2=col.find(x=>/Technician/.test(x.role_label)&&x.staff_id!=='34156e50-1404-423e-b977-92e3c8ae14c7'&&x.is_active!==false);
await post('/api/technician-tasks/create',{start_date:'02/11/2026 06:00',tech_assigned_id:t2.staff_id,work_order_id:wId,line_id:wLine,resolve_overlaps:true});
const L2=(await s.api('/api/work-orders?pagination%5Bpage%5D=1&pagination%5BrowsPerPage%5D=60&pagination%5BsortBy%5D=startDate&pagination%5Bdescending%5D=true')).json.data.work_orders;
const v=(await s.api('/api/work-orders/view/'+wId)).json.data; const num=(v.work_order||v).number;
for(const [tag,id] of [['X',X.woId],['Y',Y.woId],['W',wId]]){ const r=L2.find(x=>x.id===id); console.log(tag,r?.number,JSON.stringify({orderId:r?.orderId,unreceived:r?.unreceivedPartRequestsCount,clocked:r?.clockedInTechnicians})); }
fs.writeFileSync('/tmp/sv10579/br-w.json',JSON.stringify({wId,wLine,number:num,tech:t2.first_name+' '+t2.last_name,techStaff:t2.staff_id}));
process.exit(0);
