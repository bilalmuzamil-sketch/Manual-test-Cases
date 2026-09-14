// Give the VENDOR a second address line, so C53604's second half can be run.
//
// The case checks that a second address line is searchable for a customer AND for a vendor. The
// manifest declares no `address_2` for the vendor at all -- not "declared and missing", simply never
// specified -- so that half of the case had nothing to search for. The customer half passes once the
// value exists, which is the reason to expect this half can be run too rather than parked.
import fs from 'fs';
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
const DIR='/home/user/Manual-test-Cases/build/global-search/tickets-2026-09-14';
const SEED='/home/user/Manual-test-Cases/build/global-search/seeding';
const man=JSON.parse(fs.readFileSync(`${SEED}/seed-manifest.json`,'utf8'));
const { browser, page, APIH } = await boot('sv9160','/','admin');
const api=async(p,method='GET',body=null)=>page.evaluate(async([u,m,b])=>{
  try{ const r=await fetch(u,{method:m,headers:{Accept:'application/json','Content-Type':'application/json'},
        credentials:'include', body:b?JSON.stringify(b):undefined});
    const t=await r.text(); let j=null; try{j=JSON.parse(t)}catch(e){}
    return {status:r.status,json:j,head:t.slice(0,300)};
  }catch(e){ return {error:String(e).slice(0,140)}; }},[`https://${APIH}${p}`,method,body]);
const findVendor=async()=>{ const f=man.records.find(r=>r.key==='vendor').find;
  const r=await api(`${f.list}?search=${encodeURIComponent(f.value)}&limit=25`);
  const d=r.json&&(r.json.data!==undefined?r.json.data:r.json);
  const list=Array.isArray(d)?d:((d&&(d[f.coll]||d.collection))||[]);
  return (list||[]).find(x=>String(x.name||'')===f.value)||null; };
const WANT='Bay 12C';
const v=await findVendor();
const out={at:new Date().toISOString(), wanted:WANT};
if(!v){ out.error='vendor not found'; }
else if(!String(v.name||'').includes(man.environment.tag)){ out.error=`refusing: ${v.name} is not tagged`; }
else {
  out.before={address_2:v.address_2, telephone:v.telephone};
  // /api/parts-catalogue/edit-vendor answers 404 "'resource' was not found" -- a wrong path, not a
  // missing vendor. Try the shapes this API actually uses and record which one took, so the next
  // session does not repeat the search.
  const fields={address_2:WANT, telephone:'(614) 555-0188'};
  let w={status:0, head:'none tried'};
  out.tried=[];
  for(const [path,body] of [
    ['/api/parts-catalogue/vendors/change', {...v, id:v.id, vendor_id:v.id, ...fields}],
    ['/api/parts-catalogue/change-vendor',  {...v, id:v.id, vendor_id:v.id, ...fields}],
    ['/api/parts-catalogue/update-vendor',  {...v, id:v.id, vendor_id:v.id, ...fields}],
    ['/api/parts-catalogue/add-vendor',     {...v, id:v.id, vendor_id:v.id, ...fields}],
    [`/api/parts-catalogue/vendors/${v.id}/change`, {...v, ...fields}],
    [`/api/parts-catalogue/vendor/${v.id}/change`,  {...v, ...fields}],
  ]){ const r=await api(path,'POST',body);
    out.tried.push({path, status:r.status, head:(r.head||'').slice(0,110)});
    if(r.status>=200&&r.status<300){ w=r; w.via=path; break; } w=r; }
  out.write={status:w.status, head:w.head, via:w.via||null};
  await page.waitForTimeout(3000);
  const after=await findVendor();
  out.after={address_2:after&&after.address_2, telephone:after&&after.telephone};
  out.landed={address_2:String((after&&after.address_2)||'')===WANT,
              telephone:String((after&&after.telephone)||'')==='(614) 555-0188'};
}
fs.writeFileSync(`${DIR}/SEED-FIELDS3.json`, JSON.stringify(out,null,1));
console.log(JSON.stringify(out,null,1).slice(0,700));
await browser.close();
