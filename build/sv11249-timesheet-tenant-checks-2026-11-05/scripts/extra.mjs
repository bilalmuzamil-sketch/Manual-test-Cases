// usage: node extra.mjs -> org A: move with a foreign WO + own department, foreign WO + own line, foreign line only; then (ORG B session) reads B's work order lines + timesheet to prove nothing was written there
import {sess,post} from './common.mjs'; import fs from 'fs'; const I=JSON.parse(fs.readFileSync('../ids.json','utf8'));
const s=await sess(); await s.go('/workorders'); await s.page.waitForTimeout(1200); let h=6;
const mk=async()=>{ h++; const r=await post(s,'/api/technician-tasks/create',{tech_assigned_id:I.A_TECH,start_date:`03/11/2026 ${String(h).padStart(2,'0')}:00`,end_date:`03/11/2026 ${String(h).padStart(2,'0')}:30`,work_order_id:I.A1,line_id:I.A1L1}); return r.json?.data?.id; };
for(const [id,what,b] of [['M9','foreign WO + own department',{work_order_id:I.B_WO,department_id:I.A_DEPT}],['M10','foreign WO + own line',{work_order_id:I.B_WO,line_id:I.A1L1}],['M11','foreign line only, no WO',{line_id:I.B_LINE,department_id:I.A_DEPT}]]){
 const e=await mk(); const r=await post(s,'/api/technician-tasks/move',{id:e,...b}); console.log(id,r.status,what,'|',JSON.stringify(r.json).slice(0,140)); }
await s.close(); process.env.ORG='B'; const t=await sess({dir:'/tmp/qa88'}); const l=await t.api(`/api/work-orders/lines/${I.B_WO}`); const c=l.json?.data?.collection||[]; console.log('B lines',l.status,c.map(x=>x.line_id+' tasks='+(x.tasks||[]).length+' tech_time='+x.tech_time).join(' | '));
await t.close(); process.exit(0);
