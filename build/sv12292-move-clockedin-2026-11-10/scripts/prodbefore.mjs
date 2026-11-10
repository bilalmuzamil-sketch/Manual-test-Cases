// Production BEFORE: an open entry moved WO A -> WO B through the back end; read both list rows (names shown vs sort count)
import {sess,post,arr} from './common.mjs'; import fs from 'fs';
const s=await sess(); await s.go('/workorders'); await s.page.waitForTimeout(4000); const P=(u,b)=>post(s,u,b); const R={marker:await s.marker()};
const me=(await s.api('/api/auth/me')).json?.data; const wps=arr((await s.api('/api/staff/my-workplaces')).json?.data); R.wps=wps.map(w=>w.name+' '+w.timezone);
const row=async id=>{ const l=arr((await s.api('/api/work-orders?pagination[page]=1&pagination[rowsPerPage]=50&showMyWorkOrders=0&search='+encodeURIComponent(id.number))).json?.data).find(x=>x.id===id.id); const names=(l?.clockedInTechnicians||[]).map(n=>n.firstName+' '+n.lastName); return {wo:id.number,names,count:l?.clockedInTechniciansCount}; };
let H,pick=[]; for(const w of wps){ await P('/api/iam/change-location',{workplace_id:w.id,workplace_timezone:w.timezone}); const wos=arr((await s.api('/api/work-orders?pagination[page]=1&pagination[rowsPerPage]=100&showMyWorkOrders=0')).json?.data).filter(x=>(x.clockedInTechniciansCount||0)===0&&!(x.clockedInTechnicians||[]).length&&!/complete|invoic|paid|declin|estimate|cancel/i.test(x.status||''));
  pick=[]; for(const x of wos){ const lines=arr((await s.api('/api/work-orders/lines/'+x.id)).json?.data); if(lines.length) pick.push({id:x.id,number:x.number||x.display_number,line:lines[0].line_id,status:x.status}); if(pick.length===2) break; } if(pick.length===2){ H=w; break; } }
R.location=H.name;
const [A,B]=pick; R.A=A.number; R.B=B.number;
const staff=arr((await s.api('/api/staff?limit=400')).json?.data).filter(x=>x.is_active!==false&&x.staff_id);
const open=arr((await s.api('/api/technician-tasks/list?pagination[rowsPerPage]=200&pagination[page]=1&search=')).json?.data).filter(x=>!x.end_date).map(x=>x.staff_id||x.tech_assigned_id);
const f=ms=>{const p=new Intl.DateTimeFormat('en-GB',{timeZone:H.timezone,day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit',hour12:false}).formatToParts(new Date(Date.now()-ms)).reduce((a,q)=>(a[q.type]=q.value,a),{}); return `${p.day}/${p.month}/${p.year} ${p.hour}:${p.minute}`;};
let c,t; for(const x of staff.filter(x=>/ZZAUTOTEST/i.test(x.first_name+' '+x.last_name)).concat(staff.filter(x=>!/ZZAUTOTEST/i.test(x.first_name+' '+x.last_name)&&x.email!==me?.email))){ c=await P('/api/technician-tasks/create',{start_date:f(20*60e3),end_date:null,work_order_id:A.id,tech_assigned_id:x.staff_id,line_id:A.line}); if(c.status<300){ t=x; break; } }
R.staff=t.first_name+' '+t.last_name; R.create=c.status+' '+JSON.stringify(c.json).slice(0,150);
R.s1=[await row(A),await row(B)];
const m=await P('/api/technician-tasks/move',{id:c.json?.data?.id,work_order_id:B.id,line_id:B.line}); R.move=m.status+' '+JSON.stringify(m.json).slice(0,150);
R.s2=[await row(A),await row(B)];
fs.writeFileSync('../ev/prod-before.json',JSON.stringify(R,null,1)); console.log(JSON.stringify(R,null,1).slice(0,2500));
await s.close(); process.exit(0);
