import {ob,j} from './lib.mjs'; import fs from 'fs';
const {id}=JSON.parse(fs.readFileSync('ps.json')); const s=await ob();
const l=await s.api('/api/part-sales?limit=100'); const all=l.json?.data?.partSales||[]; console.log('n',all.length,'keys',Object.keys(all[0]||{}).join(','));
const me=all.find(x=>x.id===id||x.work_order_id===id||x.orderId===id); console.log('mine',j(me,700));
const v=(await s.api('/api/work-orders/lines/'+id)).json?.data?.collection?.flatMap(l=>(l.part_requests||[]).map(r=>[r.part_number,r.status,r.quantity,r.on_hand_quantity])); console.log('parts',j(v));
await s.close();
