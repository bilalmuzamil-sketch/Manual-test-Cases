// READ-ONLY. Enumerate roles + their work-order view mode, and read the Tech staff's CURRENT role
// so it can be restored afterwards. Nothing is written. The Admin role/staff is never touched.
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/inline-add-edit-parts/execution-2026-09-09';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const s = await boot('sv9315','/workorders','admin');
const { page, APIH } = s;
const out={};
const j = await page.evaluate(async (h)=>{
  const get=async u=>{try{const r=await fetch(`https://${h}${u}`,{credentials:'include',headers:{Accept:'application/json'}});
    return r.ok?{ok:1,d:await r.json()}:{ok:0,s:r.status};}catch(e){return{ok:0,e:String(e)}}};
  const res={};
  for (const u of ['/api/iam/roles','/api/roles','/api/iam/role-templates','/api/staff','/api/iam/staff','/api/staff?limit=100']) res[u]=await get(u);
  return res;
}, APIH);
for (const [u,v] of Object.entries(j)) {
  if (!v.ok) { log(u,'->',v.s||v.e); continue; }
  const d=v.d?.data ?? v.d; const coll=d?.collection ?? d;
  log(u,'-> OK,', Array.isArray(coll)?coll.length+' rows':'obj keys '+Object.keys(d||{}).slice(0,8));
  if (Array.isArray(coll) && coll.length) {
    out[u]=coll;
    log('   sample keys:', Object.keys(coll[0]).slice(0,16).join(','));
    for (const r of coll.slice(0,20)) {
      const nm=r.name??r.title??r.first_name??r.label;
      const vm=r.view_mode??r.wo_view_mode??r.workOrderViewMode??r.settings?.view_mode;
      const rl=r.role?.name ?? r.role_name ?? (r.roles&&r.roles[0]&&r.roles[0].name);
      log(`   - ${String(nm).slice(0,34).padEnd(34)} view_mode=${vm ?? '-'} role=${rl ?? '-'} id=${r.id??'-'}`);
    }
  }
}
fs.writeFileSync(`${DIR}/evidence/04-roles.json`, JSON.stringify(out,null,1));
await s.browser.close();
