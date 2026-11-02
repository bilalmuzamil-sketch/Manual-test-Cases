import fs from 'fs';
import {open} from '../../testing-tools/qa-session.mjs';
const rd=f=>fs.readFileSync('/tmp/sv10579/'+f,'utf8').trim(); const S=JSON.parse(rd('br-seed.json')); const [X,Y]=S.wos;
const s=await open({env:'branch',ticket:'10579',dir:'/tmp/qa1',cookies:{sv_sso_session:rd('sso'),PHPSESSID:rd('phpsess'),cf_clearance:rd('cfc')}});
const post=async(u,b)=>{const r=await s.api(u,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(b)}); console.log('  POST',u.replace('/api/',''),r.status,JSON.stringify(r.json||r.text).slice(0,180)); return r;};
const wps=(await s.api('/api/staff/my-workplaces')).json.data.collection; const A=wps.find(w=>w.id===S.A), B=wps.find(w=>w.id===S.B);
const loc=w=>post('/api/iam/change-location',{workplace_id:w.id,workplace_timezone:w.timezone});
const TECH='34156e50-1404-423e-b977-92e3c8ae14c7';
await loc(A); await post('/api/technician-tasks/check-in',{task_id:'cea4d124-9d86-49fd-840c-acf9c6584c37',line_id:Y.lineId,work_order_id:Y.woId,refresh_lines:true});
await loc(B); await post('/api/technician-tasks/check-in',{task_id:'c6186927-4061-465d-84e6-b0e0a91184d3',line_id:X.lineId,work_order_id:X.woId,refresh_lines:true});
await post('/api/technician-tasks/create',{start_date:'01/11/2026 09:00',end_date:'01/11/2026 10:00',tech_assigned_id:TECH,work_order_id:X.woId,line_id:X.lineId,resolve_overlaps:true});
await loc(A);
const L=(await s.api('/api/work-orders?pagination%5Bpage%5D=1&pagination%5BrowsPerPage%5D=50&pagination%5BsortBy%5D=startDate&pagination%5Bdescending%5D=true')).json.data.work_orders;
for(const w of [X,Y]){ const r=L.find(x=>x.id===w.woId); console.log(w.tag,w.number,r?JSON.stringify({orderId:r.orderId,unreceived:r.unreceivedPartRequestsCount,clocked:r.clockedInTechnicians,cnt:r.clockedInTechniciansCount,status:r.status}):'not in list'); }
process.exit(0);
