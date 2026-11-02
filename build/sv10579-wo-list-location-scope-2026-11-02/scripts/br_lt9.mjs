import fs from 'fs';
import {open} from '../../testing-tools/qa-session.mjs';
const rd=f=>fs.readFileSync('/tmp/sv10579/'+f,'utf8').trim(); const S=JSON.parse(rd('br-seed.json')); const [X]=S.wos; const TS=rd('techstaff');
const s=await open({env:'branch',ticket:'10579',dir:'/tmp/qa3',quick:'tech',cookies:{sv_sso_session:rd('sso'),PHPSESSID:rd('phpsess'),cf_clearance:rd('cfc')}});
const post=async(u,b)=>{const r=await s.api(u,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(b)}); console.log('  ',u.replace('/api/',''),r.status,JSON.stringify(r.json||r.text).slice(0,200)); return r;};
const wps=(await s.api('/api/staff/my-workplaces')).json.data.collection; const A=wps.find(w=>w.id===S.A), B=wps.find(w=>w.id===S.B);
const at=L=>post('/api/iam/change-location',{workplace_id:L.id,workplace_timezone:L.timezone});
console.log('current',JSON.stringify((await s.api('/api/technician-tasks/my-current-task')).json).slice(0,200));
const d=(await s.api('/api/work-orders/view/'+X.woId)).json.data; const w0=d.work_order||d; const company=w0.company_id||w0.company?.id, vehicle=w0.vehicle_id||w0.vehicle?.id;
const cl=(await s.api('/api/work-orders/canned-lines?limit=100')).json.data.collection.filter(x=>x.workplace_id===A.id);
await at(A);
const c=await post('/api/work-orders/create',{company_id:company,vehicle_id:vehicle,workplace_id:A.id,start_date:new Date().toISOString().slice(0,10),is_vehicle_here:true}); const Y=c.json.data.work_order_id;
let ln=await post(`/api/work-orders/${Y}/lines/create-from-canned-line`,{canned_line_id:cl[0].id,status:'authorized'});
if(ln.status>=300) ln=await post('/api/work-orders/lines/create',{canned_line_id:cl[0].id,work_order_id:Y,status:'authorized'});
const lr=(await s.api('/api/work-orders/lines/'+Y)).json.data; const yl=(Array.isArray(lr)?lr:lr.collection)[0].line_id;
const yn=(await s.api('/api/work-orders/view/'+Y)).json.data; console.log('Y',Y,yl,(yn.work_order||yn).number);
const out={Y,yl,number:(yn.work_order||yn).number,tries:[]};
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
// T1: task made at HD, check-in at Lethbridge
await at(A); const tA=(await post('/api/work-orders/tasks/create',{staff_id:TS,line_id:yl,work_order_id:Y})).json?.data?.task?.id;
await at(B); let ci=await post('/api/technician-tasks/check-in',{task_id:tA,line_id:yl,work_order_id:Y,refresh_lines:true}); out.tries.push({t:'taskHD-checkinLeth',st:ci.status,j:ci.json});
// T2: task made at Lethbridge, check-in at Lethbridge / HD
const tB=(await post('/api/work-orders/tasks/create',{staff_id:TS,line_id:yl,work_order_id:Y})); out.tries.push({t:'taskcreate-at-Leth',st:tB.status,j:tB.json});
const tBid=tB.json?.data?.task?.id;
if(tBid){ ci=await post('/api/technician-tasks/check-in',{task_id:tBid,line_id:yl,work_order_id:Y,refresh_lines:true}); out.tries.push({t:'taskLeth-checkinLeth',st:ci.status,j:ci.json});
  if(ci.status>=300){ await at(A); ci=await post('/api/technician-tasks/check-in',{task_id:tBid,line_id:yl,work_order_id:Y,refresh_lines:true}); out.tries.push({t:'taskLeth-checkinHD',st:ci.status,j:ci.json}); } }
// T3: timesheet entry made at Lethbridge naming the HD task
await at(B); const now=new Date(Date.now()-3*3600e3);
const f=x=>{const p=new Intl.DateTimeFormat('en-GB',{timeZone:B.timezone,day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit',hour12:false}).formatToParts(x).reduce((a,q)=>(a[q.type]=q.value,a),{}); return `${p.day}/${p.month}/${p.year} ${p.hour}:${p.minute}`;};
const te=await post('/api/technician-tasks/create',{start_date:f(now),end_date:f(new Date(now.getTime()+30*60e3)),tech_assigned_id:TS,work_order_id:Y,line_id:yl,task_id:tA,work_order_task_id:tA,resolve_overlaps:true}); out.tries.push({t:'timesheet-at-Leth-with-taskHD',st:te.status,j:te.json});
if(ci.status<300 && ci.json?.data?.id){ await sleep(65000); await post('/api/technician-tasks/check-out',{task_id:ci.json.data.id,tech_story:'ZZAUTOTEST SV-10579 row 8',complete_line:false}); }
fs.writeFileSync('/tmp/sv10579/br-y.json',JSON.stringify(out,null,1));
process.exit(0);
