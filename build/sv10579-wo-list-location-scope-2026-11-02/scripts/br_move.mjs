import fs from 'fs';
import {open} from '../../testing-tools/qa-session.mjs';
const rd=f=>fs.readFileSync('/tmp/sv10579/'+f,'utf8').trim(); const S=JSON.parse(rd('br-seed.json')); const [X]=S.wos; const T=JSON.parse(rd('br-tech.json')); const Z=JSON.parse(rd('br-z.json'));
const s=await open({env:'branch',ticket:'10579',dir:'/tmp/qa1',cookies:{sv_sso_session:rd('sso'),PHPSESSID:rd('phpsess'),cf_clearance:rd('cfc')}});
const post=async(u,b)=>{const r=await s.api(u,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(b)}); console.log('  POST',u.replace('/api/',''),r.status,JSON.stringify(r.json||r.text).slice(0,200)); return r;};
const wps=(await s.api('/api/staff/my-workplaces')).json.data.collection; const A=wps.find(w=>w.id===S.A), B=wps.find(w=>w.id===S.B);
const find=async(id,wo)=>{ const c=(await s.api(`/api/technician-tasks/list?pagination%5BrowsPerPage%5D=100&pagination%5Bpage%5D=1&filters%5B0%5D%5Bfield%5D=work_order&filters%5B0%5D%5Bvalue%5D=${wo}&search=`)).json?.data?.collection||[]; return c.find(x=>x.id===id)||null; };
for(const W of [B,A]){ await post('/api/iam/change-location',{workplace_id:W.id,workplace_timezone:W.timezone});
  const r=await find(T.lethTtr,Z.zId); if(!r){ console.log('not visible at',W.name); continue; } console.log('ttr at',W.name.slice(8),JSON.stringify({wp:r.workplace_id===B.id?'LETH':'HD',wo:r.work_order_id.slice(0,8),s:r.start_date,e:r.end_date,staff:r.staff_id.slice(0,8)}));
  const ch=await post('/api/technician-tasks/change',{id:r.id,start_date:r.start_date,end_date:r.end_date,tech_assigned_id:r.staff_id,description:r.description||'ZZAUTOTEST SV-10579 Lethbridge clock-in',work_order_id:X.woId,line_id:X.lineId});
  const mv=await post('/api/technician-tasks/move',{id:r.id,line_id:X.lineId,work_order_id:X.woId});
  const r2=(await find(T.lethTtr,X.woId))||(await find(T.lethTtr,Z.zId)); console.log('after',r2?JSON.stringify({wp:r2.workplace_id===B.id?'LETH':'HD',wo:r2.work_order_id===X.woId?'X':r2.work_order_id.slice(0,8),line:r2.line_id===X.lineId?'X line':r2.line_id.slice(0,8)}):'gone');
  if(r2&&r2.work_order_id===X.woId) break; }
process.exit(0);
