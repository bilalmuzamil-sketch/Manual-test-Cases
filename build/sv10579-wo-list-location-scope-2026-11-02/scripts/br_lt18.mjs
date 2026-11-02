import fs from 'fs';
import {open} from '../../testing-tools/qa-session.mjs';
const rd=f=>fs.readFileSync('/tmp/sv10579/'+f,'utf8').trim(); const S=JSON.parse(rd('br-seed.json')); const CK=JSON.parse(rd('br-ck.json')); const TS=rd('techstaff'); const C=CK.C;
const s=await open({env:'branch',ticket:'10579',dir:'/tmp/qa3',quick:'tech',cookies:{sv_sso_session:rd('sso'),PHPSESSID:rd('phpsess'),cf_clearance:rd('cfc')}});
const post=async(u,b)=>{const r=await s.api(u,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(b)}); if(!/change-location/.test(u)) console.log('  ',u.replace('/api/',''),r.status,JSON.stringify(r.json||r.text).slice(0,160)); return r;};
const wps=(await s.api('/api/staff/my-workplaces')).json.data.collection; const A=wps.find(w=>w.id===S.A);
await post('/api/iam/change-location',{workplace_id:A.id,workplace_timezone:A.timezone});
const ci=await post('/api/technician-tasks/check-in',{task_id:'2185c30b',line_id:C.line,work_order_id:C.id,refresh_lines:true});
let rec=ci.json?.data?.id;
if(!rec){ const t=(await post('/api/work-orders/tasks/create',{staff_id:TS,line_id:C.line,work_order_id:C.id})).json.data.task.id; console.log('task from create',t); const c2=await post('/api/technician-tasks/check-in',{task_id:t,line_id:C.line,work_order_id:C.id,refresh_lines:true}); rec=c2.json?.data?.id; }
await new Promise(r=>setTimeout(r,65000));
await post('/api/technician-tasks/check-out',{task_id:rec,tech_story:'ZZAUTOTEST SV-10579 control clock-in',complete_line:false});
fs.writeFileSync('/tmp/sv10579/br-c2.json',JSON.stringify({rec}));
process.exit(0);
