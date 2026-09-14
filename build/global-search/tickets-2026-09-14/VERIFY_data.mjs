// Read the LIVE field values of the records the run searches for.
//
// Why this exists: the declarative manifest states what the seeder creates, but several cases search
// on fields the manifest never mentions -- a contact's first/last name, a contact's JOB TITLE, a
// customer's website and address_2. `Marlene` matches the seeded customer as a "Contact match", so a
// contact does exist; `Dispatch Supervisor` returns nothing, and that is only a product finding if a
// contact actually CARRIES that title. Otherwise it is a data gap and the case cannot be run as
// written (Rule 104's positive control; Rule 14 -- seed the state, never mark it not-verified).
//
// Reads only. Writes nothing.
import fs from 'fs';
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
const DIR='/home/user/Manual-test-Cases/build/global-search/tickets-2026-09-14';
const SEED='/home/user/Manual-test-Cases/build/global-search/seeding';
const live=JSON.parse(fs.readFileSync(`${SEED}/seed-state-live.json`,'utf8')).live_ids;
const { browser, page, APIH } = await boot('sv9160','/','admin');
const api=async(p)=>page.evaluate(async(u)=>{
  try{ const r=await fetch(u,{headers:{Accept:'application/json'},credentials:'include'});
    const t=await r.text(); let j=null; try{j=JSON.parse(t)}catch(e){}
    return {status:r.status, json:j, head:t.slice(0,300)};
  }catch(e){ return {error:String(e).slice(0,120)}; }}, `https://${APIH}${p}`);

const out={at:new Date().toISOString(), live_ids:live};
const pick=(o,keys)=>Object.fromEntries(keys.filter(k=>o&&o[k]!==undefined).map(k=>[k,o[k]]));

// The customer, with whatever it carries for the fields the cases search on.
const c=await api(`/api/customers/view/${live.customer}`);
{ const d=c.json&&(c.json.data||c.json); const co=(d&&(d.company||d.customer||d))||{};
  out.customer={status:c.status,
    fields:pick(co,['name','website','address','address_2','city','state_or_province','postal_code',
                    'email','telephone','phone']),
    contactKeys:Object.keys(co).filter(k=>/contact|person/i.test(k)),
    contacts:(co.contacts||co.contact_persons||co.people||[]).map(p=>
      pick(p,['first_name','last_name','name','title','job_title','position','role','email','phone']))};
  if(!out.customer.contacts.length) out.customer.rawHead=JSON.stringify(co).slice(0,1500); }

// Contacts sometimes live on their own endpoint rather than inline on the company.
for(const p of [`/api/customers/${live.customer}/contacts`, `/api/companies/${live.customer}/contacts`,
                `/api/contacts?company_id=${live.customer}`]){
  const r=await api(p);
  if(r.status===200 && r.json){ const d=r.json.data||r.json;
    const list=Array.isArray(d)?d:(d.collection||d.contacts||[]);
    out.contactsEndpoint={path:p, n:list.length,
      rows:list.map(x=>pick(x,['first_name','last_name','name','title','job_title','position','email','phone']))};
    break; }
  out[`try ${p}`]=r.status;
}

// The asset and vendor, for the fields their cases search on.
const a=await api(`/api/vehicles/view/${live.asset}`);
{ const d=a.json&&(a.json.data||a.json); const v=(d&&(d.vehicle||d))||{};
  out.asset={status:a.status, fields:pick(v,['unit','vin','licence_plate','license_plate','year',
    'maker_name','model_name','make','model'])}; }
const v=await api(`/api/parts-catalogue/vendors/view/${live.vendor}`);
{ const d=v.json&&(v.json.data||v.json); const x=(d&&(d.vendor||d))||{};
  out.vendor={status:v.status, fields:pick(x,['name','email','telephone','city','state_or_province',
    'postal_code','address_1'])}; }

fs.writeFileSync(`${DIR}/DATA-VERIFY.json`, JSON.stringify(out,null,1));
console.log(JSON.stringify({customer:out.customer&&out.customer.fields,
  contacts:(out.contactsEndpoint&&out.contactsEndpoint.rows)||(out.customer&&out.customer.contacts),
  asset:out.asset&&out.asset.fields},null,1).slice(0,1600));
await browser.close();
