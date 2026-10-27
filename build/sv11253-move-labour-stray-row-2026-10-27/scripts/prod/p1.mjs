import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs'; import fs from 'fs';
const s=await open({env:'prod',user:'bilal.muzamil@shopview.com',dir:'/tmp/qa21',vp:{width:1600,height:1100}});
const J=(p,b,m='POST')=>s.api(p,{method:m,headers:{'content-type':'application/json'},body:JSON.stringify(b)});
let r=await s.api('/api/auth/me/fe-permissions'); console.log('woMoveLabor',r.json.data.fe_permissions.includes('woMoveLabor'));
r=await s.api('/api/staff/my-workplaces'); console.log('wps',JSON.stringify(r.json.data.collection.map(w=>[w.id,w.name])).slice(0,300));
r=await s.api('/api/work-orders?pagination[page]=1&pagination[rowsPerPage]=30'); const ws=r.json.data.work_orders; 
let src=null; for(const w of ws){ const v=(await s.api('/api/work-orders/view/'+w.id)).json?.data?.work_order; if(v?.vehicle?.id){src=v;break;} }
console.log('src',src.display_number,src.company_name,src.workplace_id);
r=await s.api('/api/work-orders/canned-lines?limit=300'); const cl=(r.json?.data?.collection||r.json?.data||[]).filter(c=>!c.fixed_price&&c.labour_type_id&&!c.total_parts&&c.workplace_id===src.workplace_id); console.log('canned',cl.length,cl.slice(0,3).map(c=>c.canned_line_name));
r=await J('/api/work-orders/create',{company_id:src.company_id,customer_id:src.customer_id,vehicle_id:src.vehicle.id,workplace_id:src.workplace_id,start_date:new Date().toISOString().slice(0,10),is_vehicle_here:true,type:'service'}); console.log('wo',r.status,JSON.stringify(r.json).slice(0,200));
const wo=r.json.data.work_order_id; const lines=[];
for(const c of cl.slice(0,3)){ r=await J(`/api/work-orders/${wo}/lines/create-from-canned-line`,{canned_line_id:c.id,status:'authorized'}); console.log('line',r.status,JSON.stringify(r.json).slice(0,120)); lines.push(r.json.data.line_id); }
r=await s.api('/api/work-orders/view/'+wo); const num=r.json.data.work_order.display_number; console.log('number',num);
fs.writeFileSync('../../data/prod-wo.json',JSON.stringify({wo,lines,number:num,workplace:src.workplace_id},null,1));
await s.browser.close(); process.exit(0);
