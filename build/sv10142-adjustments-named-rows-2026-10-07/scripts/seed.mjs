import {ob,j} from './lib.mjs'; import fs from 'fs';
const label=process.argv[2]||'A'; const C=JSON.parse(fs.readFileSync('cust.json')); const np=JSON.parse(fs.readFileSync('np.json'));
const s=await ob(); const WP='b3c8c820-f815-4cf1-8938-10956c5ee71a';
const P=(u,b)=>s.api(u,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(b)});
const cr=await P('/api/work-orders/create',{company_id:C.company_id,customer_id:C.contact.id,vehicle_id:C.vehicle.id,workplace_id:WP,start_date:new Date().toISOString().slice(0,10),is_vehicle_here:true});
const wo=cr.json?.data?.work_order_id||cr.json?.work_order_id; console.log('create',cr.status,wo);
console.log('mileage',(await P('/api/work-orders/change-mileage',{work_order_id:wo,mileage:'123456'})).status);
const pick=[np.find(x=>/Battery/.test(x.canned_line_name)),np.find(x=>/Full grease/.test(x.canned_line_name)),np.find(x=>/PDI/.test(x.canned_line_name))];
const lines=[];
for(const cl of pick){ const r=await P(`/api/work-orders/${wo}/lines/create-from-canned-line`,{canned_line_id:cl.id,status:'authorized'}); lines.push(r.json?.data?.line_id||r.json?.line_id); console.log('line',r.status,cl.canned_line_name); }
const parts=[];
const IP=JSON.parse(fs.readFileSync('invparts.json')).filter(x=>['84-2005','MD668D'].includes(x.part_number));
for(const ip of IP){
  const r=await P('/api/work-orders/part/make-request',{work_order:wo,line:lines[0],description:ip.name||ip.part_number,part_number:ip.part_number,quantity:1,part_source_type:'inventory',is_authorized:true,part_category_id:ip.category,inventory_part_id:ip.id,sell_price:ip.sell_price,cost:ip.purchase_price_value||ip.purchase_price});
  console.log('part',r.status,j(r.json,160)); }
await s.page.waitForTimeout(1500);
const L=await s.api('/api/work-orders/lines/'+wo); for(const l of L.json.data.collection) for(const p of (l.part_requests||[])) parts.push({id:p.id,pn:p.part_number,sell:p.sell_price,st:p.status});
const pk=await P(`/api/work-orders/${wo}/pick-inventory-parts`,{part_request_ids:parts.map(p=>p.id)}); console.log('pick',pk.status,j(pk.json,200));
console.log('parts',j(parts,300));
fs.writeFileSync(`wo-${label}.json`,JSON.stringify({wo,lines,parts}));
await s.close();
