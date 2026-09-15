// C45159, third attempt -- and the two things that went wrong before are worth stating, because
// both produced confident readings that were about ME:
//
//  1. Becoming a person and then becoming ANOTHER person does not work: the second request is made
//     from the first person's session, and a technician may not impersonate anyone. Four "Access
//     denied" answers looked like a rule about branchless people and were a rule about the session
//     I had put myself in. ==> ONE switch per run, from a fresh administrator session.
//  2. An empty branch column does not mean the person has no branch in the app's eyes: an
//     administrator is offered every branch regardless. ==> the test is what the app offers THAT
//     PERSON (/staff/my-workplaces), not what the staff table shows.
//
// So: list the candidates with their roles, switch to exactly ONE, prove from their own session
// that they are offered no branch, and only then read the search panel.
import fs from 'fs';
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
const DIR='/home/user/Manual-test-Cases/build/global-search/tickets-2026-09-14';
const EV=`${DIR}/unrun3-evidence`; fs.mkdirSync(EV,{recursive:true});
const TARGET=process.env.TARGET_EMAIL||null;
const R={at:new Date().toISOString()};
const save=()=>fs.writeFileSync(`${DIR}/C45159-RUN-${(TARGET||'list').split('@')[0]}.json`,JSON.stringify(R,null,1));
const L=(...a)=>console.log(a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));
const { browser, page, APIH, APP } = await boot('sv9160','/','admin');
const api=async(p,m='GET',b=null)=>page.evaluate(async([u,mm,bb])=>{ try{
    const r=await fetch(u,{method:mm,headers:{Accept:'application/json','Content-Type':'application/json'},
      credentials:'include',body:bb?JSON.stringify(bb):undefined});
    const t=await r.text(); let j=null; try{j=JSON.parse(t)}catch(e){}
    return {status:r.status,json:j,body:t.slice(0,300)};}catch(e){return {error:String(e).slice(0,120)};}},
  [`https://${APIH}${p}`,m,b]);
const myBranches=async()=>{ const wp=await api('/api/staff/my-workplaces');
  const d=wp.json&&(wp.json.data!==undefined?wp.json.data:wp.json);
  const l=Array.isArray(d)?d:(d&&(d.workplaces||d.collection)||[]); return l.map(x=>x.name); };

const list=await api('/api/staff?pagination%5Bpage%5D=1&pagination%5BrowsPerPage%5D=1000&pagination%5BsortBy%5D=first_name&pagination%5Bdescending%5D=false&search=');
const d=list.json&&(list.json.data!==undefined?list.json.data:list.json);
const rows=Array.isArray(d)?d:(d&&(d.collection||d.items)||[]);
const candidates=rows.filter(r=>!r.workplace_id&&r.is_active&&!/admin/i.test(r.role_label||''));
R.candidates=candidates.map(r=>({name:`${r.first_name} ${r.last_name}`, email:r.email,
  id:r.id, role:r.role_label}));
L('active people with no branch who are not administrators:', R.candidates.length);
for(const c of R.candidates.slice(0,8)) L('   ', c.name, '|', c.role, '|', c.email);
save();
if(!TARGET){ L('\nno TARGET_EMAIL given - listing only'); await browser.close(); process.exit(0); }

const t=rows.find(r=>(r.email||'')===TARGET);
if(!t){ R.abort='no such person: '+TARGET; save(); L(R.abort); await browser.close(); process.exit(2); }
const sw=await api('/api/switch-user','POST',{user_id:t.id});
R.switchStatus=sw.status; R.switchAnswer=sw.body.slice(0,200);
if(sw.status<200||sw.status>=300){ R.abort='could not become '+TARGET; save();
  L(R.abort, sw.status, sw.body.slice(0,120)); await browser.close(); process.exit(3); }
await page.waitForTimeout(2500);
const fe=await api('/api/auth/me/fe-permissions');
{ const dd=fe.json&&(fe.json.data!==undefined?fe.json.data:fe.json);
  const l=dd&&(dd.fe_permissions||dd.fePermissions||dd.permissions);
  const perms=Array.isArray(l)?l:(l?Object.values(l):[]);
  R.subject={email:TARGET, role:dd&&(dd.template_slug||dd.templateSlug),
             permissions:perms.map(p=>p.name||p).sort()}; }
R.subject.branchesOfferedToThem=await myBranches();
R.theSubjectReallyHasNoBranch = R.subject.branchesOfferedToThem.length===0;
L('became', TARGET, '| role', R.subject.role, '| branches offered to them:',
  JSON.stringify(R.subject.branchesOfferedToThem));
save();

const errors=[];
page.on('pageerror', e=>errors.push('page: '+String(e).slice(0,160)));
page.on('console', m=>{ if(m.type()==='error') errors.push('console: '+m.text().slice(0,160)); });
await page.goto(`${APP}/workorders`,{waitUntil:'domcontentloaded'});
await page.waitForTimeout(6000);
await page.evaluate(()=>{const b=document.querySelector('[data-test-id="global_search_trigger"]'); b&&b.click();});
R.searchPanelOpened=await page.waitForSelector('[data-test-id="search_modal_input"]',{state:'visible',timeout:20000})
  .then(()=>true).catch(()=>false);
if(R.searchPanelOpened){
  await page.fill('[data-test-id="search_modal_input"]','').catch(()=>{});
  await page.type('[data-test-id="search_modal_input"]','Bridgeport',{delay:30});
  await page.waitForTimeout(12000);
  R.panel=await page.evaluate(()=>{const vis=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
    const dd=[...document.querySelectorAll('.q-dialog,[role=dialog]')].filter(vis).pop(); if(!dd) return null;
    const tabs={}; dd.querySelectorAll('[data-test-id^="search_modal_tab_"]').forEach(e=>{
      const m=(e.innerText||'').match(/\((\d+)\)/);
      tabs[e.getAttribute('data-test-id').replace('search_modal_tab_','')]=m?+m[1]:null;});
    return {tabs, rows:[...dd.querySelectorAll('[data-test-id^="search_result_row_"]')].length,
      words:(dd.innerText||'').replace(/\s+/g,' ').trim().slice(0,260),
      saysSomethingWentWrong:/error|something went wrong|failed|try again/i.test(dd.innerText||'')};});
}
R.errorsWhileUsingIt=errors.slice(0,8);
await page.screenshot({path:`${EV}/C45159-${TARGET.split('@')[0]}.png`});
L('panel opened:', R.searchPanelOpened, '| rows:', R.panel&&R.panel.rows,
  '| complained:', R.panel&&R.panel.saysSomethingWentWrong, '| page errors:', R.errorsWhileUsingIt.length);
save();
await browser.close();
