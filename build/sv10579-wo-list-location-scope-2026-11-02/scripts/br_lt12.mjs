import fs from 'fs';
import {open} from '../../testing-tools/qa-session.mjs';
const rd=f=>fs.readFileSync('/tmp/sv10579/'+f,'utf8').trim(); const S=JSON.parse(rd('br-seed.json')); const Y=JSON.parse(rd('br-y.json')); const R=JSON.parse(rd('rec7d.json'));
const s=await open({env:'branch',ticket:'10579',dir:'/tmp/qa1',cookies:{sv_sso_session:rd('sso'),PHPSESSID:rd('phpsess'),cf_clearance:rd('cfc')}});
const post=async(u,b)=>{const r=await s.api(u,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(b)}); console.log('  ',u.replace('/api/',''),r.status,JSON.stringify(r.json||r.text).slice(0,220)); return r;};
const wps=(await s.api('/api/staff/my-workplaces')).json.data.collection; const A=wps.find(w=>w.id===S.A), B=wps.find(w=>w.id===S.B);
const at=L=>post('/api/iam/change-location',{workplace_id:L.id,workplace_timezone:L.timezone});
const wpOf=async()=>{ const c=(await s.api(`/api/technician-tasks/list?pagination[rowsPerPage]=100&pagination[page]=1&filters[0][field]=work_order&filters[0][value]=${Y.Y}&search=`)).json.data.collection; const r=c.find(x=>x.id===R.id); return r&&(r.workplace_id===S.A?'HD':r.workplace_id===S.B?'Leth':r.workplace_id); };
const cv=(s0,tz)=>{const [d,m]=s0.split(' '); const [dd,mm,yy]=d.split('/'); const x=new Date(`${yy}-${mm}-${dd}T${m}:00Z`); const p=new Intl.DateTimeFormat('en-GB',{timeZone:tz,day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit',hour12:false}).formatToParts(x).reduce((a,q)=>(a[q.type]=q.value,a),{}); return `${p.day}/${p.month}/${p.year} ${p.hour}:${p.minute}`;};
console.log('fmt',R.formatted_start_date_time,R.start_date_display,R.start_time);
await at(B);
const body={id:R.id,start_date:cv(R.start_date,B.timezone),end_date:cv(R.end_date,B.timezone),tech_assigned_id:R.staff_id,description:R.description,work_order_id:Y.Y,line_id:Y.yl};
const r1=await post('/api/technician-tasks/change',body);
await at(A); console.log('workplace after change-from-Leth:',await wpOf());
if(r1.status>=300){ await at(B); await post('/api/technician-tasks/change',{...body,workplace_id:B.id}); await at(A); console.log('after workplace_id body:',await wpOf()); }
process.exit(0);
