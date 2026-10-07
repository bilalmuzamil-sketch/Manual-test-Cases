import {ob,j} from './lib.mjs'; import fs from 'fs';
const C=JSON.parse(fs.readFileSync('cust.json')); const IP=JSON.parse(fs.readFileSync('invparts.json')).find(x=>x.part_number==='84-2005');
const s=await ob(); const P=(u,b)=>s.api(u,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(b)});
const c=await P('/api/part-sales',{company_id:C.company_id}); console.log('create',c.status,j(c.json,200)); const ps=c.json?.data?.[0]?.id||c.json?.data?.id;
const r=await P('/api/work-orders/part/make-request',{work_order:ps,description:IP.name,part_number:IP.part_number,quantity:1,part_source_type:'inventory',is_authorized:true,part_category_id:IP.category,inventory_part_id:IP.id,sell_price:IP.sell_price}); console.log('make no line',r.status,j(r.json,200));
const l=await s.api(`/api/work-orders/${ps}/parts/list-requests-by-line`); console.log('lines',j(l.json,400));
fs.writeFileSync('ps.json',JSON.stringify({ps})); await s.close();
