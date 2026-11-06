import {sess,post,arr} from './common.mjs'; import fs from 'fs';
const ENV=process.env.ENV||'branch'; const S=JSON.parse(fs.readFileSync(`/tmp/sv12193/seed-${ENV}.json`,'utf8')); const W=S.W; const st=n=>S.staff.find(x=>x.name===n).id;
const s=await sess(); await s.go('/workorders'); await s.page.waitForTimeout(3000); const P=(u,b)=>post(s,u,b);
const at=L=>P('/api/iam/change-location',{workplace_id:L.id,workplace_timezone:L.timezone}); await at(S.H);
const f=(ms)=>{const p=new Intl.DateTimeFormat('en-GB',{timeZone:S.H.timezone,day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit',hour12:false}).formatToParts(new Date(Date.now()-ms)).reduce((a,q)=>(a[q.type]=q.value,a),{}); return `${p.day}/${p.month}/${p.year} ${p.hour}:${p.minute}`;};
const row=async w=>{ const l=arr((await s.api('/api/work-orders?pagination[page]=1&pagination[rowsPerPage]=20&search='+encodeURIComponent(w.number)+'&showMyWorkOrders=0')).json?.data).find(x=>x.id===w.id); const names=(l?.clockedInTechnicians||[]).map(n=>n.firstName+' '+n.lastName); return {names,count:l?.clockedInTechniciansCount,match:names.length===l?.clockedInTechniciansCount}; };
const out=[]; const log=async(k,step)=>{ const r=await row(W[k]); out.push({k,wo:W[k].number,step,...r}); console.log(W[k].number,step.padEnd(42),JSON.stringify(r.names),'count',r.count,r.match?'MATCH':'MISMATCH'); };
const create=async(k,name,startMin,endMin)=>{ const b={start_date:f(startMin*60e3),end_date:endMin==null?null:f(endMin*60e3),work_order_id:W[k].id,tech_assigned_id:st(name),line_id:W[k].line}; const r=await P('/api/technician-tasks/create',b); if(r.status>=300) console.log(' create',r.status,JSON.stringify(r.json).slice(0,200)); return {id:r.json?.data?.id,b}; };
// W2: two people open
await create('W2','Stephen Grimes',50); await log('W2','1st open entry (Stephen Grimes)'); await create('W2','Craig Mckee',45); await log('W2','2nd open entry (Craig Mckee)');
// W3: with End time
await create('W3','Brandi Smith',90,30); await log('W3','entry WITH End time (closed)');
// W4: open, then End added by Edit
const e4=await create('W4','Karen Peck',60); await log('W4','open entry (Karen Peck)');
let r=await P('/api/technician-tasks/change',{id:e4.id,start_date:e4.b.start_date,end_date:f(5*60e3),tech_assigned_id:st('Karen Peck'),description:'ZZAUTOTEST SV-12193',work_order_id:W.W4.id,line_id:W.W4.line}); console.log(' change(end)',r.status,JSON.stringify(r.json).slice(0,120));
r=await P('/api/technician-tasks/move',{id:e4.id,line_id:W.W4.line,work_order_id:W.W4.id}); console.log(' move',r.status);
await log('W4','after Edit adds an End time');
// W5 -> W6 move
const e5=await create('W5','John Ortiz',55); await log('W5','open entry (John Ortiz)'); await log('W6','before the move');
r=await P('/api/technician-tasks/change',{id:e5.id,start_date:e5.b.start_date,end_date:null,tech_assigned_id:st('John Ortiz'),description:'ZZAUTOTEST SV-12193',work_order_id:W.W6.id,line_id:W.W6.line}); console.log(' change(wo)',r.status,JSON.stringify(r.json).slice(0,120));
r=await P('/api/technician-tasks/move',{id:e5.id,line_id:W.W6.line,work_order_id:W.W6.id}); console.log(' move',r.status,JSON.stringify(r.json).slice(0,120));
await log('W5','after the entry is moved away'); await log('W6','after the entry is moved here');
// W7 from the other location
await at(S.O); await create('W7','Emily Madden',40); await at(S.H); await log('W7','open entry added while at the other location');
// W8 line Start button path for Dylan Rush
const tk=await P('/api/work-orders/tasks/create',{staff_id:st('Dylan Rush'),line_id:W.W8.line,work_order_id:W.W8.id}); const tid=tk.json?.data?.id||tk.json?.data?.task_id;
const ci=await P('/api/technician-tasks/check-in',{task_id:tid,line_id:W.W8.line,work_order_id:W.W8.id,refresh_lines:true}); console.log(' task',tk.status,'check-in',ci.status,JSON.stringify(ci.json).slice(0,120));
await log('W8','after Start (clock in on the line)');
fs.writeFileSync(`/tmp/sv12193/variants-${ENV}.json`,JSON.stringify({out,ci:ci.json?.data?.id},null,1)); fs.writeFileSync('../ev/variants-'+ENV+'.json',JSON.stringify(out,null,1));
await s.close(); process.exit(0);
