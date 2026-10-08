import {ob,j} from './lib.mjs'; import fs from 'fs';
const s=await ob(); console.log(j(await s.marker()));
for(const k of ['A','B','C']){ const {wo}=JSON.parse(fs.readFileSync(`wo-${k}.json`));
  const ls=(await s.api('/api/work-orders/lines/'+wo)).json?.data?.collection||[];
  const num=ls[0]?.work_order_number||'';
  console.log(k,wo.slice(0,8),'lines',ls.length, j(ls.map(l=>({line:(l.title||l.name||'').slice(0,25),status:l.status,parts:(l.part_requests||[]).map(r=>[r.part_number,r.status,r.quantity,r.on_hand_quantity])})),900));
}
for(const n of ['S10599-17580','S10599-17581','S10599-17582']){ const w=(await s.api('/api/work-orders?limit=100&search='+n)).json?.data?.work_orders||[]; console.log('list',n,j(w.map(x=>({n:x.number,id:x.id,inStock:x.statusInStock,auth:x.statusAuthToOrderCount,req:x.statusRequestedCount}))));}
const psl=await s.api('/api/part-sales?limit=50&search=ZZ'); console.log('partsales',psl.status,j(psl.json,600));
await s.close();
