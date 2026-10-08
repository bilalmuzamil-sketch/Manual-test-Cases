import {op,j} from './lib.mjs'; import fs from 'fs';
const S=JSON.parse(fs.readFileSync('prod/setup.json')); const C=S.pick;
const s=await op(); const P=(u,b)=>s.api(u,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(b)});
await P('/api/iam/change-location',{workplace_id:'b617914c-16e9-4485-8e8b-193cd86aa416',workplace_timezone:'Africa/Accra'});
const INV=[{id:'0192beff-2385-4069-814c-ed1415dadeb0',pn:'1238042',name:'A256',cat:'00e200b1-59fe-4c4a-88a1-952a6d38fee0',sell:80.37},{id:'022d1f00-bfca-4951-82b0-5b92226aa635',pn:'1237932',name:'A146',cat:'00e200b1-59fe-4c4a-88a1-952a6d38fee0',sell:77.94}];
const c=await P('/api/part-sales',{company_id:C.company_id}); const ps=c.json?.data?.[0]?.id||c.json?.data?.id; console.log('create',c.status,ps,c.status>=300?j(c.json,200):'');
for(const p of INV){ const r=await P('/api/work-orders/part/make-request',{work_order:ps,description:p.name,part_number:p.pn,quantity:1,part_source_type:'inventory',is_authorized:true,part_category_id:p.cat,inventory_part_id:p.id,sell_price:p.sell}); console.log('add',p.pn,r.status,r.status>=300?j(r.json,200):''); }
let l=await s.api(`/api/work-orders/${ps}/parts/list-requests-by-line`); console.log('lines',j(l.json,500));
fs.writeFileSync('prod/ps.json',JSON.stringify({ps}));
await s.close();
