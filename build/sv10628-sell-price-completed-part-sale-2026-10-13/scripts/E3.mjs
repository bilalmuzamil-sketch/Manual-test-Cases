import {ob,J} from './lib.mjs';
const s=await ob({dpr:1}); await s.api('/api/iam/change-location',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({workplace_id:'b3c8c820-f815-4cf1-8938-10956c5ee71a',workplace_timezone:'America/Edmonton'})});
const r=await s.api('/api/work-orders?pagination%5BrowsPerPage%5D=100&pagination%5Bpage%5D=1&filters%5B0%5D%5Bfield%5D=status&filters%5B0%5D%5Bvalue%5D=complete&search=&showMyWorkOrders=0');
const c=r.json.data.work_orders.filter(x=>x.partRequestsCount>0&&x.partRequestsCount<6).slice(0,6);
for(const x of c){ const l=(await s.api('/api/work-orders/lines/'+x.id)).json; const parts=(l.collection||l.data?.collection||[]).flatMap(li=>li.parts||[]); console.log(x.number,x.id,x.companyName,'parts:',parts.map(p=>[p.part_number,p.status,p.part_source_type,p.sell_price].join(':')).join(' ; ').slice(0,250)); }
await s.close();
