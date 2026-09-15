// The last run reported 23 permissions and a working search for a person with no branch -- but the
// request to become that person had been REFUSED, so what it actually measured was the
// administrator's own session. Nothing about that person was learned (Rule 104).
//
// This finds out whether the refusal is about THAT person or about the branchless state itself:
// the same call is made for a person known to work (the positive control), for several active
// people with no branch, and for one inactive one. The answers are reported side by side.
import fs from 'fs';
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
const DIR='/home/user/Manual-test-Cases/build/global-search/tickets-2026-09-14';
const R={at:new Date().toISOString(), attempts:[]};
const L=(...a)=>console.log(a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));
const { browser, page, APIH } = await boot('sv9160','/','admin');
const api=async(p,m='GET',b=null)=>page.evaluate(async([u,mm,bb])=>{ try{
    const r=await fetch(u,{method:mm,headers:{Accept:'application/json','Content-Type':'application/json'},
      credentials:'include',body:bb?JSON.stringify(bb):undefined});
    const t=await r.text(); let j=null; try{j=JSON.parse(t)}catch(e){}
    return {status:r.status,json:j,body:t.slice(0,300)};}catch(e){return {error:String(e).slice(0,120)};}},
  [`https://${APIH}${p}`,m,b]);

const who=async()=>{ const fe=await api('/api/auth/me/fe-permissions');
  const d=fe.json&&(fe.json.data!==undefined?fe.json.data:fe.json);
  const l=d&&(d.fe_permissions||d.fePermissions||d.permissions);
  const perms=Array.isArray(l)?l:(l?Object.values(l):[]);
  const wp=await api('/api/staff/my-workplaces');
  const wd=wp.json&&(wp.json.data!==undefined?wp.json.data:wp.json);
  const wl=Array.isArray(wd)?wd:(wd&&(wd.workplaces||wd.collection)||[]);
  return {nPerms:perms.length, role:d&&(d.template_slug||d.templateSlug),
          branches:wl.map(x=>x.name)}; };

R.asAdmin=await who();
L('signed in as the administrator:', JSON.stringify(R.asAdmin));

const list=await api('/api/staff?pagination%5Bpage%5D=1&pagination%5BrowsPerPage%5D=1000&pagination%5BsortBy%5D=first_name&pagination%5Bdescending%5D=false&search=');
const d=list.json&&(list.json.data!==undefined?list.json.data:list.json);
const rows=Array.isArray(d)?d:(d&&(d.collection||d.items)||[]);
const noBranchActive=rows.filter(r=>!r.workplace_id&&r.is_active);
const noBranchInactive=rows.filter(r=>!r.workplace_id&&!r.is_active);
const withBranchActive=rows.filter(r=>r.workplace_id&&r.is_active);
R.counts={people:rows.length, activeWithNoBranch:noBranchActive.length,
  inactiveWithNoBranch:noBranchInactive.length, activeWithABranch:withBranchActive.length};
L('people:', JSON.stringify(R.counts));

const tryOne=async (label,r)=>{
  const res=await api('/api/switch-user','POST',{user_id:r.id});
  const rec={label, name:`${r.first_name||''} ${r.last_name||''}`.trim(), id:r.id,
    hasBranch:!!r.workplace_id, active:!!r.is_active, status:res.status, answer:res.body.slice(0,200)};
  if(res.status>=200&&res.status<300){ await page.waitForTimeout(2000); rec.became=await who(); }
  R.attempts.push(rec); L('  ', label, rec.name, '->', rec.status, JSON.stringify(rec.became||rec.answer).slice(0,140));
  return rec;
};

// positive control FIRST: a person known to work
const clayton=rows.find(r=>(r.email||'')==='clayton.stephens@staging.shopview.local');
if(clayton) await tryOne('control (has a branch)', clayton);
for(const r of noBranchActive.slice(0,4)) await tryOne('active, no branch', r);
if(noBranchInactive.length) await tryOne('inactive, no branch', noBranchInactive[0]);

R.control_becomingSomeoneWorksAtAll = R.attempts.some(a=>a.status>=200&&a.status<300);
R.anyBranchlessPersonReachable = R.attempts.some(a=>!a.hasBranch&&a.status>=200&&a.status<300);
fs.writeFileSync(`${DIR}/C45159-SWITCH.json`,JSON.stringify(R,null,1));
L('becoming someone works at all:', R.control_becomingSomeoneWorksAtAll,
  '| a branchless person could be reached:', R.anyBranchlessPersonReachable);
await browser.close();
