// switch design to modern, render estimates A/B, complete+invoice A/B, render invoice PDFs; then legacy estimate+invoice for A; restore design legacy.
import {op,j} from './lib.mjs'; import fs from 'fs';
const s=await op(); const P=(u,b)=>s.api(u,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(b)});
const TH='b617914c-16e9-4485-8e8b-193cd86aa416'; await P('/api/iam/change-location',{workplace_id:TH,workplace_timezone:'Africa/Accra'});
const des=async(d)=>{ const r=await P('/api/organizations/invoice-settings/change-design',{documentDesign:d}); const g=(await s.api('/api/organizations/invoice-settings/view')).json?.data?.documentDesign; console.log('design ->',d,r.status,'read',g); };
const now=new Date().toISOString().replace(/\.\d+Z/,'+00:00');
const get=async(url,init)=>s.page.evaluate(async([u,i])=>{const r=await fetch(u,Object.assign({credentials:'include'},i?JSON.parse(i):{})); const a=new Uint8Array(await r.arrayBuffer()); let s='';for(const x of a)s+=String.fromCharCode(x); return [r.status,btoa(s)];},[s.host.api+url,init?JSON.stringify(init):null]);
const est=async(k,W,tag)=>{ const [st,b]=await get('/api/work-orders/invoices/estimate',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({work_order_id:W.wo,type:'pdf',isEstimate:1,includeDeclined:0,issueDate:now,dueDate:now,historyEvent:null})}); fs.writeFileSync(`raw/estimate-${k}-${tag}.pdf`,Buffer.from(b,'base64')); console.log('estimate',k,tag,st); };
const invpdf=async(k,W,tag)=>{ const [st,b]=await get('/api/invoices/preview?invoice_id='+W.invoice+'&type=pdf'); fs.writeFileSync(`raw/invoice-${k}-${tag}.pdf`,Buffer.from(b,'base64')); console.log('invoice',k,tag,st); };
fs.mkdirSync('raw',{recursive:true});
const W={A:JSON.parse(fs.readFileSync('prod/wo-A.json')),B:JSON.parse(fs.readFileSync('prod/wo-B.json'))};
await des('modern');
for(const k of ['A','B']) await est(k,W[k],'modern');
for(const k of ['A','B']){ const w=W[k];
  for(const l of w.lines){ await P('/api/work-orders/lines/change-story',{line_id:l,tech_story:'ZZAUTOTEST SV-10142 work done',work_order_id:w.wo}); const r=await P('/api/work-orders/lines/change-status',{line_id:l,status:'complete',workOrderId:w.wo}); if(r.status>=300) console.log(k,'line complete',r.status,j(r.json,150)); }
  const c=await P('/api/work-orders/change-status',{id:w.wo,status:'complete'}); console.log(k,'wo complete',c.status,c.status>=300?j(c.json,200):'');
  const d=new Date().toISOString().slice(0,10); const i=await P('/api/invoices/create',{work_order_id:w.wo,issue_date:d,due_date:d}); console.log(k,'invoice',i.status,j(i.json,200)); w.invoice=i.json?.data?.invoice_id; fs.writeFileSync(`prod/wo-${k}.json`,JSON.stringify(w)); }
for(const k of ['A','B']) if(W[k].invoice) await invpdf(k,W[k],'modern');
await des('legacy');
await est('A',W.A,'legacy'); if(W.A.invoice) await invpdf('A',W.A,'legacy');
await des('legacy');
await s.close();
