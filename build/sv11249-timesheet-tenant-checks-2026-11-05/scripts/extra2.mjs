// usage: node extra2.mjs -> org A: move with a MADE-UP WO id + own department, and made-up line + own department (compare with M9/M11); then org B: prints the tasks on B's line
import {sess,post} from './common.mjs'; import fs from 'fs'; const I=JSON.parse(fs.readFileSync('../ids.json','utf8')); const Z='00000000-0000-4000-8000-000000000000';
const s=await sess(); await s.go('/workorders'); await s.page.waitForTimeout(1200); let h=6;
const mk=async()=>{ h++; const r=await post(s,'/api/technician-tasks/create',{tech_assigned_id:I.A_TECH,start_date:`02/11/2026 ${String(h).padStart(2,'0')}:00`,end_date:`02/11/2026 ${String(h).padStart(2,'0')}:30`,work_order_id:I.A1,line_id:I.A1L1}); return r.json?.data?.id; };
for(const [id,what,b] of [['M12','made-up WO + own department',{work_order_id:Z,department_id:I.A_DEPT}],['M13','made-up line only + own department',{line_id:Z,department_id:I.A_DEPT}]]){
 const e=await mk(); const r=await post(s,'/api/technician-tasks/move',{id:e,...b}); console.log(id,r.status,what,'|',JSON.stringify(r.json).slice(0,140)); }
await s.close(); process.env.ORG='B'; const t=await sess({dir:'/tmp/qa88'}); const l=await t.api(`/api/work-orders/lines/${I.B_WO}`); const c=l.json?.data?.collection||[]; console.log('B line tasks',JSON.stringify(c.map(x=>x.tasks)).slice(0,600));
await t.close(); process.exit(0);
