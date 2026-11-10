// SV-12292 matrix on sv12292: running entries moved between work orders; Clocked In shown (names) vs stored count used by the sort
import {sess,post,arr} from './common.mjs'; import fs from 'fs';
const S=JSON.parse(fs.readFileSync('/tmp/sv12292/seed-branch.json','utf8')); const W=S.W;
const s=await sess(); await s.go('/workorders'); await s.page.waitForTimeout(3000); const P=(u,b)=>post(s,u,b); const R={marker:await s.marker(),steps:[]};
await P('/api/iam/change-location',{workplace_id:S.H.id,workplace_timezone:S.H.timezone});
const f=ms=>{const p=new Intl.DateTimeFormat('en-GB',{timeZone:S.H.timezone,day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit',hour12:false}).formatToParts(new Date(Date.now()-ms)).reduce((a,q)=>(a[q.type]=q.value,a),{}); return `${p.day}/${p.month}/${p.year} ${p.hour}:${p.minute}`;};
const row=async k=>{ const w=W[k]; const l=arr((await s.api('/api/work-orders?pagination[page]=1&pagination[rowsPerPage]=20&showMyWorkOrders=0&search='+encodeURIComponent(w.number))).json?.data).find(x=>x.id===w.id); const names=(l?.clockedInTechnicians||[]).map(n=>n.firstName+' '+n.lastName); return {wo:w.number,names,count:l?.clockedInTechniciansCount,match:names.length===l?.clockedInTechniciansCount}; };
const log=async(step,...ks)=>{ for(const k of ks){ const r=await row(k); R.steps.push({step,...r}); console.log((r.match?'MATCH   ':'MISMATCH'),r.wo,step.padEnd(48),JSON.stringify(r.names),'count',r.count); } };
let si=0; const free=[]; const staff=S.staff;
const create=async(k,startMin,endMin,line)=>{ for(;si<staff.length;si++){ const b={start_date:f(startMin*60e3),end_date:endMin==null?null:f(endMin*60e3),work_order_id:W[k].id,tech_assigned_id:staff[si].id,line_id:line||W[k].line}; const r=await P('/api/technician-tasks/create',b); if(r.status<300){ const who=staff[si].name; si++; return {id:r.json.data.id,who}; } } throw new Error('no free staff'); };
const move=async(id,b)=>{ const r=await P('/api/technician-tasks/move',{id,...b}); console.log('   move',r.status,JSON.stringify(r.json).slice(0,120)); R.steps.push({move:r.status,b}); return r.status; };
const to=k=>({work_order_id:W[k].id,line_id:W[k].line});
// 1 A -> B, back, and again
const e1=await create('A',30); R.e1=e1; await log('1 open entry added on A ('+e1.who+')','A','B');
await move(e1.id,to('B')); await log('1 after move A -> B','A','B');
await move(e1.id,to('A')); await log('1 after move back B -> A','A','B');
await move(e1.id,to('B')); await log('1 after moving A -> B again (left for screen)','A','B');
// 2 C: second line on the same work order
const cl=arr((await s.api('/api/work-orders/canned-lines?limit=200')).json?.data).filter(x=>x.workplace_id===S.H.id&&Number(x.total_parts)===0);
await P(`/api/work-orders/${W.C.id}/lines/create-from-canned-line`,{canned_line_id:cl[0].id,status:'authorized'}); const cl2=arr((await s.api('/api/work-orders/lines/'+W.C.id)).json?.data).map(x=>x.line_id).find(x=>x!==W.C.line);
const e2=await create('C',30); await log('2 open entry on C line 1 ('+e2.who+')','C'); await move(e2.id,{work_order_id:W.C.id,line_id:cl2}); await log('2 after move to C line 2 (same WO)','C');
// 3 D -> department
const dep=arr((await s.api('/api/departments')).json?.data).find(d=>d.enable_time_clock); R.dep=dep?.name;
const e3=await create('D',30); await log('3 open entry on D ('+e3.who+')','D'); await move(e3.id,{department_id:dep.id}); await log('3 after move D -> department "'+dep.name+'"','D');
// 4 closed entry E -> A
const e4=await create('E',90,60); await log('4 closed entry on E ('+e4.who+')','E','A'); await move(e4.id,to('A')); await log('4 after closed entry moved E -> A','E','A');
// 5 two open on F, move one to G
const e5=await create('F',30), e6=await create('F',25); await log('5 two open entries on F ('+e5.who+', '+e6.who+')','F','G'); await move(e5.id,to('G')); await log('5 after one moved F -> G','F','G');
R.mismatches=R.steps.filter(x=>x.match===false).length; console.log('MISMATCHES',R.mismatches);
fs.writeFileSync('../ev/branch-matrix.json',JSON.stringify(R,null,1)); await s.close(); process.exit(0);
