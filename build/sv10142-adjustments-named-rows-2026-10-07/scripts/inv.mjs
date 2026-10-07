import {ob,j} from './lib.mjs'; import fs from 'fs';
const label=process.argv[2]; const W=JSON.parse(fs.readFileSync(`wo-${label}.json`));
const s=await ob(); const P=(u,b)=>s.api(u,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(b)});
for(const l of W.lines){ await P('/api/work-orders/lines/change-story',{line_id:l,tech_story:'ZZAUTOTEST SV-10142 work done',work_order_id:W.wo});
  const r=await P('/api/work-orders/lines/change-status',{line_id:l,status:'complete',workOrderId:W.wo}); console.log('complete line',r.status,j(r.json,150)); }
const c=await P('/api/work-orders/change-status',{id:W.wo,status:'complete'}); console.log('wo complete',c.status,j(c.json,150));
const d=new Date().toISOString().slice(0,10);
const i=await P('/api/invoices/create',{work_order_id:W.wo,issue_date:d,due_date:d}); console.log('invoice',i.status,j(i.json,200));
W.invoice=i.json?.data?.invoice_id; fs.writeFileSync(`wo-${label}.json`,JSON.stringify(W));
await s.close();
