// Route discovery for the document types the remaining cases need:
// part-sale documents, credit invoices, batch/imported invoices, history snapshots, authorizer.
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/invoice-design-selection/build-verify-2026-09-11';
const API='sv9872api.qa.shopview.com';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));
const R={}; const save=()=>fs.writeFileSync(`${DIR}/evidence/P08.json`, JSON.stringify(R,null,1));
const s = await boot('sv9872','/administration/settings','admin'); const page=s.page;
const call=(m,p,b)=>page.evaluate(async({api,m,p,b})=>{const r=await fetch(`https://${api}${p}`,{method:m,
  headers:{'Content-Type':'application/json',Accept:'application/json'},credentials:'include',
  body:b?JSON.stringify(b):undefined});const t=await r.text();let j=null;try{j=JSON.parse(t)}catch(e){}
  return{status:r.status,json:j,text:(t||'').slice(0,300)};},{api:API,m,p,b:b||null});
const rowsOf=(j)=>{const pick=o=>{for(const k of ['collection','data','rows','items','results']){if(Array.isArray(o&&o[k]))return o[k];}
  if(Array.isArray(o))return o; for(const k of Object.keys(o||{})){const v=pick(o[k]); if(v&&v.length)return v;} return [];};return pick(j);};

// --- 1. a part sale: full record, to find its invoice/document id
const ps = rowsOf((await call('GET','/api/part-sales?limit=93')).json);
R.partSaleStatuses = ps.reduce((a,p)=>{a[p.status]=(a[p.status]||0)+1;return a;},{});
log('part sale statuses', R.partSaleStatuses);
const psInvoiced = ps.find(p=>p.invoicedDate) || ps.find(p=>p.status==='complete');
const psEstimate = ps.find(p=>p.status==='estimate');
R.partSalePicks={invoiced:psInvoiced&&{id:psInvoiced.id,number:psInvoiced.number,status:psInvoiced.status,invoicedDate:psInvoiced.invoicedDate},
                 estimate:psEstimate&&{id:psEstimate.id,number:psEstimate.number,status:psEstimate.status}};
for (const [tag,p] of [['invoiced',psInvoiced],['estimate',psEstimate]]){
  if(!p) continue;
  for (const path of [`/api/part-sales/view/${p.id}`,`/api/part-sales/${p.id}`]){
    const r=await call('GET',path);
    if (r.status===200){ let x=(r.json&&(r.json.data||r.json))||{}; if(x.part_sale)x=x.part_sale; if(x.partSale)x=x.partSale;
      R[`partSale_${tag}`]={path,keys:Object.keys(x).slice(0,60),
        invoiceId:x.invoice_id||x.invoiceId||null, number:x.number};
      log('part sale',tag,path,'invoice_id=',R[`partSale_${tag}`].invoiceId); break; }
    else log('part sale',tag,path,r.status);
  }
}
save();

// --- 2. credit invoices: list endpoints + a customer's invoices tab
const custId='f6b18290-749e-44c2-a820-fe1b975b2835';
R.creditProbe={};
for (const p of ['/api/credit-invoices','/api/invoices/credits','/api/customer-invoices',
                 `/api/customers/${custId}/invoices`, `/api/customers/view/${custId}`,
                 '/api/invoices/list?limit=20','/api/invoices/search?limit=20']){
  const r=await call('GET',p);
  const rows=r.status===200?rowsOf(r.json):[];
  R.creditProbe[p]={status:r.status, rows:rows.length, keys:rows[0]?Object.keys(rows[0]).slice(0,30):null};
  log('credit probe',p,r.status,'rows='+rows.length);
}
save();

// --- 3. history / snapshots on a known invoice
const invId='aac99a06-20af-424a-afdb-56e865b1553b'; const woId='04ab678b-a2c2-4fd7-bcd9-76b6a23a419f';
R.historyProbe={};
for (const p of [`/api/work-orders/${woId}/history`,`/api/work-orders/view/${woId}/history`,
                 `/api/invoices/${invId}/history`,`/api/history?work_order_id=${woId}`,
                 `/api/work-orders/history/${woId}`]){
  const r=await call('GET',p); const rows=r.status===200?rowsOf(r.json):[];
  R.historyProbe[p]={status:r.status,rows:rows.length,
    sample:rows.slice(0,3).map(x=>Object.fromEntries(Object.entries(x||{}).slice(0,10)))};
  log('history probe',p,r.status,'rows='+rows.length);
}
save();

// --- 4. the FULL work-order record: what field holds the authorizer?
const w=(await call('GET',`/api/work-orders/view/${woId}`)).json;
let x=(w&&(w.data||w))||{}; if(x.work_order)x=x.work_order;
R.woKeys=Object.keys(x);
R.authorizerish=Object.fromEntries(Object.entries(x).filter(([k])=>/auth|approv|contact|ibs/i.test(k)));
log('wo keys', R.woKeys.length);
log('authorizer-ish fields', R.authorizerish);
save();

// --- 5. does this branch serve a customer portal at all?
R.portal={};
for (const u of ['https://sv9872.qa.shopview.com/portal','https://portal.sv9872.qa.shopview.com/']){
  try{ const r=await page.evaluate(async(u)=>{const x=await fetch(u,{redirect:'manual'});
        return {status:x.status, type:x.type};},u);
    R.portal[u]=r; log('portal',u,JSON.stringify(r)); }
  catch(e){ R.portal[u]={error:String(e).slice(0,120)}; log('portal',u,'ERR'); }
}
save();
log('done'); await s.browser.close(); process.exit(0);
