// Reach the permission sets nobody currently holds, by giving a spare staff member a role for the
// length of one observation and then putting it back.
//
// Impersonating existing holders covered two of the role cases (a technician sees no parts and no
// suppliers; a foreman sees both). The rest need narrower access than anyone on this branch has:
//   · a TIME CLOCK user, who should get no search results at all
//   · a user without work-order access
//   · a user without customer access
// The branch has eleven role templates including "Time Clock User", so the sets exist -- they are
// simply unassigned.
//
// 🛑 SAFETY. It never touches the administrator account (the standing instruction), never touches the
// quick-login users, and works on ONE spare active staff member at a time. It records that person's
// CURRENT role before changing anything, restores it at the end, and READS IT BACK to prove the
// restore landed -- a success status is not evidence (this API has already answered 201 over a write
// that did nothing). If the restore cannot be proved, it says so loudly rather than exiting quietly.
import fs from 'fs';
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
const DIR='/home/user/Manual-test-Cases/build/global-search/tickets-2026-09-14';
const STATE=`${DIR}/ROLES-ASSIGNED.json`;
const L=(...a)=>console.log(new Date().toISOString().slice(11,19),a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));
const QUERY='ZZAUTOTEST';
const WANT=(process.env.TEMPLATES||'time_clock_user').split(',');
const R=fs.existsSync(STATE)?JSON.parse(fs.readFileSync(STATE,'utf8')):{at:new Date().toISOString(),runs:{}};
const save=()=>fs.writeFileSync(STATE,JSON.stringify(R,null,1));

const { browser, page, APIH, APP } = await boot('sv9160','/','admin');
const api=async(p,method='GET',body=null)=>page.evaluate(async([u,m,b])=>{
  try{ const r=await fetch(u,{method:m,headers:{Accept:'application/json','Content-Type':'application/json'},
        credentials:'include', body:b?JSON.stringify(b):undefined});
    const t=await r.text(); let j=null; try{j=JSON.parse(t)}catch(e){}
    return {status:r.status,json:j,body:t.slice(0,300)};
  }catch(e){ return {error:String(e).slice(0,140)}; }},[`https://${APIH}${p}`,method,body]);
const arr=(r)=>{ const d=r.json&&(r.json.data!==undefined?r.json.data:r.json);
  if(Array.isArray(d)) return d;
  if(d&&typeof d==='object') return Object.values(d).find(v=>Array.isArray(v))||[];
  return []; };

const templates=arr(await api('/api/role-templates'));
R.templates=templates.map(t=>({id:t.id,slug:t.slug,name:t.name})); save();

// a spare, ACTIVE staff member who is not an administrator and not a quick-login account
const staff=arr(await api('/api/staff?limit=200'))
  .filter(x=>x.email && !/^admin@|^tech@/i.test(x.email))
  .filter(x=>!(x.is_inactive||x.inactive||x.deleted_at) && x.is_active!==false)
  .filter(x=>(x.role_label||'')!=='Admin');
const subject=staff[0];
if(!subject){ L('no spare active non-admin staff member to work with'); await browser.close(); process.exit(2); }

// what is this person's role RIGHT NOW -- captured before anything changes
const detail=await api(`/api/staff/${subject.id}`);
const dd=detail.json&&(detail.json.data||detail.json);
const person=(dd&&(dd.staff||dd.user||dd))||{};
const originalRoleId=(person.role&&person.role.id)||person.role_id||null;
R.subject={id:subject.id, name:[subject.first_name,subject.last_name].filter(Boolean).join(' '),
  email:subject.email, roleLabel:subject.role_label, originalRoleId,
  detailStatus:detail.status, detailKeys:Object.keys(person).slice(0,25)};
save();
L('subject:', R.subject.name, '| current role:', R.subject.roleLabel, '| role id:', originalRoleId);
if(!originalRoleId){
  R.abort='could not read this person\'s current role, so it could not be put back afterwards -- nothing was changed';
  save(); L(R.abort); await browser.close(); process.exit(2);
}

const workplace=person.workplace_id||person.default_workplace||subject.workplace_id||null;
const setRole=async(roleId)=>api(`/api/staff/${subject.id}/change`,'POST',
  {first_name:subject.first_name, last_name:subject.last_name, email:subject.email,
   workplace_id:workplace, role_id:roleId});
const currentRole=async()=>{ const r=await api(`/api/staff/${subject.id}`);
  const d=r.json&&(r.json.data||r.json); const p=(d&&(d.staff||d.user||d))||{};
  return (p.role&&(p.role.id))||p.role_id||null; };

for(const slug of WANT){
  const tpl=templates.find(t=>t.slug===slug);
  if(!tpl){ R.runs[slug]={error:`no template named ${slug}`}; save(); continue; }
  const rec={template:{id:tpl.id,slug:tpl.slug,name:tpl.name}};
  const w=await setRole(tpl.id);
  rec.assign={status:w.status, body:w.body};
  await page.waitForTimeout(3000);
  rec.roleAfterAssign=await currentRole();
  rec.assignLanded = rec.roleAfterAssign===tpl.id;
  if(rec.assignLanded){
    const sw=await api('/api/switch-user','POST',{user_id:subject.id});
    rec.switch={status:sw.status, body:sw.body};
    if(sw.status>=200&&sw.status<300){
      const fe=await api('/api/auth/me/fe-permissions');
      const fd=fe.json&&(fe.json.data||fe.json); const fl=fd&&(fd.fe_permissions||fd.fePermissions);
      rec.serverIdentity={templateSlug:fd&&(fd.template_slug||fd.templateSlug),
        nPerms:Array.isArray(fl)?fl.length:(fl?Object.keys(fl).length:null)};
      await page.goto(`${APP}/workorders`,{waitUntil:'domcontentloaded'});
      await page.waitForTimeout(9000);
      rec.url=page.url();
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
              const t=(e.innerText||'').match(/\((\d+)\)/); tabs[e.getAttribute('data-test-id').replace('search_modal_tab_','')]=t?+t[1]:null;});
            return {tabs, rows:[...d.querySelectorAll('[data-test-id^="search_result_row_"]')].map(e=>({
              type:e.getAttribute('data-test-id').replace('search_result_row_','').replace(/_\d+$/,''),
              text:(e.innerText||'').replace(/\s+/g,' ').trim().slice(0,60)})),
              countLine:(()=>{const c=d.querySelector('[data-test-id="search_modal_result_count"]');
                return c?(c.innerText||'').trim():null;})(),
              noResults:/no results/i.test(d.innerText||'')};});
          if(!m){st=0;continue;}
          const sig=JSON.stringify(m);
          if(sig===last){ if(++st>=3){ rec.search=m; break; } } else st=0; last=sig; }
        rec.typesShown=rec.search&&rec.search.rows?[...new Set(rec.search.rows.map(r=>r.type))]:null;
        await page.screenshot({path:`${DIR}/roles-evidence/assigned-${slug}.png`}).catch(()=>{});
      }
    }
  }
  // PUT IT BACK, and prove it
  await browser.close();
  const again=await boot('sv9160','/','admin');
  const api2=async(p,method='GET',body=null)=>again.page.evaluate(async([u,m,b])=>{
    try{ const r=await fetch(u,{method:m,headers:{Accept:'application/json','Content-Type':'application/json'},
          credentials:'include', body:b?JSON.stringify(b):undefined});
      const t=await r.text(); let j=null; try{j=JSON.parse(t)}catch(e){}
      return {status:r.status,json:j,body:t.slice(0,200)};
    }catch(e){ return {error:String(e).slice(0,140)}; }},[`https://${again.APIH}${p}`,method,body]);
  const rest=await api2(`/api/staff/${subject.id}/change`,'POST',
    {first_name:subject.first_name, last_name:subject.last_name, email:subject.email,
     workplace_id:workplace, role_id:originalRoleId});
  await again.page.waitForTimeout(3000);
  const back=await api2(`/api/staff/${subject.id}`);
  const bd=back.json&&(back.json.data||back.json); const bp=(bd&&(bd.staff||bd.user||bd))||{};
  rec.restore={status:rest.status, roleNow:(bp.role&&bp.role.id)||bp.role_id||null,
    proved:((bp.role&&bp.role.id)||bp.role_id||null)===originalRoleId};
  if(!rec.restore.proved) L('🛑 RESTORE NOT PROVED for', subject.email, '-- role left as', rec.restore.roleNow);
  R.runs[slug]=rec; save();
  L(`${slug}: assigned=${rec.assignLanded} identity=${rec.serverIdentity&&rec.serverIdentity.templateSlug} types=${JSON.stringify(rec.typesShown)} restored=${rec.restore.proved}`);
  await again.browser.close();
  break;   // one template per run: each needs its own fresh sign-in
}
L('done');
