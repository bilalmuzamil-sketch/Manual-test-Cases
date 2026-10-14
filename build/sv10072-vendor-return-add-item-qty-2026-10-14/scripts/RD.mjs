import {os,J,post} from './lib.mjs'; import fs from 'fs';
const s=await os(); await post(s,'/api/iam/change-location',{workplace_id:'b3c8c820-f815-4cf1-8938-10956c5ee71a',workplace_timezone:'America/Edmonton'});
const rd=(await s.api('/api/inventory/returns/'+process.argv[2])).json; fs.writeFileSync('return-'+process.argv[3]+'.json',JSON.stringify(rd,null,1));
const c=JSON.parse(rd.data.content).data.return_details; console.log(J({sub:c.sub_total,total:c.total,credit:c.total_credit_amount,n:c.items.length},200));
for(const i of c.items) console.log((i.inventory_part_id||'-').slice(0,8),i.part_number,'qty',i.quantity,'credits',i.credits,'wo',i.work_order_id,'rr',i.return_request_id,'deliv',i.delivery_id);
await s.close();
