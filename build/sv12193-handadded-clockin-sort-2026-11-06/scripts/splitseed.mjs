import {sess,post,arr} from './common.mjs'; import fs from 'fs';
const S=JSON.parse(fs.readFileSync('/tmp/sv12193/seed-branch.json','utf8')); const s=await sess(); await s.go('/workorders'); await s.page.waitForTimeout(3000); const P=(u,b)=>post(s,u,b);
await P('/api/iam/change-location',{workplace_id:S.H.id,workplace_timezone:S.H.timezone});
const veh=arr((await s.api('/api/vehicles?company_id='+S.company)).json?.data); const cl=arr((await s.api('/api/work-orders/canned-lines?limit=200')).json?.data).filter(x=>x.workplace_id===S.H.id&&Number(x.total_parts)===0);
const X={}; for(const k of ['X1','X2','X3']){ const c=await P('/api/work-orders/create',{company_id:S.company,vehicle_id:veh[0].id,workplace_id:S.H.id,start_date:new Date().toISOString().slice(0,10),is_vehicle_here:true}); const id=c.json.data.work_order_id;
  for(const i of [0,1]) await P(`/api/work-orders/${id}/lines/create-from-canned-line`,{canned_line_id:cl[i%cl.length].id,status:'authorized'});
  const lr=arr((await s.api('/api/work-orders/lines/'+id)).json?.data); const v=(await s.api('/api/work-orders/view/'+id)).json.data; X[k]={id,lines:lr.map(l=>({id:l.line_id,name:(l.number||'')+' '+(l.title||l.name||'')})),number:(v.work_order||v).display_number||(v.work_order||v).number}; }
// free the admin: clock out of any open entry
const cur=(await s.api('/api/technician-tasks/my-current-task')).json?.data; const tid=cur?.technician_task?.id; if(tid){ const o=await P('/api/technician-tasks/check-out',{task_id:tid,tech_story:'ZZAUTOTEST SV-12193',complete_line:false,work_order_id:S.W.W8.id}); console.log('admin out of W8',o.status); }
S.X=X; fs.writeFileSync('/tmp/sv12193/seed-branch.json',JSON.stringify(S,null,1)); console.log(JSON.stringify(X,null,1).slice(0,1500)); await s.close(); process.exit(0);
