import {sess,post,arr} from './common.mjs'; import fs from 'fs';
const s=await sess(); await s.go('/workorders'); await s.page.waitForTimeout(3000); const P=(u,b)=>post(s,u,b);
const ws=arr((await s.api('/api/staff/my-workplaces')).json?.data); const W=ws.find(w=>w.id.startsWith('b3c8c820'))||ws[0]; await P('/api/iam/change-location',{workplace_id:W.id,workplace_timezone:W.timezone});
let veh,company; for(const c of arr((await s.api('/api/customers?limit=30')).json?.data)){ const v=arr((await s.api('/api/vehicles?company_id='+c.id)).json?.data); if(v.length){veh=v[0];company=c.id;break;} }
const cl=arr((await s.api('/api/work-orders/canned-lines?limit=200')).json?.data).filter(x=>x.workplace_id===W.id&&Number(x.total_parts)===0);
const c=await P('/api/work-orders/create',{company_id:company,vehicle_id:veh.id,workplace_id:W.id,start_date:new Date().toISOString().slice(0,10),is_vehicle_here:true}); const id=c.json.data.work_order_id;
const l=await P(`/api/work-orders/${id}/lines/create-from-canned-line`,{canned_line_id:cl[0].id,status:'authorized'});
const v=(await s.api('/api/work-orders/view/'+id)).json.data; const w=v.work_order||v; console.log('WO',w.display_number||w.number,id,'line',l.status); fs.writeFileSync('/tmp/sv9570-branch-wo.json',JSON.stringify({id,num:w.display_number||w.number})); await s.close(); process.exit(0);
