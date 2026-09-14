// Run the role-gated cases by IMPERSONATING an existing holder of each role.
//
// The twelve role cases were called blocked on "quick-login only offers Admin and Tech". This branch
// carries 66 staff across five real roles -- Admin, Technician, Foreman, Sales Representative and
// Senior Service Advisor -- so POST /api/switch-user reaches four non-admin permission sets without
// creating a user, without editing a role, and with nothing to restore afterwards. Rule 107
// authorises it; the admin staff user's own role is never touched.
//
// 🛑 THE POSITIVE CONTROL IS THE WHOLE TEST (Rule 104). "This role sees no work orders" and "my
// session broke" produce the identical screen: an empty result. So for every role this records the
// permission set the server reports BEFORE searching, and any role whose identity did not actually
// change is reported as an instrument failure, never as a permission finding.
//
// One fresh browser per role: the playbook warns that changing who you are mid-session bounces the
// SPA to /no-location, which reads as a permission result and is a technique artifact.
import fs from 'fs';
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
const DIR='/home/user/Manual-test-Cases/build/global-search/tickets-2026-09-14';
const EV=`${DIR}/roles-evidence`; fs.mkdirSync(EV,{recursive:true});
const STATE=`${DIR}/ROLES-OBSERVED.json`;
const L=(...a)=>console.log(new Date().toISOString().slice(11,19),a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));
const R=fs.existsSync(STATE)?JSON.parse(fs.readFileSync(STATE,'utf8')):{at:new Date().toISOString(),roles:{}};
const save=()=>fs.writeFileSync(STATE,JSON.stringify(R,null,1));
const QUERY='ZZAUTOTEST';   // one word that matches a record of five different types

// Read the staff list LIVE and keep the active flag. The first attempt took the first holder of each
// role and both refusals named the reason: "Cannot impersonate an inactive user" and "Access denied".
// So: only active users, and several candidates per role rather than one -- a single 403 is a fact
// about that user, not about the role (Rule 68).
const boot0=await boot('sv9160','/','admin');
const staffRaw=await boot0.page.evaluate(async(u)=>{
  const r=await fetch(u,{headers:{Accept:'application/json'},credentials:'include'});
  const t=await r.text(); try{return JSON.parse(t)}catch(e){return null}},
  `https://${boot0.APIH}/api/staff?limit=200`);
await boot0.browser.close();
const sd=staffRaw&&(staffRaw.data!==undefined?staffRaw.data:staffRaw);
const slist=(Array.isArray(sd)?sd:((sd&&(sd.collection||sd.staff))||[])).map(x=>({
  id:x.id, email:x.email, name:[x.first_name,x.last_name].filter(Boolean).join(' '),
  role:x.role_label||(x.role&&x.role.name)||null,
  active: !(x.is_inactive||x.inactive||x.deleted_at) && (x.is_active!==false) && (x.status!=='inactive')}));
fs.writeFileSync(`${DIR}/STAFF-LIVE.json`, JSON.stringify(slist,null,1));
const byRole={};
for(const s of slist){ if(!s.role||s.role==='Admin'||!s.active) continue;
  (byRole[s.role]=byRole[s.role]||[]).push(s); }
const targets=Object.entries(byRole).map(([role,people])=>({role, people:people.slice(0,4)}));
console.log('active non-admin roles:', targets.map(t=>`${t.role} (${t.people.length} candidates)`).join(' · '));

for(const tgt of targets){
  const key=tgt.role;
  if(R.roles[key]){ L('skip',key); continue; }
  const { browser, page, APIH, APP, templateSlug, nFePerms } = await boot('sv9160','/','admin');
  const api=async(p,method='GET',body=null)=>page.evaluate(async([u,m,b])=>{
    try{ const r=await fetch(u,{method:m,headers:{Accept:'application/json','Content-Type':'application/json'},
          credentials:'include', body:b?JSON.stringify(b):undefined});
      const tx=await r.text(); let j=null; try{j=JSON.parse(tx)}catch(e){}
      return {status:r.status,json:j,head:tx.slice(0,250)};
    }catch(e){ return {error:String(e).slice(0,140)}; }},[`https://${APIH}${p}`,method,body]);

  const rec={adminBaseline:{templateSlug,nFePerms}, attempts:[]};
  let t=null, sw=null;
  for(const cand of tgt.people){
    const r=await api('/api/switch-user','POST',{user_id:cand.id});
    rec.attempts.push({name:cand.name, email:cand.email, status:r.status, head:r.head});
    if(r.status>=200&&r.status<300){ t=cand; sw=r; break; }
  }
  if(!t){ rec.instrument='no active holder of this role could be impersonated -- see attempts';
    R.roles[key]=rec; save(); L(`${key}: no candidate impersonated`); await browser.close(); continue; }
  rec.staff={id:t.id,name:t.name,email:t.email,role:t.role};
  rec.switch={status:sw.status, head:sw.head};

  await page.goto(`${APP}/workorders`,{waitUntil:'domcontentloaded'});
  await page.waitForTimeout(8000);
  // WHO AM I NOW -- read from the server's own answer, not from the fact the call returned 200.
  const who=await page.evaluate(()=>{ let u=null,w=null;
    try{u=JSON.parse(localStorage.getItem('user')||'null')}catch(e){}
    try{w=JSON.parse(localStorage.getItem('fe_permissions_wrapper')||'null')}catch(e){}
    const wd=w&&(w.data||w); const fe=wd&&(wd.fe_permissions||wd.fePermissions);
    return {templateSlug:wd&&(wd.template_slug||wd.templateSlug)||null,
      perms:Array.isArray(fe)?fe.slice().sort():(fe?Object.keys(fe).sort():null),
      email:u&&u.data&&u.data.email, roleName:u&&u.data&&u.data.role&&u.data.role.name};});
  rec.now={templateSlug:who.templateSlug, nPerms:who.perms?who.perms.length:null,
           email:who.email, roleName:who.roleName};
  rec.identityChanged = !!(who.email && t.email && who.email.toLowerCase()===t.email.toLowerCase())
                     || (who.perms && nFePerms!==null && who.perms.length!==nFePerms);
  rec.permissions = who.perms;
  rec.url=page.url();

  if(!rec.identityChanged){
    rec.instrument='the session did NOT become this user -- anything it shows is about the harness, not about permissions';
  } else {
    const trig=await page.evaluate(()=>{const b=document.querySelector('[data-test-id="global_search_trigger"]');
      if(!b) return false; const r=b.getBoundingClientRect(); return r.width>2&&r.height>2;});
    rec.searchReachable=trig;
    if(trig){
      await page.evaluate(()=>{const b=document.querySelector('[data-test-id="global_search_trigger"]'); b&&b.click();});
      await page.waitForSelector('[data-test-id="search_modal_input"]',{state:'visible',timeout:20000}).catch(()=>{});
      await page.fill('[data-test-id="search_modal_input"]','').catch(()=>{});
      await page.type('[data-test-id="search_modal_input"]',QUERY,{delay:35}).catch(()=>{});
      let last=null,st=0;
      for(let i=0;i<25;i++){ await page.waitForTimeout(1000);
        const m=await page.evaluate(()=>{const vis=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
          const d=[...document.querySelectorAll('.q-dialog,[role=dialog]')].filter(vis).pop(); if(!d) return null;
          const tabs={}; d.querySelectorAll('[data-test-id^="search_modal_tab_"]').forEach(e=>{
            const x=(e.innerText||'').match(/\((\d+)\)/); tabs[e.getAttribute('data-test-id').replace('search_modal_tab_','')]=x?+x[1]:null;});
          const rows=[...d.querySelectorAll('[data-test-id^="search_result_row_"]')].map(e=>({
            type:e.getAttribute('data-test-id').replace('search_result_row_','').replace(/_\d+$/,''),
            text:(e.innerText||'').replace(/\s+/g,' ').trim().slice(0,70)}));
          const c=d.querySelector('[data-test-id="search_modal_result_count"]');
          return {tabs, rows, countLine:c?(c.innerText||'').trim():null,
            noResults:/no results|nothing found/i.test(d.innerText||''),
            unavailable:/search unavailable|an error occurred/i.test(d.innerText||'')};});
        if(!m){st=0;continue;}
        const sig=JSON.stringify(m);
        if(sig===last){ if(++st>=3) { rec.search=m; break; } } else st=0;
        last=sig; }
      if(!rec.search) rec.search={note:'the result never settled'};
      rec.typesShown=rec.search.rows?[...new Set(rec.search.rows.map(r=>r.type))]:null;
    }
    await page.screenshot({path:`${EV}/${key.replace(/\s+/g,'-')}.png`});
  }
  R.roles[key]=rec; save();
  L(`${key}: switch=${rec.switch.status} identityChanged=${rec.identityChanged} perms=${rec.now.nPerms} types=${JSON.stringify(rec.typesShown)}`);
  await browser.close();
}
L('roles observed:', Object.keys(R.roles).join(', '));
