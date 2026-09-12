// PRODUCTION -- C53570 precondition. The Authorizer list is built from the CUSTOMER'S CONTACTS;
// S2-861's customer has none, so the dropdown offered only "No authorizer". That is the record
// not qualifying, not a missing control. Find a customer that HAS contacts and a work order of
// theirs that is not yet invoiced.
import fs from 'fs';
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
const DIR='/home/user/Manual-test-Cases/build/invoice-design-selection/production-2026-09-12';
const APIH='api.shopview.com';
const L=(...a)=>console.log(new Date().toISOString().slice(11,19),a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));
const R={at:new Date().toISOString(), case:'C53570', withContacts:[], candidates:[]};
const save=()=>fs.writeFileSync(`${DIR}/PR43.json`, JSON.stringify(R,null,1));
const { browser, page } = await bootProdLogin('/');
const call=(p)=>page.evaluate(async({a,p})=>{const r=await fetch(`https://${a}${p}`,{credentials:'include',headers:{Accept:'application/json'}});
  const t=await r.text(); let j=null; try{j=JSON.parse(t)}catch(e){} return {s:r.status,j,t:t.slice(0,200)};},{a:APIH,p});
const rowsOf=(j)=>{const pick=o=>{for(const k of ['collection','data','rows','items','results']){if(Array.isArray(o&&o[k]))return o[k];}
  if(Array.isArray(o))return o; for(const k of Object.keys(o||{})){const v=pick(o[k]); if(v&&v.length)return v;} return [];};return pick(j);};
R.location=await page.evaluate(()=>{const b=document.querySelector('[data-test-id="profile_menu_button"]');
  return b?(b.textContent||'').replace(/\s+/g,' ').trim().slice(0,20):null;});
L('location %s', R.location);
const wos=rowsOf((await call('/api/work-orders?limit=300')).j);
const open=wos.filter(w=>/estimate|approved|in_progress|complete|ready/i.test(String(w.status||'')));
L('open work orders %d', open.length);
// group by customer so each customer's contacts are fetched once
const byCust=new Map();
for(const w of open.slice(0,60)){
  const d=await call(`/api/work-orders/view/${w.id}`);
  let x=(d.j&&(d.j.data||d.j))||{}; if(x.work_order) x=x.work_order;
  const cid=x.company_id||x.customer_id||null; if(!cid) continue;
  if(!byCust.has(cid)) byCust.set(cid,[]);
  byCust.get(cid).push({n:w.number,id:w.id,st:x.status,editable:x.editable});
}
L('customers across those work orders: %d', byCust.size);
for(const [cid,list] of byCust){
  let contacts=null;
  for(const p of [`/api/companies/${cid}/contacts`, `/api/customers/${cid}/contacts`, `/api/contacts?company_id=${cid}`]){
    const r=await call(p);
    if(r.s===200){ const rows=rowsOf(r.j); if(Array.isArray(rows)){ contacts={route:p, n:rows.length,
      sample:rows.slice(0,4).map(c=>({id:c.id, name:c.full_name||`${c.first_name||''} ${c.last_name||''}`.trim(), email:c.email?'(set)':null}))}; break; } }
  }
  if(contacts&&contacts.n>0){ R.withContacts.push({cid, contacts, workOrders:list.slice(0,5)});
    L('customer %s has %d contacts | work orders %s', cid.slice(0,8), contacts.n, JSON.stringify(list.slice(0,4).map(w=>`${w.n}/${w.st}`))); }
}
R.candidates=R.withContacts.flatMap(c=>c.workOrders.map(w=>({...w, cid:c.cid, contacts:c.contacts.n})));
L('CANDIDATES for the Authorizer test: %s', JSON.stringify(R.candidates.slice(0,10)));
save(); await browser.close();
