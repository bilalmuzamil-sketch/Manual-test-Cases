// UNBLOCK — a role change by PUT. Probe 98's last attempt returned the most useful error of the
// whole pass: POST /api/roles/change -> 405 "Method Not Allowed (Allow: PUT, DELETE, GET)". Every
// write tried so far has been a POST. The route exists and takes **PUT**.
// Only the TECHNICIAN role is touched, and it is put back at the end. The Admin staff's Admin role
// is never involved (the QA lead's standing rule).
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/inline-add-edit-parts/execution-2026-09-09';
const TECH_ROLE='2d4b8464-81a9-4c1e-96c6-a2a64f02a389';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const s = await boot('sv9315','/workorders','admin'); const { page, APIH } = s;
const R={};
const save=()=>fs.writeFileSync(`${DIR}/evidence/102-roleput.json`, JSON.stringify(R,null,1));
const call = (method, path, body)=>page.evaluate(async ({api,method,path,body})=>{
  const r=await fetch(`https://${api}${path}`, {method,
    headers:{'Content-Type':'application/json',Accept:'application/json'}, credentials:'include',
    body: body? JSON.stringify(body) : undefined});
  let t=null; try{ t=await r.text(); }catch(e){}
  let j=null; try{ j=JSON.parse(t); }catch(e){}
  return {status:r.status, json:j, text:(t||'').slice(0,600)};}, {api:APIH, method, path, body:body||null});

const before = await call('GET', `/api/roles/${TECH_ROLE}`);
const role = (before.json && (before.json.data||before.json)) || {};
R.before = {name:role.name, view_mode:role.view_mode, cross:role.cross_toggles,
  nPerms:(role.fe_permissions||[]).length, keys:Object.keys(role).slice(0,22)};
log('Technician before: %s', JSON.stringify(R.before));
save();
// what the four blocked cases need, one at a time
const permIds = (role.fe_permissions||[]).map(p=>p.id||p);
const variants = [
  ['Full View, See Financial Data still off (C53477)', {view_mode:'full'}],
  ['back to Tech view',                                 {view_mode:'tech'}],
];
R.tries=[];
for (const [label, patch] of variants){
  const body = {...role, ...patch, fe_permissions:permIds};
  const r = await call('PUT', `/api/roles/${TECH_ROLE}`, body);
  const back = await call('GET', `/api/roles/${TECH_ROLE}`);
  const now = (back.json && (back.json.data||back.json)) || {};
  const rec = {label, status:r.status, resp:r.text.slice(0,220),
    view_mode_after:now.view_mode, stuck: now.view_mode===patch.view_mode};
  R.tries.push(rec);
  log('PUT [%s] -> %s | view_mode is now %s | did it stick? %s', label, r.status, now.view_mode, rec.stuck);
  save();
}
R.putWorks = R.tries.some(t=>t.stuck);
log('*** CAN A ROLE BE CHANGED BY PUT? %s ***', R.putWorks);
// leave it exactly as it was
const restore = await call('PUT', `/api/roles/${TECH_ROLE}`, {...role, fe_permissions:permIds});
const fin = await call('GET', `/api/roles/${TECH_ROLE}`);
const f = (fin.json && (fin.json.data||fin.json)) || {};
R.restored = {status:restore.status, view_mode:f.view_mode, nPerms:(f.fe_permissions||[]).length,
  matchesOriginal: f.view_mode===role.view_mode && (f.fe_permissions||[]).length===(role.fe_permissions||[]).length};
log('restored: %s', JSON.stringify(R.restored));
save();
await s.browser.close();
