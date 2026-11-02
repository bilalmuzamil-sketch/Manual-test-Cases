import fs from 'fs';
import {open} from '../../testing-tools/qa-session.mjs';
const rd=f=>fs.readFileSync('/tmp/sv10579/'+f,'utf8').trim(); const S=JSON.parse(rd('br-seed.json')); const CK=JSON.parse(rd('br-ck.json')); const Y=JSON.parse(rd('br-y.json')); const TS=rd('techstaff');
const s=await open({env:'branch',ticket:'10579',dir:'/tmp/qa1',cookies:{sv_sso_session:rd('sso'),PHPSESSID:rd('phpsess'),cf_clearance:rd('cfc')}});
const post=async(u,b)=>{const r=await s.api(u,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(b)}); if(!/change-location/.test(u)) console.log('  ',u.replace('/api/',''),r.status,JSON.stringify(r.json||r.text).slice(0,160)); return r;};
const wps=(await s.api('/api/staff/my-workplaces')).json.data.collection; const A=wps.find(w=>w.id===S.A);
await post('/api/iam/change-location',{workplace_id:A.id,workplace_timezone:A.timezone});
for(const [n,l] of [['Y',Y.yl],['C',CK.C.line],['K',CK.K.line]]){ const r=await s.api(`/api/work-orders/lines/${l}/technicians`); console.log(n,'line techs',r.status,JSON.stringify(r.json).slice(0,300)); }
await post('/api/work-orders/tasks/create',{staff_id:TS,line_id:CK.C.line,work_order_id:CK.C.id});
const find=(o,id)=>{ if(!o||typeof o!=='object') return null; if(o.id===id) return o; for(const v of Object.values(o)){const r=find(v,id); if(r) return r;} return null; };
const b=(await s.api('/api/work-orders/board?search=17587&showMyWorkOrders=0&fill=12&perGroup=25')).json; console.log('C after task assign lineTech=',JSON.stringify(find(b,CK.C.id)?.lineTechnicians));
const tasks=(await s.api('/api/work-orders/'+CK.C.id+'/tasks')); console.log('C tasks',tasks.status,JSON.stringify(tasks.json).slice(0,400));
process.exit(0);
