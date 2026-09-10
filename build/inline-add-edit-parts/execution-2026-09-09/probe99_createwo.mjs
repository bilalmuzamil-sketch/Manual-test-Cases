// UNBLOCK 3 — a work order by CREATING one, so C45035, C45061 and C45251 stop being blocked by an
// environment my own testing used up. Every spare work order now carries part requests, and one line
// is wedged by a request stuck at waiting_to_receive that nothing clears. A fresh work order has
// clean lines by definition.
// The playbook warns `work-orders/create` returns 500 in some sessions and gives the UI route as the
// fallback (customer page -> Work Orders tab -> New Work Order); both are tried here.
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/inline-add-edit-parts/execution-2026-09-09';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const VIS=`(e)=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);
  return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden'&&parseFloat(c.opacity)>0.01;}`;
const s = await boot('sv9315','/workorders','admin'); const { page, APP, APIH } = s;
const R={};
const save=()=>fs.writeFileSync(`${DIR}/evidence/99-createwo.json`, JSON.stringify(R,null,1));
const api = (path, body)=>page.evaluate(async ({api,path,body})=>{
  const r=await fetch(`https://${api}${path}`, body? {method:'POST',
      headers:{'Content-Type':'application/json',Accept:'application/json'}, credentials:'include', body:JSON.stringify(body)}
    : {headers:{Accept:'application/json'}, credentials:'include'});
  let t=null; try{ t=await r.text(); }catch(e){}
  let j=null; try{ j=JSON.parse(t); }catch(e){}
  return {status:r.status, json:j, text:(t||'').slice(0,400)};}, {api:APIH, path, body:body||null});
const rowsOf=(j)=>{const pick=o=>{ for (const k of ['collection','data','rows','items','results']){ if (Array.isArray(o&&o[k])) return o[k]; }
  if (Array.isArray(o)) return o; for (const k of Object.keys(o||{})){ const v=pick(o[k]); if (v&&v.length) return v; } return []; }; return pick(j);};

// copy the shape from a work order that exists, rather than guessing the payload
const list = await api('/api/work-orders?limit=20&page=1');
const sample = rowsOf(list.json)[0];
const view = sample ? await api(`/api/work-orders/view/${sample.id}`) : null;
// the view response nests the record under `work_order` — the first read returned {keys:["work_order"]}
let v = (view && view.json && (view.json.data||view.json)) || {};
v = v.work_order || v;
R.shape = {keys:Object.keys(v).slice(0,26), company_id:v.company_id, customer_id:v.customer_id||v.contact_id,
  vehicle_id:v.vehicle_id, workplace_id:v.workplace_id, type:v.type};
log('an existing work order, for its shape: %s', JSON.stringify(R.shape).slice(0,420));
save();
R.tries=[];
for (const [label, body] of [
  ['copied from an existing work order', {company_id:v.company_id, customer_id:v.customer_id||v.contact_id,
     vehicle_id:v.vehicle_id, workplace_id:v.workplace_id, type:v.type||'service', is_vehicle_here:true}],
  ['minimal', {company_id:v.company_id, vehicle_id:v.vehicle_id, workplace_id:v.workplace_id, type:'service'}],
]){
  const r = await api('/api/work-orders/create', body);
  R.tries.push({label, status:r.status, text:r.text.slice(0,240)});
  log('work-orders/create [%s] -> %s %s', label, r.status, r.text.slice(0,180));
  save();
  if (r.status===200||r.status===201){
    const d = (r.json && (r.json.data||r.json)) || {};
    R.newWO = {id:d.id||d.work_order_id, number:d.number};
    log('*** CREATED %s ***', JSON.stringify(R.newWO));
    break;
  }
}
if (R.newWO && R.newWO.id){
  // give it a line, so there is something to complete
  const canned = await api('/api/work-orders/canned-lines');
  const cl = rowsOf(canned.json)[0];
  R.cannedLine = cl && {id:cl.id||cl.value, name:(cl.name||cl.label||'').slice(0,40)};
  if (R.cannedLine){
    const lr = await api(`/api/work-orders/${R.newWO.id}/lines/create-from-canned-line`,
      {canned_line_id:R.cannedLine.id, status:'authorized'});
    R.lineCreate = {status:lr.status, text:lr.text.slice(0,200)};
    log('added a line: %s', JSON.stringify(R.lineCreate));
  }
  const d2 = await api(`/api/work-orders/lines/${R.newWO.id}`);
  R.lines = rowsOf(d2.json).map(l=>({id:l.line_id, status:l.status, reqs:(l.part_requests||[]).length}));
  log('the new work order has lines: %s', JSON.stringify(R.lines));
  save();
}
await s.browser.close();
