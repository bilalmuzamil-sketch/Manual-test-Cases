import {ob,J} from './lib.mjs'; import {loc} from './seed.mjs'; import {receiveUI} from './recv.mjs'; import fs from 'fs';
const A=JSON.parse(fs.readFileSync(process.argv[2]+'.json')); const s=await ob(); await loc(s);
const plan=JSON.parse(process.argv[3]); // e.g. [[1,"INV-A"],[2,"INV-B"]]
let i=0; for(const [q,inv] of plan){ i++; await receiveUI(s,A.orderId,q,inv,`${A.tag}-recv${i}`);
  const o=(await s.api('/api/inventory/orders/'+A.orderId)).json?.data?.order; console.log('order',o?.status,J((o?.items||[]).map(x=>[x.description,x.quantity_ordered,x.already_received,x.quantity_remaining]),300)); }
const reqs=(await s.api(`/api/work-orders/${A.work_order_id}/parts/list-requests-by-line?search=&filters[0][field]=work_order&filters[0][value]=${A.work_order_id}`)).json?.data?.collection||[];
console.log('requests',J(reqs.flatMap(x=>x.part_requests||[]).map(p=>[p.description,p.quantity,p.status,p.is_core_charge,p.vendor_invoice_number||p.invoice_number]),800));
await s.close();
