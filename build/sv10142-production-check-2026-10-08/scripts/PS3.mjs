import {op,j} from './lib.mjs'; import fs from 'fs';
const {ps}=JSON.parse(fs.readFileSync('prod/ps.json')); const s=await op(); const P=(u,b)=>s.api(u,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(b)});
await P('/api/iam/change-location',{workplace_id:'b617914c-16e9-4485-8e8b-193cd86aa416',workplace_timezone:'Africa/Accra'});
let l=await s.api(`/api/work-orders/${ps}/parts/list-requests-by-line`); const line=l.json.data.collection[0].line_id;
const r=await P('/api/work-orders/part/make-request',{work_order:ps,line,description:'A146',part_number:'1237932',quantity:1,part_source_type:'inventory',is_authorized:true,part_category_id:'00e200b1-59fe-4c4a-88a1-952a6d38fee0',inventory_part_id:'022d1f00-bfca-4951-82b0-5b92226aa635',sell_price:77.94}); console.log('add2',r.status);
console.log('authorize',(await P('/api/work-orders/lines/change-status',{line_id:line,status:'authorized',workOrderId:ps})).status);
l=await s.api(`/api/work-orders/${ps}/parts/list-requests-by-line`); const prs=l.json.data.collection[0].part_requests.map(x=>({id:x.id,pn:x.part_number,st:x.status})); console.log('parts',j(prs,300));
const p1=prs.find(x=>x.pn==='1238042').id, p2=prs.find(x=>x.pn==='1237932').id;
const add=async(kind,name,amount,scope,targetId)=>{const a=await P('/api/work-orders/adjustments/add',{workOrderId:ps,kind,name,calculationType:'flat',amount,scope,targetId,taxable:false}); console.log('adj',kind,name,a.status,a.status>=300?j(a.json,160):'');};
await add('discount','Fleet discount',10,'whole_wo',null); await add('discount','Core discount',5,'part_line',p1); await add('fee','Tire fee',2,'part_line',p1); await add('fee','Environmental fee',3,'part_line',p2); await add('fee','Environmental fee',3,'part_line',p1);
const pk=await P(`/api/work-orders/${ps}/pick-inventory-parts`,{part_request_ids:prs.map(x=>x.id)}); console.log('pick',pk.status,pk.status>=300?j(pk.json,150):'');
for(const st of ['approved','complete']){ const c=await P('/api/work-orders/change-status',{id:ps,status:st}); console.log(st,c.status,c.status>=300?j(c.json,150):''); }
const d=new Date().toISOString().slice(0,10); const iv=await P('/api/invoices/create',{work_order_id:ps,issue_date:d,due_date:d}); console.log('invoice',iv.status,j(iv.json,150));
const inv=iv.json?.data?.invoice_id;
const des=async(dd)=>{ await P('/api/organizations/invoice-settings/change-design',{documentDesign:dd}); console.log('design read',(await s.api('/api/organizations/invoice-settings/view')).json?.data?.documentDesign); };
const get=async(id,tag)=>{ const b=await s.page.evaluate(async([base,id])=>{const r=await fetch(base+'/api/invoices/preview?invoice_id='+id+'&type=pdf',{credentials:'include'}); const a=new Uint8Array(await r.arrayBuffer()); let s='';for(const x of a)s+=String.fromCharCode(x); return btoa(s);},[s.host.api,id]); fs.writeFileSync(`raw/invoice-PS-${tag}.pdf`,Buffer.from(b,'base64')); };
await des('modern'); await get(inv,'modern'); await des('legacy'); await get(inv,'legacy'); await des('legacy');
const v=await s.api('/api/work-orders/view/'+ps); fs.writeFileSync('prod/ps.json',JSON.stringify({ps,invoice:inv,line,parts:prs,number:v.json?.data?.work_order?.number})); console.log('number',v.json?.data?.work_order?.number);
await s.close();
