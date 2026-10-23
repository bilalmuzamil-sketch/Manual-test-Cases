import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs'; import fs from 'fs';
const s=await open({env:'prod',user:'bilal.muzamil@shopview.com',dir:'/tmp/qa21',vp:{width:1440,height:900}});
const P=async(p,b)=>{const r=await s.api(p,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(b)}); console.log('POST',p,r.status,JSON.stringify(r.json||r.text).slice(0,200)); return r;};
const v=(await s.api('/api/work-orders/view/dc958d04-7803-44ac-a841-422f6a551fa6')).json.data.work_order;
const veh=v.vehicle_id||v.vehicle?.id; console.log(JSON.stringify({c:v.company_id,veh,wp:v.workplace_id,cust:v.customer_id}));
const cl=(await s.api('/api/work-orders/canned-lines')).json.data.collection.filter(x=>!x.workplace_id||x.workplace_id===v.workplace_id);
const lab=cl.filter(x=>x.time_estimate>0&&!x.fixed_price&&!x.fixed_line_total&&!x.fixed_line_labor_price);
const fp=cl.find(x=>x.fixed_price&&!x.fixed_line_total); const flt=cl.find(x=>x.fixed_line_total||x.fixed_line_labor_price);
console.log('canned',cl.length,'lab',lab.length,'fp',fp&&fp.canned_line_name,'flt',flt&&flt.canned_line_name);
const pick=[lab[0],lab[1],fp,flt,lab[2]].filter(Boolean); pick.forEach(x=>console.log(' use',x.canned_line_name,x.time_estimate,x.fixed_price,x.fixed_line_total,x.fixed_line_labor_price));
const w=await P('/api/work-orders/create',{company_id:v.company_id,vehicle_id:veh,workplace_id:v.workplace_id,start_date:'2026-10-23',is_vehicle_here:true});
const wo=w.json.data.work_order_id; await P('/api/work-orders/change-customer',{work_order_id:wo,company_id:v.company_id,customer_id:v.customer_id});
const ids=[]; for(const c of pick){ const r=await P(`/api/work-orders/${wo}/lines/create-from-canned-line`,{canned_line_id:c.id,status:'authorized'}); ids.push(r.json?.data?.line_id); }
await P('/api/work-orders/lines/change-lines',{workOrderId:wo,lines:[ids[ids.length-1]],field:'status',value:'authorization_declined'});
const v2=(await s.api('/api/work-orders/view/'+wo)).json.data.work_order; console.log('PROD WO',wo,v2.number,v2.display_number);
fs.writeFileSync('/tmp/qa11685/w/prod-wo.txt',wo); process.exit(0);
