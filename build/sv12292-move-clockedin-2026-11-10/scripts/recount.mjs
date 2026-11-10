import {sess,post,arr} from './common.mjs'; import fs from 'fs';
const S=JSON.parse(fs.readFileSync('/tmp/sv12292/seed-branch.json','utf8')); const s=await sess(); await s.go('/workorders'); await s.page.waitForTimeout(3000); const P=(u,b)=>post(s,u,b);
const cur=(await s.api('/api/technician-tasks/my-current-task')).json?.data; console.log('current',JSON.stringify(cur).slice(0,160));
const out=async(w,id)=>{const o=await P('/api/technician-tasks/check-out',{task_id:id,tech_story:'ZZAUTOTEST SV-12193',complete_line:false,work_order_id:w.id}); console.log('out',w.number,o.status);};
const recs=arr((await s.api(`/api/technician-tasks/list?pagination[rowsPerPage]=100&pagination[page]=1&filters[0][field]=work_order&filters[0][value]=${S.W.W8.id}&search=`)).json?.data).filter(r=>!r.end_date);
for(const r of recs) await out(S.W.W8,r.id);
const tk=await P('/api/work-orders/tasks/create',{line_id:S.W.W5.line,work_order_id:S.W.W5.id}); const ci=await P('/api/technician-tasks/check-in',{task_id:tk.json?.data?.id||tk.json?.data?.task_id,line_id:S.W.W5.line,work_order_id:S.W.W5.id,refresh_lines:true}); console.log('W5 in',tk.status,ci.status); await out(S.W.W5,ci.json?.data?.id);
await s.close(); process.exit(0);
