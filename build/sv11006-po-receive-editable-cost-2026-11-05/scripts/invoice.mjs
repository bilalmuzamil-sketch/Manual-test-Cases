import {sess,post} from './common.mjs'; import fs from 'fs';
const F=`/tmp/sv11006/seed-${process.env.ENV||'branch'}-${process.argv[2]}.json`; const S=JSON.parse(fs.readFileSync(F,'utf8')); const s=await sess(); await s.go('/workorders'); await s.page.waitForTimeout(1200);
const v0=(await s.api('/api/work-orders/view/'+S.wo)).json?.data; console.log('status before',(v0?.work_order||v0)?.status);
const inv=await post(s,'/api/invoices/create',{work_order_id:S.wo}); console.log('invoice',inv.status,JSON.stringify(inv.json).slice(0,200));
const v=(await s.api('/api/work-orders/view/'+S.wo)).json?.data; console.log('status after',(v?.work_order||v)?.status); await s.close(); process.exit(0);
