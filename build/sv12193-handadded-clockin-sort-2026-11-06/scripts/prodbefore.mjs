// production: add one open time entry by hand (same request the New Timesheet window sends) on S2-1921, read the list row before/after
import {sess,post,arr} from './common.mjs'; import fs from 'fs';
const S=JSON.parse(fs.readFileSync('/tmp/sv12112/seed-prod.json','utf8')); const W=S.W.E; const s=await sess(); await s.go('/workorders'); await s.page.waitForTimeout(4000); const P=(u,b)=>post(s,u,b);
console.log('marker',JSON.stringify(await s.marker())); await P('/api/iam/change-location',{workplace_id:S.H.id,workplace_timezone:S.H.timezone});
const list=async()=>arr((await s.api('/api/work-orders?pagination[page]=1&pagination[rowsPerPage]=30&pagination[sortBy]=clockedInTechnicians&pagination[descending]=true&search=S2-192&showMyWorkOrders=0')).json?.data).map(x=>x.number+':'+(x.clockedInTechnicians||[]).length+'shown/'+x.clockedInTechniciansCount+'counted');
console.log('before',JSON.stringify(await list()));
const staff=arr((await s.api('/api/staff?limit=400')).json?.data).filter(x=>x.is_active!==false&&x.staff_id&&/Technician/i.test(x.role_label||''));
const f=ms=>{const p=new Intl.DateTimeFormat('en-GB',{timeZone:S.H.timezone,day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit',hour12:false}).formatToParts(new Date(Date.now()-ms)).reduce((a,q)=>(a[q.type]=q.value,a),{}); return `${p.day}/${p.month}/${p.year} ${p.hour}:${p.minute}`;};
for(const st of staff){ const r=await P('/api/technician-tasks/create',{start_date:f(20*60e3),end_date:null,work_order_id:W.id,tech_assigned_id:st.staff_id,line_id:W.line}); console.log('create',st.first_name,st.last_name,r.status,JSON.stringify(r.json).slice(0,100)); if(r.status<300) break; }
console.log('after',JSON.stringify(await list())); await s.close(); process.exit(0);
