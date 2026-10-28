// Scans customers' invoices for one whose Issue Credit dialog lists a part (quantity left to credit). Prints the first few hits only.
import {open} from '../../testing-tools/qa-session.mjs'; import fs from 'fs';
const [env]=process.argv.slice(2);
const s=await open({env,ticket:'10928',cookies:JSON.parse(fs.readFileSync('/tmp/qa11631/cookies.json','utf8')),dir:(process.env.QA_DIR||'/tmp/qa28'),user:'bilal.muzamil@shopview.com'});
const H=env==='prod'?{headers:{'x-location-id':'b617914c-16e9-4485-8e8b-193cd86aa416'}}:{};
const cs=(await s.api('/api/customers?limit=80',H)).json?.data?.collection||[]; let hits=0, seen=0;
for(const c of cs){ const v=(await s.api('/api/customers/view/'+c.id+'?',H)).json?.data; const acct=v?.company?.customer_account_id||v?.customer_account?.id||(JSON.stringify(v).match(/"(?:customer_)?account_id":"([0-9a-f-]{36})"/)||[])[1]; if(!acct) continue;
  const t=(await s.api(`/api/customer-account/list-unpaid-transaction?accountId=${acct}&pagination%5BrowsPerPage%5D=200&openOnly=false&search=`,H)).json; const txt=JSON.stringify(t);
  const ids=[...new Set([...txt.matchAll(/"(?:invoice_id|id)":"([0-9a-f-]{36})"[^}]*?"(?:type|transaction_type)":"invoice"/g)].map(m=>m[1]))];
  for(const id of ids.slice(0,6)){ seen++; const r=await s.api(`/api/part-sales/${id}/list-credit-available-parts`,H); const a=r.json?.data; const arr=Array.isArray(a)?a:[];
    if(arr.length&&!globalThis.shown){globalThis.shown=1;console.log("SHAPE",JSON.stringify(arr[0]).slice(0,400));}
    const ok=arr.filter(x=>Number(x.available_quantity??x.availableQuantity??x.quantity??0)>0);
    if(ok.length){ hits++; console.log('HIT',c.name,'acct',acct,'inv',id,'parts',ok.length,JSON.stringify(ok[0]).slice(0,220)); } }
  if(hits>=3) break; }
console.log('customers',cs.length,'invoices checked',seen,'hits',hits);
await s.close(); process.exit(0);
