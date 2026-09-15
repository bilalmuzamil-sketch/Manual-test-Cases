// Two of the four "count says yes, section says no" reports now return NOTHING AT ALL for their
// query. That is a different statement from the one the ticket makes, and before it is written down
// either way the record itself has to be accounted for: a search that finds nothing because the
// record was never there is not a fault in the search.
//
//   SV-10015 - is there still a supplier whose contact holds jay.harrison@gmail.com?
//   SV-10017 - is there still a job numbered S9160-17580?
// And alongside them, the same question asked with a record we KNOW exists, so an empty answer can
// be told apart from a broken instrument.
import fs from 'fs';
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
const DIR='/home/user/Manual-test-Cases/build/global-search/tickets-2026-09-14';
const EV=`${DIR}/scope-records`; fs.mkdirSync(EV,{recursive:true});
const R={at:new Date().toISOString(), checks:{}};
const save=()=>fs.writeFileSync(`${DIR}/SCOPE-RECORDS.json`,JSON.stringify(R,null,1));
const L=(...a)=>console.log(new Date().toISOString().slice(11,19),a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));
const { browser, page, APIH, APP } = await boot('sv9160','/','admin');
const api=async(p)=>page.evaluate(async(u)=>{ try{
    const r=await fetch(u,{headers:{Accept:'application/json'},credentials:'include'});
    const t=await r.text(); let j=null; try{j=JSON.parse(t)}catch(e){}
    return {status:r.status,json:j};}catch(e){return {error:String(e).slice(0,120)};}},`https://${APIH}${p}`);

// does a work order with that number exist at all, and what numbers DO exist
const wo=await api('/api/work-orders?pagination[page]=1&pagination[rowsPerPage]=15&search=17580');
const woAny=await api('/api/work-orders?pagination[page]=1&pagination[rowsPerPage]=15&search=S9160-176');
const num=(r)=>{const d=r.json&&(r.json.data||r.json); const a=Array.isArray(d)?d:(d&&(d.collection||d.items)||[]);
  return a.map(x=>x.number||x.work_order_number||x.name||x.id).slice(0,12);};
R.checks.workOrder17580={status:wo.status, found:num(wo)};
R.checks.workOrdersThatDoExist={status:woAny.status, found:num(woAny)};
L('job numbered 17580 ->', JSON.stringify(R.checks.workOrder17580.found));
L('jobs that do exist  ->', JSON.stringify(R.checks.workOrdersThatDoExist.found));

// does a vendor hold that email
const v=await api('/api/vendors?pagination[page]=1&pagination[rowsPerPage]=15&search=Carolina');
const vd=v.json&&(v.json.data||v.json); const va=Array.isArray(vd)?vd:(vd&&(vd.collection||vd.items)||[]);
R.checks.vendorCarolina={status:v.status, found:va.map(x=>({name:x.name,id:x.id,email:x.email})).slice(0,6)};
L('supplier named Carolina ->', JSON.stringify(R.checks.vendorCarolina.found).slice(0,220));
const vid=(va[0]||{}).id;
if(vid){ const c=await api(`/api/vendors/${vid}/contacts?pagination[page]=1&pagination[rowsPerPage]=30`);
  const cd=c.json&&(c.json.data||c.json); const ca=Array.isArray(cd)?cd:(cd&&(cd.collection||cd.items)||[]);
  R.checks.carolinaContacts={status:c.status, emails:ca.map(x=>x.email).filter(Boolean).slice(0,20),
    holdsTheEmail:ca.some(x=>/jay\.harrison@gmail\.com/i.test(x.email||''))};
  L('that supplier\'s contact emails ->', JSON.stringify(R.checks.carolinaContacts.emails).slice(0,220));
  L('holds jay.harrison@gmail.com ->', R.checks.carolinaContacts.holdsTheEmail); }
// and is ANY vendor findable by a contact email at all - the positive control for the claim
const anyc=await api('/api/vendors?pagination[page]=1&pagination[rowsPerPage]=5&search=jay.harrison@gmail.com');
R.checks.vendorByEmailThroughTheList={status:anyc.status, found:num(anyc)};
L('supplier list searched for that email ->', JSON.stringify(R.checks.vendorByEmailThroughTheList));
save(); L('DONE'); await browser.close();
