// admin clocks out of C2, then for A, D, B2: clock in on the line (recount) -> read row, clock out (recount) -> read row
import {sess,post,arr} from './common.mjs'; import fs from 'fs';
const ENV=process.env.ENV||'branch'; const S=JSON.parse(fs.readFileSync(`/tmp/sv12112/seed-${ENV}.json`,'utf8')); const s=await sess(); await s.go('/workorders'); await s.page.waitForTimeout(3000); const P=(u,b)=>post(s,u,b);
await P('/api/iam/change-location',{workplace_id:S.H.id,workplace_timezone:S.H.timezone});
const row=async w=>{ const l=arr((await s.api('/api/work-orders?pagination[page]=1&pagination[rowsPerPage]=20&search='+encodeURIComponent(w.number)+'&showMyWorkOrders=0')).json?.data).find(x=>x.id===w.id); return {names:(l?.clockedInTechnicians||[]).map(n=>n.firstName+' '+n.lastName),count:l?.clockedInTechniciansCount}; };
const cur=async()=>(await s.api('/api/technician-tasks/my-current-task')).json?.data;
const out=[]; const log=(w,step,r)=>{ out.push({wo:w.number,tag:w.tag,step,...r}); console.log(w.number,step.padEnd(28),'names',JSON.stringify(r.names),'count',r.count); };
const C2=S.W.C2; const me=await cur(); console.log('current task',JSON.stringify(me).slice(0,240));
const recs=arr((await s.api(`/api/technician-tasks/list?pagination[rowsPerPage]=100&pagination[page]=1&filters[0][field]=work_order&filters[0][value]=${C2.id}&search=`)).json?.data); const mine=recs.find(r=>!r.end_date); const recId=mine?.id; const staffId=mine?.staff_id; console.log('C2 open record',recId,staffId);
if(recId){ const o=await P('/api/technician-tasks/check-out',{task_id:recId,tech_story:'ZZAUTOTEST SV-12112',complete_line:false,work_order_id:C2.id}); console.log('C2 clock out',o.status,JSON.stringify(o.json).slice(0,120)); }
log(C2,'after admin clock-out',await row(C2));
const adminStaff=staffId||arr((await s.api('/api/staff?limit=400')).json?.data).find(x=>x.email===process.env.ME_EMAIL)?.staff_id; console.log('admin staff',adminStaff);
for(const t of ['A','D','B2']){ const w=S.W[t]; log(w,'before',await row(w));
  const tk=await P('/api/work-orders/tasks/create',{staff_id:adminStaff,line_id:w.line,work_order_id:w.id}); const tid=tk.json?.data?.id||tk.json?.data?.task_id;
  const ci=await P('/api/technician-tasks/check-in',{task_id:tid,line_id:w.line,work_order_id:w.id,refresh_lines:true}); if(ci.status>=300) console.log(' check-in',ci.status,JSON.stringify(ci.json).slice(0,160));
  log(w,'admin clocked in (recount)',await row(w));
  const o=await P('/api/technician-tasks/check-out',{task_id:ci.json?.data?.id,tech_story:'ZZAUTOTEST SV-12112',complete_line:false,work_order_id:w.id}); if(o.status>=300) console.log(' check-out',o.status,JSON.stringify(o.json).slice(0,160));
  log(w,'admin clocked out (recount)',await row(w)); }
fs.writeFileSync(`/tmp/sv12112/cycle-${ENV}.json`,JSON.stringify(out,null,1)); await s.close(); process.exit(0);
