// usage: node finish.mjs <tag> -> for an existing seed: tech story, complete line, WO complete, invoice; updates the seed json
import {sess,post} from './common.mjs'; import fs from 'fs'; const F=`/tmp/sv11116/seed-${process.argv[2]}.json`; const S=JSON.parse(fs.readFileSync(F,'utf8')); const s=await sess(); await s.go('/workorders'); await s.page.waitForTimeout(1200); const log=(...a)=>console.log(...a);
log('story',(await post(s,'/api/work-orders/lines/change-story',{line_id:S.line,tech_story:'ZZAUTOTEST done',work_order_id:S.wo})).status);
const cs=await post(s,'/api/work-orders/lines/change-status',{line_id:S.line,status:'complete',workOrderId:S.wo}); log('line',cs.status,JSON.stringify(cs.json).slice(0,120));
for(const st of ['in_progress','ready_for_review','complete']){ const r=await post(s,'/api/work-orders/change-status',{id:S.wo,status:st}); if(r.status>=300) log('wo',st,r.status,JSON.stringify(r.json).slice(0,140)); }
const d=new Date().toISOString().slice(0,10); const inv=await post(s,'/api/invoices/create',{work_order_id:S.wo,issue_date:d,due_date:d}); log('invoice',inv.status,JSON.stringify(inv.json).slice(0,300));
Object.assign(S,{invoiceId:inv.json?.data?.invoice_id,accountId:inv.json?.data?.customer_account_id,remaining:inv.json?.data?.remaining_balance}); fs.writeFileSync(F,JSON.stringify(S,null,1)); await s.close(); process.exit(0);
