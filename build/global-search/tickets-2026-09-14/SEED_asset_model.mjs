// Set the seeded vehicle's MODEL to what the manifest declares.
//
// /api/vehicles/change answers 201 and changes nothing when given `model_name` -- a success status
// over a silent no-op, which is why every write in this pass is read back. The response echoes
// `vehicle_maker_id` and `vehicle_model_id`, so the endpoint works in ids: find the id for
// "Cascadia" under the Freightliner maker and send that.
//
// Why it matters: the vehicle is declared a 2019 Freightliner Cascadia and is actually a 1000HS, so
// the two cases that search a vehicle by its model and by its year cannot be run as written.
import fs from 'fs';
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
const DIR='/home/user/Manual-test-Cases/build/global-search/tickets-2026-09-14';
const SEED='/home/user/Manual-test-Cases/build/global-search/seeding';
const man=JSON.parse(fs.readFileSync(`${SEED}/seed-manifest.json`,'utf8'));
const live=JSON.parse(fs.readFileSync(`${SEED}/seed-state-live.json`,'utf8')).live_ids;
const { browser, page, APIH } = await boot('sv9160','/','admin');
const api=async(p,method='GET',body=null)=>page.evaluate(async([u,m,b])=>{
  try{ const r=await fetch(u,{method:m,headers:{Accept:'application/json','Content-Type':'application/json'},
        credentials:'include', body:b?JSON.stringify(b):undefined});
    const t=await r.text(); let j=null; try{j=JSON.parse(t)}catch(e){}
    return {status:r.status,json:j,head:t.slice(0,400)};
  }catch(e){ return {error:String(e).slice(0,140)}; }},[`https://${APIH}${p}`,method,body]);
const listOf=(r)=>{ const d=r.json&&(r.json.data!==undefined?r.json.data:r.json);
  if(Array.isArray(d)) return d;
  if(d&&typeof d==='object') return Object.values(d).find(v=>Array.isArray(v))||[];
  return []; };
const findAsset=async()=>{ const f=man.records.find(r=>r.key==='asset').find;
  const r=await api(`${f.list}?search=${encodeURIComponent(f.value)}&limit=25`);
  return listOf(r).find(x=>String(x.unit||'')===f.value)||null; };

const out={at:new Date().toISOString(), tried:[]};
const a=await findAsset();
if(!a){ out.error='asset not found'; }
else {
  out.before={unit:a.unit, model:a.vehicle_model, makerId:a.vehicle_maker_id, modelId:a.vehicle_model_id};
  // find the model id for Cascadia. No model-list endpoint answers here -- every shape tried gives
  // 404 -- but the branch already holds twenty Cascadia vehicles, so take the id off one of them.
  // The data itself is the lookup table when the lookup endpoint does not exist.
  let modelId=null, makerId=null;
  {
    const f=man.records.find(r=>r.key==='asset').find;
    const r=await api(`${f.list}?search=Cascadia&limit=50`);
    const l=listOf(r);
    const hit=l.find(x=>String(x.vehicle_model||'').toLowerCase()==='cascadia');
    out.tried.push({path:'existing Cascadia vehicle on this branch', status:r.status, n:l.length,
      found:hit?{model:hit.vehicle_model, modelId:hit.vehicle_model_id, makerId:hit.vehicle_maker_id}:null});
    if(hit&&hit.vehicle_model_id){ modelId=hit.vehicle_model_id; makerId=hit.vehicle_maker_id;
      out.modelFoundVia='an existing Cascadia vehicle'; out.modelName=hit.vehicle_model; }
  }
  for(const path of (modelId?[]:[
    `/api/vehicles/models?vehicle_maker_id=${a.vehicle_maker_id}&limit=500`,
    `/api/vehicle-models?vehicle_maker_id=${a.vehicle_maker_id}&limit=500`,
    `/api/vehicles/makers/${a.vehicle_maker_id}/models?limit=500`,
    `/api/vehicles/models?limit=500&search=Cascadia`,
    `/api/vehicle-models?search=Cascadia&limit=500`,
  ])){
    const r=await api(path); const l=listOf(r);
    out.tried.push({path, status:r.status, n:l.length,
      head: l.length?undefined:(r.head||'').slice(0,110)});
    const hit=l.find(x=>String(x.name||x.model||'').toLowerCase()==='cascadia');
    if(hit){ modelId=hit.id; out.modelFoundVia=path; out.modelName=hit.name||hit.model; break; }
  }
  out.cascadiaModelId=modelId;
  if(modelId){
    const w=await api('/api/vehicles/change','POST',
      {...a, vehicle_id:a.id, company_id:a.company_id||live.customer,
       vehicle_model_id:modelId, ...(makerId?{vehicle_maker_id:makerId}:{})});
    out.write={status:w.status};
    await page.waitForTimeout(3000);
    const after=await findAsset();
    out.after={model:after&&after.vehicle_model, modelId:after&&after.vehicle_model_id};
    out.landed = String((after&&after.vehicle_model)||'').toLowerCase()==='cascadia';
  } else {
    out.note='no model list endpoint answered with a Cascadia entry -- the vehicle keeps its current model';
  }
}
fs.writeFileSync(`${DIR}/SEED-ASSET-MODEL.json`, JSON.stringify(out,null,1));
console.log(JSON.stringify({before:out.before, modelId:out.cascadiaModelId, write:out.write,
  after:out.after, landed:out.landed, tried:out.tried.map(t=>`${t.path} -> ${t.status}/${t.n}`)},null,1));
await browser.close();
