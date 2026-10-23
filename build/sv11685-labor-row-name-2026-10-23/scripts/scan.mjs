import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs'; import fs from 'fs';
const env=process.argv[2]; const N=+process.argv[3]||40; const OUT=`/tmp/qa11685/w/scan-${env}/`; fs.mkdirSync(OUT,{recursive:true});
const s=env==='branch'?await open({env:'branch',ticket:'11685',cookies:JSON.parse(fs.readFileSync('/tmp/qa11685/cookies.json')),quick:'admin',dir:'/tmp/qa21',vp:{width:1440,height:900}})
 : await open({env:'prod',user:'bilal.muzamil@shopview.com',dir:'/tmp/qa21',vp:{width:1440,height:900}});
const API=env==='branch'?'https://sv11685api.qa.shopview.com':'https://api.shopview.com';
const txt=(path,init)=>s.page.evaluate(async([u,ini])=>{const r=await fetch(u,Object.assign({credentials:'include'},ini?JSON.parse(ini):{}));return {status:r.status,t:await r.text()}},[API+path,init?JSON.stringify(init):null]);
console.log('design',(await s.api('/api/organizations/invoice-settings/view')).json?.data?.documentDesign);
const seen=[]; for(const st of (process.argv[4]||'').split(',').filter(Boolean)) { const L=(await s.api(`/api/work-orders?rowsPerPage=100&status=${st}`)).json?.data?.work_orders||[]; seen.push(...L);} 
if(!seen.length) seen.push(...((await s.api('/api/work-orders?rowsPerPage=100')).json?.data?.work_orders||[]));
const pick=seen.filter(x=>x.linesCount>=2).slice(0,N); console.log('candidates',seen.length,'picked',pick.length);
for(const w of pick){ const v=(await s.api('/api/work-orders/view/'+w.id)).json?.data?.work_order||{};
  const r=await txt('/api/work-orders/invoices/estimate',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({work_order_id:w.id,type:'html',isEstimate:1,includeDeclined:1,issueDate:'2026-10-23',dueDate:'2026-11-22',historyEvent:null})});
  fs.writeFileSync(OUT+`${v.number}-est-decl.html`,r.t);
  if(v.invoice_id){ const i=await txt(`/api/invoices/preview?invoice_id=${v.invoice_id}&type=html`); fs.writeFileSync(OUT+`${v.number}-inv.html`,i.t); }
}
fs.writeFileSync(OUT+'list.json',JSON.stringify(pick.map(x=>({id:x.id,number:x.number,status:x.status,lines:x.linesCount}))));
process.exit(0);
