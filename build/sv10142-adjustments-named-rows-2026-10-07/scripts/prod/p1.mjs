import {op,j} from '../lib.mjs'; import fs from 'fs';
const S=JSON.parse(fs.readFileSync('prod/setup.json')); const C=S.pick; const TH='b617914c-16e9-4485-8e8b-193cd86aa416';
const s=await op(); const P=(u,b)=>s.api(u,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(b)});
console.log('loc',(await P('/api/iam/change-location',{workplace_id:TH,workplace_timezone:'Africa/Accra'})).status);
const cr=await P('/api/work-orders/create',{company_id:C.company_id,customer_id:C.contact.id,vehicle_id:C.vehicle.id,workplace_id:TH,start_date:new Date().toISOString().slice(0,10),is_vehicle_here:true});
const wo=cr.json?.data?.work_order_id; console.log('create',cr.status,wo); fs.writeFileSync('prod/wo.json',JSON.stringify({wo}));
await P('/api/work-orders/change-mileage',{work_order_id:wo,mileage:'123456'});
const lines=[]; for(const c of S.canned.slice(0,3)){ const r=await P(`/api/work-orders/${wo}/lines/create-from-canned-line`,{canned_line_id:c.id,status:'authorized'}); lines.push(r.json?.data?.line_id); console.log('line',r.status,c.canned_line_name); }
const cat='00e200b1-59fe-4c4a-88a1-952a6d38fee0';
for(const [pn,d] of [['ZZ10142-A','ZZAUTOTEST filter A'],['ZZ10142-B','ZZAUTOTEST filter B']]){ const r=await P('/api/work-orders/part/make-request',{work_order:wo,line:lines[0],description:d,part_number:pn,quantity:1,part_source_type:'vendor',is_authorized:true,part_category_id:cat,cost:20,sell_price:40}); console.log('part',r.status,r.status>=300?j(r.json,150):''); }
await s.page.waitForTimeout(1500);
const parts=[]; const L=await s.api('/api/work-orders/lines/'+wo); for(const l of L.json.data.collection) for(const p of (l.part_requests||[])) parts.push({id:p.id,pn:p.part_number,sell:p.sell_price});
const pa=parts.find(p=>p.pn.endsWith('A')).id, pb=parts.find(p=>p.pn.endsWith('B')).id; const [l1,l2,l3]=lines;
const add=async(kind,name,amount,scope,targetId)=>{ const r=await P('/api/work-orders/adjustments/add',{workOrderId:wo,kind,name,calculationType:'flat',amount,scope,targetId,taxable:false}); console.log('adj',kind,name,r.status,r.status>=300?j(r.json,150):''); await s.page.waitForTimeout(700); };
await add('fee','Shop fee',15,'labor_line',l1); await add('fee','Diagnostic fee',25,'labor_line',l1); await add('fee','Shop fee',15,'labor_line',l2); await add('fee','Shop fee',15,'labor_line',l3);
await add('discount','Core discount',5,'part_line',pa); await add('fee','Environmental fee',3,'part_line',pa); await add('fee','Environmental fee',3,'part_line',pb); await add('discount','Fleet discount',10,'whole_wo',null);
const v=await s.api('/api/work-orders/view/'+wo); const num=v.json?.data?.work_order?.number; console.log('number',num,'summary',j(v.json?.data?.work_order?.adjustmentsSummary,200));
fs.writeFileSync('prod/wo.json',JSON.stringify({wo,lines,parts,number:num}));
const now=new Date().toISOString().replace(/\.\d+Z/,'+00:00');
const est=async(tag)=>{ const out=await s.page.evaluate(async([base,wo,now])=>{const r=await fetch(base+'/api/work-orders/invoices/estimate',{method:'POST',credentials:'include',headers:{'content-type':'application/json'},body:JSON.stringify({work_order_id:wo,type:'pdf',isEstimate:1,includeDeclined:0,issueDate:now,dueDate:now,historyEvent:null})}); const a=new Uint8Array(await r.arrayBuffer()); let s='';for(const x of a)s+=String.fromCharCode(x); return [r.status,btoa(s)];},[s.host.api,wo,now]); fs.writeFileSync(`prod/estimate-${tag}.pdf`,Buffer.from(out[1],'base64')); console.log('estimate',tag,out[0]); };
const des=async(d)=>{ const r=await P('/api/organizations/invoice-settings/change-design',{documentDesign:d}); const g=(await s.api('/api/organizations/invoice-settings/view')).json?.data?.documentDesign; console.log('design ->',d,r.status,'read',g); };
await des('modern'); await est('modern'); await des('legacy'); await est('legacy');
console.log('final design',(await s.api('/api/organizations/invoice-settings/view')).json?.data?.documentDesign);
await s.close();
