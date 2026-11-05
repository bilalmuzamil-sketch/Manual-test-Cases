// usage: node seed2.mjs <tag> [invoice|pay|none] -> WO with contact; line1 labour-only (completed), line2 with vendor parts A(40/90) + B(none) ordered;
//   then optionally complete + invoice (+ pay). Prints every status.
import {sess,post,arr} from './common.mjs'; import fs from 'fs';
const ENV=process.env.ENV||'branch'; const TAG=process.argv[2]; const MODE=process.argv[3]||'invoice';
const CFG=ENV==='prod'?{wp:'b617914c'}:{wp:'b3c8c820'};
const s=await sess(); await s.go('/workorders'); await s.page.waitForTimeout(2500); const log=(...a)=>console.log(...a);
const ws=arr((await s.api('/api/staff/my-workplaces')).json?.data); const W=ws.find(w=>w.id.startsWith(CFG.wp));
log('loc',(await post(s,'/api/iam/change-location',{workplace_id:W.id,workplace_timezone:W.timezone||'America/Edmonton'})).status);
// a company with a contact
let COMPANY=process.env.COMPANY, CONTACT=null;
const cl=arr((await s.api('/api/customers?pagination[page]=1&pagination[rowsPerPage]=50&search=')).json?.data);
for(const c of (COMPANY?[{id:COMPANY}]:cl)){ const v=(await s.api('/api/customers/view/'+c.id)).json?.data; const ct=v?.company?.contacts||[]; if(ct.length){ COMPANY=c.id; CONTACT=ct[0].id; break; } }
const veh=arr((await s.api('/api/vehicles?company_id='+COMPANY)).json?.data); log('company',COMPANY,'contact',CONTACT,'veh',veh.length);
const today=new Date().toISOString().slice(0,10);
const c=await post(s,'/api/work-orders/create',{company_id:COMPANY,customer_id:CONTACT,vehicle_id:veh[0]?.id,workplace_id:W.id,start_date:today,is_vehicle_here:true}); const wo=c.json?.data?.work_order_id; log('create',c.status,wo);
const cans=arr((await s.api('/api/work-orders/canned-lines')).json?.data).filter(x=>Number(x.total_parts)===0&&(!x.workplace_id||x.workplace_id===W.id));
const L=[]; for(const can of cans.slice(0,2)){ const l=await post(s,'/api/work-orders/'+wo+'/lines/create-from-canned-line',{canned_line_id:can.id,status:'authorized'}); L.push(l.json?.data?.line_id); log('line',l.status); }
const vs=arr((await s.api('/api/parts-catalogue/vendors?pagination[page]=1&pagination[rowsPerPage]=50')).json?.data); const V=vs.find(v=>/zzautotest/i.test(v.name||''))||vs[0];
const cats=arr((await s.api('/api/inventory/categories?limit=500')).json?.data); const cat=(cats.find(x=>x.label==='Uncategorized')||cats[0]).value;
const stamp=Date.now().toString().slice(-6); const out={env:ENV,wo,lines:L,line:L[1],company:COMPANY,contact:CONTACT,vendor:V?.id,category:cat,parts:[]};
for(const [k,cost,sell] of [['A',40,90],['B',null,null]]){ const pn=`ZZ11006-${TAG}${k}-${stamp}`;
  const body={work_order:wo,line:(process.env.SPLITLINES&&k==='B')?L[0]:L[1],description:'ZZAUTOTEST SV-11006 part '+k,part_number:pn,quantity:Number(process.env.QTY||1),part_source_type:'vendor',is_authorized:false,part_category_id:cat,vendor_id:V?.id}; if(cost!==null){body.cost=cost;body.sell_price=sell;}
  const m=await post(s,'/api/work-orders/part/make-request',body); const pr=m.json?.data?.id; const o=await post(s,'/api/work-orders/part/perform-request-status-action',{part_request_id:pr,action:'order'}); log('part',k,m.status,o.status);
  out.parts.push({k,pn,pr,cost,sell,order:o.json?.data}); }
if(MODE!=='none'){
  log('mileage',(await post(s,'/api/work-orders/change-mileage',{work_order_id:wo,mileage:'123456'})).status);
  log('story',(await post(s,'/api/work-orders/lines/change-story',{line_id:L[0],tech_story:'ZZAUTOTEST done',work_order_id:wo})).status);
  const lc=await post(s,'/api/work-orders/lines/change-status',{line_id:L[0],status:'complete'}); log('line1 complete',lc.status,JSON.stringify(lc.json).slice(0,120));
  for(const st of ['approved','in_progress','ready_for_review','complete']){ const r=await post(s,'/api/work-orders/change-status',{id:wo,status:st}); log('wo',st,r.status,JSON.stringify(r.json).slice(0,140)); }
  const inv=await post(s,'/api/invoices/create',{work_order_id:wo}); log('invoice',inv.status,JSON.stringify(inv.json).slice(0,200)); out.invoice=inv.json?.data;
}
const v=(await s.api('/api/work-orders/view/'+wo)).json?.data; out.number=(v?.work_order||v)?.display_number; out.status=(v?.work_order||v)?.status;
log(JSON.stringify({number:out.number,status:out.status,po:out.parts[0].order?.orderId})); fs.writeFileSync(`/tmp/sv11006/seed-${ENV}-${TAG}.json`,JSON.stringify(out,null,1)); await s.close(); process.exit(0);
