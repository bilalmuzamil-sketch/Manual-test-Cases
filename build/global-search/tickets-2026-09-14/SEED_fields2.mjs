// Fill the remaining gaps between what the manifest declares and what the records hold.
//
// Measured on 2026-09-14, after the customer was repaired:
//   vendor.telephone  -- declared "(614) 555-0188", record holds null  => C55663 unrunnable
//   asset model       -- declared "Cascadia",       record holds "1000HS" => C55664 and C53605
//                        unrunnable, and it is why the asset renders as "2019 Freightliner ????"
//
// Without this, three cases would be written up as "search cannot find X" when the record simply
// does not carry X. Rule 14: seed the state. Rule 104: read the record back and report what LANDED,
// because a 2xx is not evidence that a write took.
import fs from 'fs';
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
const DIR='/home/user/Manual-test-Cases/build/global-search/tickets-2026-09-14';
const SEED='/home/user/Manual-test-Cases/build/global-search/seeding';
const man=JSON.parse(fs.readFileSync(`${SEED}/seed-manifest.json`,'utf8'));
const TAG=man.environment.tag;
const { browser, page, APIH } = await boot('sv9160','/','admin');
const api=async(p,method='GET',body=null)=>page.evaluate(async([u,m,b])=>{
  try{ const r=await fetch(u,{method:m,headers:{Accept:'application/json','Content-Type':'application/json'},
        credentials:'include', body:b?JSON.stringify(b):undefined});
    const t=await r.text(); let j=null; try{j=JSON.parse(t)}catch(e){}
    return {status:r.status,json:j,head:t.slice(0,400)};
  }catch(e){ return {error:String(e).slice(0,140)}; }},[`https://${APIH}${p}`,method,body]);
const findOne=async(key)=>{ const rec=man.records.find(r=>r.key===key), f=rec.find;
  const r=await api(`${f.list}?search=${encodeURIComponent(f.value)}&limit=25`);
  const d=r.json&&(r.json.data!==undefined?r.json.data:r.json);
  const list=Array.isArray(d)?d:((d&&(d[f.coll]||d.collection))||[]);
  return (list||[]).find(x=>String(x[f.field]||'').toLowerCase()===String(f.value).toLowerCase())||null; };

const out={at:new Date().toISOString(), steps:[]};

// ---- the vendor's telephone
{ const v=await findOne('vendor');
  if(v && String(v.name||'').includes(TAG)){
    const want='(614) 555-0188';
    const w=await api('/api/parts-catalogue/edit-vendor','POST',{...v, telephone:want, id:v.id});
    let after=null; await page.waitForTimeout(2500); after=await findOne('vendor');
    out.steps.push({what:'vendor telephone', wanted:want, writeStatus:w.status,
      before:v.telephone, after:after&&after.telephone,
      landed:String((after&&after.telephone)||'')===want, head:w.head});
  } else out.steps.push({what:'vendor telephone', skipped:'vendor not found or not tagged'}); }

// ---- the asset's model. The create payload took maker_name/model_name, so try the same shape; if
// the change endpoint insists on ids, say so rather than leaving a silent no-op behind.
{ const a=await findOne('asset');
  if(a){
    const want='Cascadia';
    const tries=[
      ['/api/vehicles/change','POST',{...a, id:a.id, maker_name:'Freightliner', model_name:want}],
      ['/api/vehicles/edit','POST',{...a, id:a.id, maker_name:'Freightliner', model_name:want}],
      ['/api/customers/vehicle/change','POST',{...a, id:a.id, maker_name:'Freightliner', model_name:want}],
    ];
    let done=null;
    for(const [p,m,b] of tries){ const r=await api(p,m,b);
      out.steps.push({what:`asset model via ${p}`, status:r.status, head:r.head});
      if(r.status>=200&&r.status<300){ done=p; break; } }
    await page.waitForTimeout(2500);
    const after=await findOne('asset');
    out.assetAfter=after?{unit:after.unit, vin:after.vin, year:after.year,
      vehicle_model:after.vehicle_model, licence_plate:after.licence_plate}:null;
    out.steps.push({what:'asset model', wanted:want, via:done,
      before:a.vehicle_model, after:after&&after.vehicle_model,
      landed:String((after&&after.vehicle_model)||'').toLowerCase()===want.toLowerCase()});
  } else out.steps.push({what:'asset model', skipped:'asset not found'}); }

fs.writeFileSync(`${DIR}/SEED-FIELDS2.json`, JSON.stringify(out,null,1));
console.log(JSON.stringify(out.steps.filter(s=>s.landed!==undefined||s.skipped),null,1));
await browser.close();
