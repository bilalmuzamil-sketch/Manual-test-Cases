import {op,j} from './lib.mjs'; import fs from 'fs';
const S=JSON.parse(fs.readFileSync('prod/setup.json')); const C=S.pick; const TH='b617914c-16e9-4485-8e8b-193cd86aa416';
const s=await op(); const P=(u,b)=>s.api(u,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(b)});
console.log('loc',(await P('/api/iam/change-location',{workplace_id:TH,workplace_timezone:'Africa/Accra'})).status);
const cat='00e200b1-59fe-4c4a-88a1-952a6d38fee0';
async function mk(tag,nLines,partsDef){ const cr=await P('/api/work-orders/create',{company_id:C.company_id,customer_id:C.contact.id,vehicle_id:C.vehicle.id,workplace_id:TH,start_date:new Date().toISOString().slice(0,10),is_vehicle_here:true});
  const wo=cr.json?.data?.work_order_id; console.log(tag,'create',cr.status,wo); await P('/api/work-orders/change-mileage',{work_order_id:wo,mileage:'123456'});
  const lines=[]; for(const c of S.canned.slice(0,nLines)){ const r=await P(`/api/work-orders/${wo}/lines/create-from-canned-line`,{canned_line_id:c.id,status:'authorized'}); lines.push(r.json?.data?.line_id); }
  for(const [pn,d] of partsDef){ const r=await P('/api/work-orders/part/make-request',{work_order:wo,line:lines[0],description:d,part_number:pn,quantity:1,part_source_type:'vendor',is_authorized:true,part_category_id:cat,cost:20,sell_price:40}); console.log(tag,'part',r.status); }
  await s.page.waitForTimeout(1500); const parts={}; const L=await s.api('/api/work-orders/lines/'+wo); for(const l of L.json.data.collection) for(const p of (l.part_requests||[])) parts[p.part_number]=p.id;
  return {wo,lines,parts}; }
const add=(wo)=>async(kind,name,amount,scope,targetId,calc='flat')=>{ const r=await P('/api/work-orders/adjustments/add',{workOrderId:wo,kind,name,calculationType:calc,amount,scope,targetId,taxable:false}); console.log(' adj',kind,name,amount,calc,r.status,r.status>=300?j(r.json,150):''); await s.page.waitForTimeout(500); };
// A: the customer's shape, entered OUT of the expected order (discounts and later names first)
const A=await mk('A',3,[['ZZ10142P-A','ZZAUTOTEST filter A'],['ZZ10142P-B','ZZAUTOTEST filter B']]); const a=add(A.wo); const [a1,a2,a3]=A.lines;
await a('discount','Fleet discount',10,'whole_wo',null); await a('discount','Core discount',5,'part_line',A.parts['ZZ10142P-A']); await a('fee','Shop fee',15,'labor_line',a1); await a('fee','Environmental fee',3,'part_line',A.parts['ZZ10142P-B']); await a('fee','Shop fee',15,'labor_line',a2); await a('fee','Environmental fee',3,'part_line',A.parts['ZZ10142P-A']); await a('fee','Shop fee',15,'labor_line',a3); await a('fee','Diagnostic fee',25,'labor_line',a1);
// B: edge cases
const B=await mk('B',2,[['ZZ10142P-C','ZZAUTOTEST filter C'],['ZZ10142P-D','ZZAUTOTEST filter D']]); const b=add(B.wo); const [b1,b2]=B.lines;
await b('fee','zeta fee',7,'labor_line',b1); await b('discount','Zulu discount',2,'labor_line',b1); await b('fee','Promo',10,'labor_line',b2); await b('fee','Shop fee',5,'labor_line',b1); await b('discount','bravo discount',3,'labor_line',b2); await b('fee','Alpha fee',4,'labor_line',b1); await b('discount','Promo',4,'labor_line',b1); await b('fee','Shop fee',2,'labor_line',b2,'pct_labor');
await b('discount','Waste discount',1,'part_line',B.parts['ZZ10142P-C']); await b('discount','core discount',2,'part_line',B.parts['ZZ10142P-D']); await b('fee','Tiny fee',0.01,'part_line',B.parts['ZZ10142P-C'],'pct_parts');
await b('discount','Loyalty discount',5,'whole_wo',null); await b('fee','Admin fee',8,'whole_wo',null); await b('discount','Loyalty discount',2,'whole_wo',null);
for(const [k,W] of [['A',A],['B',B]]){ const v=await s.api('/api/work-orders/view/'+W.wo); W.number=v.json?.data?.work_order?.number; W.summary=v.json?.data?.work_order?.adjustmentsSummary; console.log(k,W.number,j(W.summary,300)); fs.writeFileSync(`prod/wo-${k}.json`,JSON.stringify(W)); }
await s.close();
