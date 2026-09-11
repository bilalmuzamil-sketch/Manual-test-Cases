// Discovery: what data exists on sv9872 for the remaining run-446 cases.
// Locations, organizations, part sales, credit invoices, batch/imported invoices,
// authorizers, paid invoices, estimates, history snapshots.
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/invoice-design-selection/build-verify-2026-09-11';
const API='sv9872api.qa.shopview.com';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const R={}; const save=()=>fs.writeFileSync(`${DIR}/evidence/P07.json`, JSON.stringify(R,null,1));
const s = await boot('sv9872','/administration/settings','admin');
const page = s.page;
const call=(m,p,b)=>page.evaluate(async({api,m,p,b})=>{const r=await fetch(`https://${api}${p}`,{method:m,
  headers:{'Content-Type':'application/json',Accept:'application/json'},credentials:'include',
  body:b?JSON.stringify(b):undefined});const t=await r.text();let j=null;try{j=JSON.parse(t)}catch(e){}
  return{status:r.status,json:j,text:(t||'').slice(0,400)};},{api:API,m,p,b:b||null});
const rowsOf=(j)=>{const pick=o=>{for(const k of ['collection','data','rows','items','results']){if(Array.isArray(o&&o[k]))return o[k];}
  if(Array.isArray(o))return o; for(const k of Object.keys(o||{})){const v=pick(o[k]); if(v&&v.length)return v;} return [];};return pick(j);};

// 1. every endpoint we might need, probed for reachability + row count
const probes = [
  ['locations','/api/locations'],
  ['my-workplaces','/api/staff/my-workplaces'],
  ['organizations','/api/organizations'],
  ['org-settings','/api/organization/settings'],
  ['roles','/api/roles'],
  ['staff','/api/staff'],
  ['part-sales','/api/part-sales?limit=50'],
  ['partsales2','/api/parts-sales?limit=50'],
  ['credit-invoices','/api/credit-invoices?limit=50'],
  ['invoices','/api/invoices?limit=50'],
  ['customers','/api/customers?limit=20'],
  ['batch-invoices','/api/batch-invoices?limit=20'],
  ['work-orders','/api/work-orders?limit=200'],
];
R.endpoints={};
for (const [name,p] of probes){
  const r=await call('GET',p);
  const rows = r.status===200 ? rowsOf(r.json) : [];
  R.endpoints[name]={status:r.status, rows:rows.length,
    sample: rows.slice(0,2).map(x=>Object.fromEntries(Object.entries(x||{}).slice(0,12))),
    keys: rows[0]?Object.keys(rows[0]).slice(0,40):null,
    text: r.status!==200 ? r.text.slice(0,180) : undefined};
  log('%-16s %s rows=%d', name, r.status, rows.length);
}
save();

// 2. the organization settings object -- where does invoice design live?
const os = await call('GET','/api/organization/settings');
if (os.status===200){
  const flat=JSON.stringify(os.json);
  R.orgSettingsKeys = Object.keys((os.json&&(os.json.data||os.json))||{});
  R.designKeyHits = (flat.match(/"[a-z_]*(design|legacy|layout)[a-z_]*"\s*:\s*[^,}]{0,40}/gi)||[]).slice(0,20);
  log('org settings keys: %s', JSON.stringify(R.orgSettingsKeys).slice(0,400));
  log('design-ish keys  : %s', JSON.stringify(R.designKeyHits));
}
save();

// 3. the work-order landscape: which have invoices, which are paid, which have authorizer
const wos = rowsOf((await call('GET','/api/work-orders?limit=200')).json);
log('work orders: %d', wos.length);
R.wo={total:wos.length, withInvoice:[], estimatesOnly:[], paid:[], withAuthorizer:[]};
let looked=0;
for (const w of wos){
  if (looked>=70) break; looked++;
  const d=(await call('GET',`/api/work-orders/view/${w.id}`)).json;
  let x=(d&&(d.data||d))||{}; if(x.work_order) x=x.work_order;
  const rec={id:w.id, num:x.number||w.number, status:x.status||w.status,
    invoiceId:x.invoice_id||null, authorizer:x.authorizer_id||x.authorizer||null,
    balance:x.balance_due??x.balance??null, total:x.total??null, customer:x.customer_id||null};
  if (rec.invoiceId) R.wo.withInvoice.push(rec); else R.wo.estimatesOnly.push(rec);
  if (rec.authorizer) R.wo.withAuthorizer.push(rec);
  if (rec.invoiceId && (rec.balance===0||rec.balance==='0.00')) R.wo.paid.push(rec);
}
log('looked at %d | with invoice %d | estimate only %d | paid %d | with authorizer %d',
  looked, R.wo.withInvoice.length, R.wo.estimatesOnly.length, R.wo.paid.length, R.wo.withAuthorizer.length);
save();

// 4. the document-preview route: what other document types does it take?
R.previewVariants={};
const anyInv = R.wo.withInvoice[0];
if (anyInv){
  for (const [name,qs] of [
    ['invoice',`invoice_id=${anyInv.invoiceId}&type=html&isEstimate=0&includeDeclined=0&historyEvent=`],
    ['estimate',`invoice_id=${anyInv.invoiceId}&type=html&isEstimate=1&includeDeclined=0&historyEvent=`],
    ['pdf',`invoice_id=${anyInv.invoiceId}&type=pdf&isEstimate=0&includeDeclined=0&historyEvent=`],
  ]){
    const r=await page.evaluate(async({api,qs})=>{const x=await fetch(`https://${api}/api/invoices/preview?${qs}`,{credentials:'include'});
      const t=await x.text(); return {status:x.status, len:t.length, head:t.slice(0,120),
      ctype:x.headers.get('content-type')};},{api:API,qs});
    R.previewVariants[name]=r; log('preview %-9s %s len=%d ctype=%s', name, r.status, r.len, r.ctype);
  }
}
save();
log('done');
await s.browser.close(); process.exit(0);
