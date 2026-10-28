// Finds an invoice whose credit dialog lists a part (for the two-tab credit memo check). Captures the Invoices tab's own request.
import {open} from '../../testing-tools/qa-session.mjs'; import fs from 'fs';
let [env,company]=process.argv.slice(2);
const s=await open({env,ticket:'10928',cookies:JSON.parse(fs.readFileSync('/tmp/qa11631/cookies.json','utf8')),dir:(process.env.QA_DIR||'/tmp/qa28'),user:'bilal.muzamil@shopview.com'});
const p=s.page; const H=env==='prod'?{'x-location-id':'b617914c-16e9-4485-8e8b-193cd86aa416'}:{};
if(env==='prod'){ await s.go('/workorders'); await p.evaluate(()=>localStorage.setItem('location',JSON.stringify('b617914c-16e9-4485-8e8b-193cd86aa416'))); }
const reqs=[]; p.on('response',async r=>{ if(/\/api\//.test(r.url())&&r.request().method()==='GET'){ try{reqs.push({u:r.url(),j:await r.json()});}catch{} }});
if(company==='auto'){ const r=await s.api('/api/customers?limit=5',{headers:H}); const t=JSON.stringify(r.json); company=(t.match(/"(?:company_id|id)":"([0-9a-f-]{36})"/)||[])[1]; console.log('company',company,r.status,t.slice(0,160)); }
await s.go('/customers/'+company+'/invoices'); await p.waitForTimeout(6000);
for(const q of reqs) console.log('REQ',q.u.replace(/^https:\/\/[^/]+/,''),JSON.stringify(q.j).slice(0,300));
const list=reqs.map(q=>q.j?.data).flatMap(d=>Array.isArray(d)?d:(d&&Object.values(d).find(Array.isArray))||[]);
for(const inv of list.slice(0,25)){ const id=inv.id||inv.invoice_id; const r=await s.api(`/api/part-sales/${id}/list-credit-available-parts`,{headers:H}); const a=r.json?.data||r.json||[];
  if(Array.isArray(a)&&a.length) console.log('INV',id,inv.number||inv.invoice_number,inv.status,'parts',a.length,JSON.stringify(a[0]).slice(0,250)); }
await s.close(); process.exit(0);
