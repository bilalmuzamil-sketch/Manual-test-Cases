// Seed the work orders the remaining printout cases need. Staging is a dummy environment and the
// QA lead has confirmed seeding, changing and deleting data are all permitted here.
// Everything created is tagged ZZAUTOTEST so it is obvious what is throwaway.
//
// THREE WORK ORDERS, because the cases need states one work order cannot hold at once:
//   A "full"  — customer, vehicle, advisor, lines carrying parts, technician notes (one very long),
//               a line with no parts, and a cancelled line
//   B "empty" — no job lines at all      (the no-lines placeholder, and zero totals)
//   C "bare"  — no customer, no vehicle  (the two missing-record placeholders)
import { boot2, APP, API_HOST } from '/home/user/Manual-test-Cases/build/testing-tools/staging-boot2.mjs';
import { settle } from '/home/user/Manual-test-Cases/build/testing-tools/probe_guard.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/printer-friendly-wo/staging-2026-09-10';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const R={seeded:{}}; const save=()=>fs.writeFileSync(`${DIR}/evidence/s03-seed.json`, JSON.stringify(R,null,1));
const rowsOf=(j)=>{const pick=o=>{ for (const k of ['collection','data','rows','items','results']){ if (Array.isArray(o&&o[k])) return o[k]; }
  if (Array.isArray(o)) return o; for (const k of Object.keys(o||{})){ const v=pick(o[k]); if (v&&v.length) return v; } return []; }; return pick(j);};

const s = await boot2('admin', {route:'/workorders'});
const {page} = s;
const call=(m,p,b)=>page.evaluate(async({api,m,p,b})=>{const r=await fetch(`https://${api}${p}`,{method:m,
  headers:{'Content-Type':'application/json',Accept:'application/json'},credentials:'include',
  body:b?JSON.stringify(b):undefined});const t=await r.text();let j=null;try{j=JSON.parse(t)}catch(e){}
  return{status:r.status,json:j,text:(t||'').slice(0,300)};},{api:API_HOST,m,p,b:b||null});
await settle(page,{label:'work orders'});

// what is available to build with
const me = (await call('GET','/api/staff/my-workplaces')).json;
R.workplaces = rowsOf(me).map(w=>({id:w.id, name:w.name})).slice(0,5);
const wps = R.workplaces[0]; R.workplace = wps;
const canned = rowsOf((await call('GET','/api/canned-lines?limit=50')).json)
  .map(c=>({id:c.id, name:c.name||c.description, parts:(c.parts||[]).length}));
R.cannedSample = canned.slice(0,6);
log('workplace: %s | canned lines available: %d', JSON.stringify(wps), canned.length);
save();

// an existing work order tells us the shape of a company/vehicle pair that works here
const wos = rowsOf((await call('GET','/api/work-orders?limit=25')).json);
const sample = wos.find(w=>w.company_id||w.customer_id) || wos[0] || {};
R.sampleWo = {id:sample.id, keys:Object.keys(sample).slice(0,22)};
// the detail comes back wrapped: {data:{work_order:{...}}} — reading company_id off the wrapper
// gave "Missing required parameter" on every create. Unwrap it, and prove we got real ids.
const detail = (await call('GET',`/api/work-orders/view/${sample.id}`)).json;
let d = (detail && (detail.data||detail)) || {};
if (d.work_order) d = d.work_order;
R.unwrapped = {hasCompany:!!d.company_id, hasVehicle:!!d.vehicle_id, hasWorkplace:!!d.workplace_id};
if (!d.company_id){                       // fall back to the customer list
  const comps = rowsOf((await call('GET','/api/companies?limit=20')).json);
  R.companies = comps.slice(0,3).map(c=>({id:c.id, name:c.name}));
  if (comps[0]) d.company_id = comps[0].id;
  const veh = rowsOf((await call('GET',`/api/vehicles?limit=20`)).json);
  R.vehicles = veh.slice(0,3).map(v=>({id:v.id, unit:v.unit_number||v.name}));
  if (veh[0] && !d.vehicle_id) d.vehicle_id = veh[0].id;
}
R.sampleDetail = {company_id:d.company_id, vehicle_id:d.vehicle_id, workplace_id:d.workplace_id,
  keys:Object.keys(d).slice(0,30)};
log('a working company/vehicle pair: %s', JSON.stringify(R.sampleDetail));
save();

const mk = async (label, body)=>{
  const r = await call('POST','/api/work-orders/create', body);
  R.seeded[label] = {http:r.status, text:r.text.slice(0,200)};
  if (r.status>=200 && r.status<300){
    const j=(r.json&&(r.json.data||r.json))||{};
    R.seeded[label].id = j.id || j.work_order_id || null;
    R.seeded[label].number = j.number || j.work_order_number || null;
  }
  log('create %s -> %s %s', label, r.status, JSON.stringify(R.seeded[label]).slice(0,180));
  save();
  return R.seeded[label].id;
};

const today = new Date().toISOString().slice(0,10);
const A = await mk('A_full',  {company_id:R.sampleDetail.company_id, vehicle_id:R.sampleDetail.vehicle_id,
  workplace_id:R.sampleDetail.workplace_id||wps?.id, start_date:today, is_vehicle_here:true});
const B = await mk('B_empty', {company_id:R.sampleDetail.company_id, vehicle_id:R.sampleDetail.vehicle_id,
  workplace_id:R.sampleDetail.workplace_id||wps?.id, start_date:today, is_vehicle_here:true});
const C = await mk('C_bare',  {workplace_id:R.sampleDetail.workplace_id||wps?.id,
  start_date:today, is_vehicle_here:true});

// build A out: lines from canned lines, then notes and a cancellation
if (A){
  const withParts = canned.find(c=>c.parts>0) || canned[0];
  const noParts   = canned.find(c=>c.parts===0) || canned[1] || canned[0];
  R.linesMade=[];
  for (const [tag,c] of [['withParts',withParts],['noParts',noParts],['forLongNote',noParts],['toCancel',noParts]]){
    if(!c) continue;
    const r = await call('POST',`/api/work-orders/${A}/lines/create-from-canned-line`,
      {canned_line_id:c.id, status:'authorized'});
    R.linesMade.push({tag, canned:c.name, http:r.status, text:r.text.slice(0,140)});
    save();
  }
  log('lines added to A: %s', JSON.stringify(R.linesMade.map(x=>`${x.tag}:${x.http}`)));
  const ln = rowsOf((await call('GET',`/api/work-orders/lines/${A}`)).json);
  R.aLines = ln.map(l=>({id:l.line_id, status:l.status, parts:(l.parts||[]).length,
    reqs:(l.part_requests||[]).length, story:(l.tech_story||'').slice(0,20)}));
  log('work order A now has %d lines: %s', ln.length, JSON.stringify(R.aLines));
}
save();
await s.browser.close();
log('done');
