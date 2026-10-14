import {ob,J,post} from './lib.mjs'; import {loc,reverseInvoiceUI,deposit} from './seed.mjs'; import fs from 'fs';
const s=await ob(); await loc(s); const A=JSON.parse(fs.readFileSync('B5.json'));
await reverseInvoiceUI(s,A);
console.log('reopen',(await post(s,'/api/work-orders/lines/change-status',{line_id:A.line_id,work_order_id:A.work_order_id,status:'authorized'})).status);
const v=await s.api('/api/work-orders/view/'+A.work_order_id); console.log('wo',v.json?.data?.work_order?.status);
A.deposit_id=await deposit(s,A); fs.writeFileSync('B5.json',JSON.stringify(A));
const d=await s.api('/api/customer-deposits/list?accountId='+A.customer_account_id); console.log('deps',J((d.json?.data?.collection||[]).map(x=>[x.creditNumber,x.amount,x.status]),300));
await s.close();
