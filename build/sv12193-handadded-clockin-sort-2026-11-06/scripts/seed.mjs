// creates the test work orders (Heavy Duty) and a staff pool; writes /tmp/sv12193/seed-<env>.json
import {sess,post,arr} from './common.mjs'; import fs from 'fs';
const ENV=process.env.ENV||'branch'; const s=await sess(); await s.go('/workorders'); await s.page.waitForTimeout(3000); const P=(u,b)=>post(s,u,b);
const wps=arr((await s.api('/api/staff/my-workplaces')).json?.data); const H=wps.find(w=>w.name.match(process.env.HOME_NAME||'Heavy Duty')), O=wps.find(w=>w!==H);
await P('/api/iam/change-location',{workplace_id:H.id,workplace_timezone:H.timezone});
const any=arr((await s.api('/api/work-orders?pagination[page]=1&pagination[rowsPerPage]=30&showMyWorkOrders=0')).json?.data).find(x=>x.workplace_id===H.id||true);
const v0=(await s.api('/api/work-orders/view/'+any.id)).json.data; const wo0=v0.work_order||v0; const company=process.env.COMPANY||wo0.company_id||wo0.company?.id;
const veh=arr((await s.api('/api/vehicles?company_id='+company)).json?.data); const vid=veh[0]?.id;
const cl=arr((await s.api('/api/work-orders/canned-lines?limit=200')).json?.data).filter(x=>x.workplace_id===H.id&&Number(x.total_parts)===0);
const staff=arr((await s.api('/api/staff?limit=400')).json?.data).filter(x=>x.is_active!==false&&x.staff_id&&/Technician|Foreman/i.test(x.role_label||'')).map(x=>({id:x.staff_id,name:x.first_name+' '+x.last_name,role:x.role_label}));
const mk=async tag=>{ const c=await P('/api/work-orders/create',{company_id:company,vehicle_id:vid,workplace_id:H.id,start_date:new Date().toISOString().slice(0,10),is_vehicle_here:true}); const id=c.json.data.work_order_id;
  await P(`/api/work-orders/${id}/lines/create-from-canned-line`,{canned_line_id:cl[0].id,status:'authorized'}); const lr=arr((await s.api('/api/work-orders/lines/'+id)).json?.data); const v=(await s.api('/api/work-orders/view/'+id)).json.data; return {tag,id,line:lr[0].line_id,number:(v.work_order||v).display_number||(v.work_order||v).number}; };
const tags={W1:'1 open, added on screen',W2:'2 open, added by hand',W3:'added by hand WITH an End time',W4:'open, then End added by Edit',W5:'open, then moved to W6 by Edit',W6:'receives the moved entry',W7:'open, added from the other location',W8:'clocked in with the line Start button',W9:'no clock-ins'};
const W={}; for(const [k,t] of Object.entries(tags)) W[k]=await mk(t);
fs.writeFileSync(`/tmp/sv12193/seed-${ENV}.json`,JSON.stringify({H,O,company,staff,W},null,1));
console.log('company',company,'staff',staff.length,staff.slice(0,10).map(x=>x.name).join('; ')); console.log(Object.entries(W).map(([k,w])=>k+'='+w.number).join(' '));
await s.close(); process.exit(0);
