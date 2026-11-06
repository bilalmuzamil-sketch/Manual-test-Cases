// usage: node matrix.mjs [--prod] -> runs the SV-11249 matrix as org A (Heavy Duty location); prints one verdict line per case and writes ../matrix-<env>.json
import {sess,post} from './common.mjs'; import fs from 'fs'; const I=JSON.parse(fs.readFileSync(process.env.IDS||'../ids.json','utf8'));
const s=await sess(); await s.go('/workorders'); await s.page.waitForTimeout(1500);
const HD=process.env.HD||'b3c8c820-f815-4cf1-8938-10956c5ee71a', LE=process.env.LE||'f8a8b802-7780-4b16-bf10-343caeb616b2', TZ1=process.env.TZ1||'America/Edmonton', TZ2=process.env.TZ2||'America/Edmonton'; const ONLY=process.env.ONLY?process.env.ONLY.split(','):null; const out=[]; let n=8;
const slot=()=>{ n++; const h=String(n%14+6).padStart(2,'0'); const d=n<23?'05':'04'; return {start_date:`${d}/11/2026 ${h}:00`,end_date:`${d}/11/2026 ${h}:30`}; };
const run=async(id,what,url,body,expect)=>{ if(ONLY&&!ONLY.includes(id)) return {}; const r=await post(s,url,body); const ok=expect==='info'?true:expect==='2xx'?(r.status>=200&&r.status<300):(r.status>=400&&r.status<500); const row={id,what,url,status:r.status,body:JSON.stringify(r.json).slice(0,160),expect,verdict:ok?'PASS':'FAIL'}; out.push(row); console.log(row.verdict,id,r.status,what,'|',row.body.slice(0,110)); return r; };
const TC='/api/technician-tasks/create', WT='/api/work-orders/tasks/create', MV='/api/technician-tasks/move';
const tc=(o)=>({tech_assigned_id:I.A_TECH,...slot(),...o});
// technician-tasks/create
await run('C0','valid entry on own WO + line',TC,tc({work_order_id:I.A1,line_id:I.A1L1}),'2xx');
await run('C1','other company work order (with own line)',TC,tc({work_order_id:I.B_WO,line_id:I.A1L1}),'4xx');
await run('C2','other company line (with own WO)',TC,tc({work_order_id:I.A1,line_id:I.B_LINE}),'4xx');
await run('C3','other company work order + its line',TC,tc({work_order_id:I.B_WO,line_id:I.B_LINE}),'4xx');
await run('C4','other company technician',TC,tc({tech_assigned_id:I.B_STAFF,work_order_id:I.A1,line_id:I.A1L1}),'4xx');
await run('C5','other company department (no WO)',TC,tc({department_id:I.B_DEPT}),'4xx');
await run('C6','line that is not on the given WO (same location)',TC,tc({work_order_id:I.A1,line_id:I.A2L1}),'4xx');
await run('C7','own department (no WO)',TC,tc({department_id:I.A_DEPT}),'2xx');
await run('C8','own WO in another location (by design allowed)',TC,tc({work_order_id:I.L1,line_id:I.L1L1}),'2xx');
// work-orders/tasks/create
await run('W0','valid labor row',WT,{work_order_id:I.A1,line_id:I.A1L2,staff_id:I.A_TECH},'2xx');
await run('W1','other company technician',WT,{work_order_id:I.A1,line_id:I.A1L2,staff_id:I.B_STAFF},'4xx');
await run('W2','other company WO + line',WT,{work_order_id:I.B_WO,line_id:I.B_LINE,staff_id:I.A_TECH},'4xx');
await run('W3','other company line on own WO',WT,{work_order_id:I.A1,line_id:I.B_LINE,staff_id:I.A_TECH},'4xx');
await run('W4','line not on the given WO',WT,{work_order_id:I.A1,line_id:I.A2L1,staff_id:I.A_TECH},'4xx');
await run('W5','own WO in another location',WT,{work_order_id:I.L1,line_id:I.L1L1,staff_id:I.A_TECH},'4xx');
// move: make fresh entries
const mk=async()=>{ const r=await post(s,TC,tc({work_order_id:I.A1,line_id:I.A1L1})); return r.json?.data?.id; };
await run('M0','move own entry to own WO+line',MV,{id:await mk(),work_order_id:I.A2,line_id:I.A2L1},'2xx');
await run('M1','move to other company WO + line',MV,{id:await mk(),work_order_id:I.B_WO,line_id:I.B_LINE},'4xx');
await run('M2','move to own WO + other company line',MV,{id:await mk(),work_order_id:I.A1,line_id:I.B_LINE},'4xx');
await run('M3','move to own WO + a line from another WO',MV,{id:await mk(),work_order_id:I.A1,line_id:I.A2L1},'4xx');
await run('M4','move with WO but no line',MV,{id:await mk(),work_order_id:I.A1},'4xx');
await run('M5','move to other company department',MV,{id:await mk(),department_id:I.B_DEPT},'4xx');
await run('M6','move own entry to own department',MV,{id:await mk(),department_id:I.A_DEPT},'2xx');
await run('M7','move with WO + made-up line id',MV,{id:await mk(),work_order_id:I.A1,line_id:'00000000-0000-4000-8000-000000000000'},'4xx');
await run('C9','technician based in the other location, own WO+line',TC,{tech_assigned_id:I.L_TECH,...slot(),work_order_id:I.A1,line_id:I.A1L1},'info');
await run('W6','labor row for a technician based in the other location, own WO',WT,{work_order_id:I.A2,line_id:I.A2L1,staff_id:I.L_TECH},'info');
await run('M9B','move own entry to own WO+line in the other location (destination = organization boundary, by design)',MV,{id:await mk(),work_order_id:I.L1,line_id:I.L1L1},'2xx');
// entry from another location
await post(s,'/api/iam/change-location',{workplace_id:LE,workplace_timezone:TZ2}); const le=await post(s,TC,{tech_assigned_id:I.L_TECH,...slot(),work_order_id:I.L1,line_id:I.L1L1}); console.log('lethbridge entry',le.status,JSON.stringify(le.json).slice(0,120));
await post(s,'/api/iam/change-location',{workplace_id:HD,workplace_timezone:TZ1});
await run('M8','move an entry from another location to a department',MV,{id:le.json?.data?.id,department_id:I.A_DEPT},'4xx');
fs.writeFileSync((process.env.MOUT||'../matrix-branch.json'),JSON.stringify(out,null,1)); console.log('PASS',out.filter(x=>x.verdict==='PASS').length,'of',out.length);
await s.close(); process.exit(0);
