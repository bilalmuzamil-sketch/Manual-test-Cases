// Can the role-gated cases (C45142-C45151, C45159, C53589) actually be run on this branch?
// Twelve of run 415's cases need a user who is NOT an administrator. Before any of them can be
// judged, two things have to be true and neither is assumable:
//   1. a restricted role can be created and given to a staff member, and
//   2. this harness can SIGN IN as that staff member.
// (2) is the real question: qa-branch-boot signs in through the branch's DEV MODE quick-login
// panel, which offers Admin and Tech. If that panel is populated from a list of staff, any staff
// member we create is reachable; if it is a fixed pair, it is not, and the honest answer is to say
// which of the seven unblocking routes were tried (Rule 107) rather than to call it blocked.
//
// This probe WRITES NOTHING. It reads what exists and reports what is reachable.
import fs from 'fs';
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
const { browser, page, APIH } = await boot('sv9160','/','admin');
const out={at:new Date().toISOString()};
const api=async(path)=>page.evaluate(async(u)=>{
  try{ const r=await fetch(u,{headers:{Accept:'application/json'},credentials:'include'});
    const t=await r.text();
    return {status:r.status, body:t.slice(0,4000), json:(()=>{try{return JSON.parse(t)}catch(e){return null}})()};
  }catch(e){ return {error:String(e).slice(0,120)}; }}, `https://${APIH}${path}`);

// 1. WHO can this harness sign in as?
const ql=await api('/api/quick-login/users');
out.quickLogin={status:ql.status};
if(ql.json){ const arr=ql.json.data||ql.json;
  out.quickLogin.users=(Array.isArray(arr)?arr:[]).map(u=>({
    id:u.id, name:u.name||u.full_name||[u.first_name,u.last_name].filter(Boolean).join(' '),
    email:u.email, role:(u.role&&(u.role.name||u.role.title))||u.role_name||null,
    slug:(u.role&&u.role.template_slug)||u.template_slug||null}));
  out.quickLogin.count=out.quickLogin.users.length; }
else out.quickLogin.bodyHead=(ql.body||'').slice(0,200);

// 2. WHAT roles already exist -- an existing restricted role is cheaper than a new one, and it is
//    also the answer to "could these cases be run by a human tester today?"
for(const p of ['/api/roles','/api/role-templates','/api/permissions','/api/staff','/api/users']){
  const r=await api(p);
  const j=r.json&&(r.json.data||r.json);
  out[p]={status:r.status, isArray:Array.isArray(j), n:Array.isArray(j)?j.length:null,
    sample:Array.isArray(j)?j.slice(0,6).map(x=>({id:x.id,name:x.name||x.title||x.slug,
      slug:x.template_slug||x.slug, perms:Array.isArray(x.fePermissions)?x.fePermissions.length:
        (Array.isArray(x.permissions)?x.permissions.length:null)})):
      (r.json?String(JSON.stringify(r.json)).slice(0,300):(r.body||'').slice(0,160))};
}
// 2b. WHICH LOCATION is this browser session in? The handoff's trap -- "a whole area looks empty,
//     you have not set the location" -- applies to the RUN, not only to seeding: work orders and
//     part sales are scoped to the current workplace, and the official seeder pins itself to the
//     "Heavy Duty" workplace before creating anything. The browser signs in separately, so its
//     location is whatever the admin user defaults to, and a mismatch would read as missing data.
const wp=await api('/api/staff/my-workplaces');
out.workplaces={status:wp.status};
if(wp.json){ const d=(wp.json.data!==undefined?wp.json.data:wp.json);
  const list=Array.isArray(d)?d:(d.workplaces||d.collection||[]);
  out.workplaces.list=list.map(x=>({id:x.id,name:x.name,tz:x.timezone,
    current:!!(x.is_current||x.current||x.selected)}));}
const me=await api('/api/auth/me');
if(me.json){ const d=me.json.data||me.json;
  out.currentSession={workplace:d.workplace||d.current_workplace||d.location||null,
    email:d.email, role:d.role&&(d.role.name)};}

// 3. The DEV MODE panel as RENDERED -- the list above is the source, the buttons are the surface.
await page.goto(`https://sv9160.qa.shopview.com/login`,{waitUntil:'domcontentloaded'});
await page.waitForTimeout(6000);
out.devPanelButtons=await page.evaluate(()=>[...document.querySelectorAll('button')]
  .map(b=>(b.innerText||'').replace(/\s+/g,' ').trim()).filter(Boolean).slice(0,30));
fs.writeFileSync('/home/user/Manual-test-Cases/build/global-search/tickets-2026-09-14/ROLES-PROBE.json',
  JSON.stringify(out,null,1));
console.log(JSON.stringify({quickLoginCount:out.quickLogin.count, buttons:out.devPanelButtons},null,1));
await browser.close();
