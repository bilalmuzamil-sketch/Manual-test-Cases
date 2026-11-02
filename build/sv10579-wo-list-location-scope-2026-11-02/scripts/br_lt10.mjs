import fs from 'fs';
import {open} from '../../testing-tools/qa-session.mjs';
const rd=f=>fs.readFileSync('/tmp/sv10579/'+f,'utf8').trim(); const S=JSON.parse(rd('br-seed.json')); const Y=JSON.parse(rd('br-y.json'));
const s=await open({env:'branch',ticket:'10579',dir:'/tmp/qa1',cookies:{sv_sso_session:rd('sso'),PHPSESSID:rd('phpsess'),cf_clearance:rd('cfc')}});
const post=async(u,b)=>{const r=await s.api(u,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(b)}); console.log('  ',u.replace('/api/',''),r.status,JSON.stringify(r.json||r.text).slice(0,220)); return r;};
const wps=(await s.api('/api/staff/my-workplaces')).json.data.collection; const A=wps.find(w=>w.id===S.A), B=wps.find(w=>w.id===S.B);
const at=L=>post('/api/iam/change-location',{workplace_id:L.id,workplace_timezone:L.timezone});
const f=(x,tz)=>{const p=new Intl.DateTimeFormat('en-GB',{timeZone:tz,day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit',hour12:false}).formatToParts(x).reduce((a,q)=>(a[q.type]=q.value,a),{}); return `${p.day}/${p.month}/${p.year} ${p.hour}:${p.minute}`;};
const board=async()=>{ await at(A); const b=(await s.api('/api/work-orders/board?search='+Y.number+'&showMyWorkOrders=0&fill=12&perGroup=25')).json; const cards=JSON.stringify(b); const m=cards.indexOf(Y.Y); 
  const find=o=>{ if(!o||typeof o!=='object') return null; if(o.id===Y.Y) return o; for(const v of Object.values(o)){const r=find(v); if(r) return r;} return null; }; const c=find(b); return c&&{lt:c.lineTechnicians,ci:c.clockedInTechnicians}; };
console.log('board before',JSON.stringify(await board()));
// control: HD timesheet entry for Stephen Grimes on Y's line
await at(A); const t0=new Date(Date.now()-5*3600e3);
await post('/api/technician-tasks/create',{start_date:f(t0,A.timezone),end_date:f(new Date(t0.getTime()+30*60e3),A.timezone),tech_assigned_id:'21bb7388-2e45-4025-bfd8-a4c2e306e9f6',work_order_id:Y.Y,line_id:Y.yl,resolve_overlaps:true});
console.log('board after HD entry',JSON.stringify(await board()));
process.exit(0);
