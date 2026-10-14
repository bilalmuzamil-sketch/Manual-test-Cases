import {ob,J} from './lib.mjs'; import {loc} from './seed.mjs'; import fs from 'fs';
const A=JSON.parse(fs.readFileSync('A2.json')); const s=await ob(); await loc(s);
const v=await s.api('/api/work-orders/view/'+A.ps_id); const w=v.json?.data?.work_order||{}; console.log('view',v.status,w.status,w.number,w.type||w.work_order_type);
const L=await s.api('/api/work-orders/'+A.ps_id+'/parts/list-requests-by-line'); console.log('parts',J((L.json?.data?.collection||[]).map(l=>[l.status,(l.part_requests||[]).map(x=>[x.id.slice(0,8),x.status,x.quantity])]),300));
const co=(await s.api('/api/customers/view/'+A.company_id)).json.data.company; console.log('counts',J(Object.fromEntries(Object.entries(co).filter(([k])=>/count|deletable/.test(k))),300));
const ps=await s.api('/api/part-sales?limit=50'); const mine=(ps.json?.data?.collection||ps.json?.data?.part_sales||[]).filter(x=>JSON.stringify(x).includes(A.company_id)); console.log('ps for customer',J(mine.map(x=>[x.id,x.number,x.status]),400));
await s.close();
