import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs'; import fs from 'fs';
const env=process.argv[2], wo=process.argv[3]; const OUT=`/tmp/qa11685/w/var-${env}/`;
const s=env==='branch'?await open({env:'branch',ticket:'11685',cookies:JSON.parse(fs.readFileSync('/tmp/qa11685/cookies.json')),quick:'admin',dir:'/tmp/qa21',vp:{width:1440,height:900}})
 : await open({env:'prod',user:'bilal.muzamil@shopview.com',dir:'/tmp/qa21',vp:{width:1440,height:900}});
const API=env==='branch'?'https://sv11685api.qa.shopview.com':'https://api.shopview.com';
const raw=(path)=>s.page.evaluate(async u=>{const r=await fetch(u,{credentials:'include'});const b=new Uint8Array(await r.arrayBuffer());let x='';for(let i=0;i<b.length;i+=32768)x+=String.fromCharCode(...b.subarray(i,i+32768));return {status:r.status,b64:btoa(x)}},API+path);
const P=async(p,b)=>{const r=await s.api(p,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(b)}); console.log('POST',p,r.status,JSON.stringify(r.json||r.text).slice(0,160)); return r;};
const lines=(await s.api('/api/work-orders/lines/'+wo)).json; const arr=lines.data?.collection||lines.data?.lines||lines.data;
const ids=arr.map(l=>[l.id||l.line_id||l.uuid,l.status]); console.log(JSON.stringify(ids));
await P('/api/work-orders/change-mileage',{work_order_id:wo,mileage:'123456'});
let n=0; for(const [id,st] of ids){ if(/declined/.test(st)) continue; n++;
  await P('/api/work-orders/lines/change-story',{line_id:id,tech_story:`ZZAUTOTEST scope of work for line ${n}: inspected and completed.`,work_order_id:wo});
  await P('/api/work-orders/lines/change-status',{line_id:id,status:'complete',work_order_id:wo,workOrderId:wo}); }
for(const st of ['in_progress','ready_for_review','complete']) await P('/api/work-orders/change-status',{id:wo,status:st});
const r=await P('/api/invoices/create',{work_order_id:wo,issue_date:'2026-10-23',due_date:'2026-11-22'});
const inv=r.json?.data?.invoice_id||(await s.api('/api/work-orders/view/'+wo)).json.data.work_order.invoice_id; console.log('invoice',inv);
const d0=(await s.api('/api/organizations/invoice-settings/view')).json.data.documentDesign; let cur=d0;
for(const d of ['modern','legacy']){ if(d!==cur){ await P('/api/organizations/invoice-settings/change-design',{documentDesign:d}); cur=d; }
  for(const [dec,t] of [[1,'html'],[1,'pdf'],[0,'html'],[0,'pdf']]){ const x=await raw(`/api/invoices/preview?invoice_id=${inv}&type=${t}&isEstimate=0&includeDeclined=${dec}&historyEvent=`); fs.writeFileSync(OUT+`INV-${d}-decl${dec}.${t}`,Buffer.from(x.b64,'base64')); if(x.status!==200) console.log('render',d,dec,t,x.status); } }
if(cur!==d0) await P('/api/organizations/invoice-settings/change-design',{documentDesign:d0});
console.log('design at end',(await s.api('/api/organizations/invoice-settings/view')).json.data.documentDesign,'(was',d0+')');
process.exit(0);
