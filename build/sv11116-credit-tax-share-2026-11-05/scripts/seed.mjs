// usage: node seed.mjs <tag> [TAX=<taxProfileId>] [CAN=LONGEST|SHORTEST|<name>] -> fresh customer+contact+vehicle, WO at Heavy Duty with 1 canned line, line completed, WO complete, INVOICED.
// writes /tmp/sv11116/seed-<tag>.json {wo, number, company, contact, vehicle, customerName, line, invoiceId, accountId, invoice totals}
import {sess,post,arr} from './common.mjs'; import fs from 'fs';
const TAG=process.argv[2]; const s=await sess(); await s.go('/workorders'); await s.page.waitForTimeout(1500); const log=(...a)=>console.log(...a);
const W={id:'b3c8c820-f815-4cf1-8938-10956c5ee71a',tz:'America/Edmonton'}; await post(s,'/api/iam/change-location',{workplace_id:W.id,workplace_timezone:W.tz});
const nm='ZZAUTOTEST SV11116 '+TAG+' '+Date.now().toString().slice(-5);
let company,contact,vehicle; const FR=process.env.FROM?JSON.parse(fs.readFileSync(`/tmp/sv11116/seed-${process.env.FROM}.json`,'utf8')):null;
if(FR){ ({company,contact,vehicle}=FR); } else { const co=(await post(s,'/api/customers/create',{name:nm})).json?.data; company=co?.company_id||co?.id;
const ct=(await post(s,'/api/contacts/create',{company_id:company,first_name:'ZZ',last_name:'Test'+TAG,email:`zz11116${TAG.toLowerCase()}${Date.now()%10000}@example.com`})).json?.data; contact=ct?.contact_id||ct?.id||ct?.customer_id;
const vh=(await post(s,'/api/vehicles/create',{company_id:company,customer_id:contact,unit:'ZZ'+TAG})).json?.data; vehicle=vh?.vehicle_id||vh?.id; }
if(process.env.CUSTONLY){ fs.writeFileSync(`/tmp/sv11116/seed-${TAG}.json`,JSON.stringify({tag:TAG,company,contact,vehicle,customerName:nm},null,1)); console.log(JSON.stringify({tag:TAG,company,customerName:nm})); await s.close(); process.exit(0); }
if(process.env.REUSE){ const R=JSON.parse(fs.readFileSync(`/tmp/sv11116/seed-${process.env.REUSE}.json`,'utf8')); }
const c=await post(s,'/api/work-orders/create',{company_id:company,customer_id:contact,vehicle_id:vehicle,workplace_id:W.id,start_date:new Date().toISOString().slice(0,10),is_vehicle_here:true}); const wo=c.json?.data?.work_order_id; log('wo',c.status,wo);
if(process.env.TAX){ const t=await post(s,'/api/work-orders/change-tax',{work_order_id:wo,tax_id:process.env.TAX}); log('tax',t.status,JSON.stringify(t.json).slice(0,150)); }
const all=arr((await s.api('/api/work-orders/canned-lines')).json?.data); const CAN=process.env.CAN||'LONGEST';
const can=CAN==='LONGEST'?all.filter(x=>Number(x.total_parts)===0&&(!x.workplace_id||x.workplace_id===W.id)).sort((a,b)=>Number(b.time_estimate)-Number(a.time_estimate))[0]:all.find(x=>x.canned_line_name.trim()===CAN);
const l=await post(s,'/api/work-orders/'+wo+'/lines/create-from-canned-line',{canned_line_id:can.id,status:'authorized'}); const line=l.json?.data?.line_id; log('line',l.status,can.canned_line_name);
log('mileage',(await post(s,'/api/work-orders/change-mileage',{work_order_id:wo,mileage:1000})).status);
log('story',(await post(s,'/api/work-orders/lines/change-story',{line_id:line,tech_story:'ZZAUTOTEST done',work_order_id:wo})).status);
const cs=await post(s,'/api/work-orders/lines/change-status',{line_id:line,status:'complete',workOrderId:wo}); log('line complete',cs.status,JSON.stringify(cs.json).slice(0,150));
for(const st of ['in_progress','ready_for_review','complete']){ const r=await post(s,'/api/work-orders/change-status',{id:wo,status:st}); if(r.status>=300) log('wo',st,r.status,JSON.stringify(r.json).slice(0,140)); }
const d=new Date().toISOString().slice(0,10); const inv=await post(s,'/api/invoices/create',{work_order_id:wo,issue_date:d,due_date:d}); log('invoice',inv.status,JSON.stringify(inv.json).slice(0,300));
const v=(await s.api('/api/work-orders/view/'+wo)).json?.data; const w=v?.work_order||v;
const out={tag:TAG,wo,number:w?.display_number,company,contact,vehicle,customerName:FR?FR.customerName:nm,line,invoiceId:inv.json?.data?.invoice_id,accountId:inv.json?.data?.customer_account_id,remaining:inv.json?.data?.remaining_balance,total:w?.total_price,tax:JSON.stringify(w?.tax||w?.taxes||'').slice(0,200),status:w?.status};
log(JSON.stringify(out)); fs.writeFileSync(`/tmp/sv11116/seed-${TAG}.json`,JSON.stringify(out,null,1)); await s.close(); process.exit(0);
