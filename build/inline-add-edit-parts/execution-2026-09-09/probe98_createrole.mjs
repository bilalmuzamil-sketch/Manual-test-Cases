// UNBLOCK 2 — a role by CREATING one, not by editing an existing one.
// Editing a role does not persist on this branch (probe 69: Save fires only check-existing-roles and
// no role write at all). Creation is a different endpoint and was never tried. If a role can be
// created with the shape a case needs, and assigned to the Tech staff, then C53477, C45066, C45032
// and C44995 all become testable.
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/inline-add-edit-parts/execution-2026-09-09';
const TECH_ROLE='2d4b8464-81a9-4c1e-96c6-a2a64f02a389';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const VIS=`(e)=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);
  return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden'&&parseFloat(c.opacity)>0.01;}`;
const s = await boot('sv9315','/workorders','admin'); const { page, APP, APIH } = s;
const R={};
const save=()=>fs.writeFileSync(`${DIR}/evidence/98-createrole.json`, JSON.stringify(R,null,1));
const api = (path, body)=>page.evaluate(async ({api,path,body})=>{
  const r=await fetch(`https://${api}${path}`, body? {method:'POST',
      headers:{'Content-Type':'application/json',Accept:'application/json'}, credentials:'include', body:JSON.stringify(body)}
    : {headers:{Accept:'application/json'}, credentials:'include'});
  let t=null; try{ t=await r.text(); }catch(e){}
  let j=null; try{ j=JSON.parse(t); }catch(e){}
  return {status:r.status, json:j, text:(t||'').slice(0,600)};}, {api:APIH, path, body:body||null});
const rowsOf=(j)=>{const pick=o=>{ for (const k of ['collection','data','rows','items','results']){ if (Array.isArray(o&&o[k])) return o[k]; }
  if (Array.isArray(o)) return o; for (const k of Object.keys(o||{})){ const v=pick(o[k]); if (v&&v.length) return v; } return []; }; return pick(j);};

// what does an existing role look like? copy its shape rather than guessing
const tech = await api(`/api/roles/${TECH_ROLE}`);
const t = (tech.json && (tech.json.data || tech.json)) || {};
R.template = {keys:Object.keys(t).slice(0,24), name:t.name, view_mode:t.view_mode,
  nPerms:(t.fe_permissions||[]).length, cross:t.cross_toggles};
log('the Technician role, as the API describes it: %s', JSON.stringify(R.template).slice(0,500));
save();
// ---- route A: the UI's own "Add Role" on Settings -> Roles & Permissions
await page.goto(`${APP}/administration/roles-permissions`,{waitUntil:'domcontentloaded',timeout:60000});
await page.waitForTimeout(12000);
R.rolesScreen = await page.evaluate(vis=>{const isVis=eval(vis); const tx=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  return {url:location.href,
    buttons:[...document.querySelectorAll('button,.q-btn')].filter(isVis).map(tx).filter(Boolean).slice(0,14),
    rows:[...document.querySelectorAll('tbody tr')].slice(0,8).map(r=>[...r.querySelectorAll('td')].map(tx).slice(0,3))};}, VIS);
log('Roles screen: %s', JSON.stringify(R.rolesScreen).slice(0,420));
await page.screenshot({path:`${DIR}/evidence/98-a-roles.png`, fullPage:true});
save();
// ---- route B: the API
const base = {name:'ZZAUTOTEST Full View no SFD', description:'throwaway test role',
  fe_permissions:(t.fe_permissions||[]).map(p=>p.id||p), view_mode:'full'};
R.tries=[];
for (const [label, path, body] of [
  ['roles/create',        '/api/roles/create',        base],
  ['roles (post)',        '/api/roles',               base],
  ['organizations/roles', '/api/organizations/roles', base],
  ['roles/change (clone)','/api/roles/change',        {...base, id:null}],
]){
  const r = await api(path, body);
  R.tries.push({label, path, status:r.status, text:r.text.slice(0,240)});
  log('%-22s -> %s %s', label, r.status, r.text.slice(0,170));
  save();
  if (r.status===200||r.status===201){ R.createdRole = r.json; break; }
}
// did a new role actually appear?
const after = await api('/api/roles?limit=200');
R.roleNames = rowsOf(after.json).map(x=>x.name).filter(Boolean);
R.newRoleThere = R.roleNames.some(n=>/ZZAUTOTEST/i.test(n));
log('roles now: %s', JSON.stringify(R.roleNames).slice(0,300));
log('*** DID A NEW ROLE STICK? %s ***', R.newRoleThere);
save();
await s.browser.close();
