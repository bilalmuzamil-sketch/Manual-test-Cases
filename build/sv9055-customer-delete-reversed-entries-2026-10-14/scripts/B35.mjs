import {ob,J,post} from './lib.mjs'; import {loc,customer,wo,invoiced,payUI,reversePaymentUI,deposit} from './seed.mjs'; import fs from 'fs';
const s=await ob(); await loc(s);
// B3: held deposit only
const c=await customer(s,'ZZAUTOTEST SV9055 B3 held-deposit '+Date.now()%100000); const w=await wo(s,c); const B3={...c,work_order_id:w.work_order_id};
B3.deposit_id=await deposit(s,B3); fs.writeFileSync('B3.json',JSON.stringify(B3));
const dw=await post(s,'/api/work-orders/delete',{work_order_id:B3.work_order_id}); console.log('B3 delete wo',dw.status,J(dw.json,200));
// B5: reversed payment + held deposit
const B5=await invoiced(s,'ZZAUTOTEST SV9055 B5 reversed-payment+held-deposit '+Date.now()%100000);
await payUI(s,B5,'ZZ9055-B5'); await reversePaymentUI(s,B5);
B5.deposit_id=await deposit(s,B5); fs.writeFileSync('B5.json',JSON.stringify(B5));
await s.close();
