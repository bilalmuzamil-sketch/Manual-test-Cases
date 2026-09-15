// C45159 -- a user with NO home branch must not break search.
//
// The state could not be CREATED (the screen requires a branch and so does the server behind it),
// but it already EXISTS: 61 of the 165 people in this company have no branch at all, and some of
// them are active. So the case is run against a person who is already in that state rather than one
// put into it -- which is the same thing the case asks for, and touches nothing.
//
// Controls: the person's own permission list is read, so "no results" is not confused with "no
// permission"; the same search is run by an administrator with a branch in the same session, so the
// words are known to match records; and the page's errors are collected while the panel is used.
import fs from 'fs';
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
const DIR='/home/user/Manual-test-Cases/build/global-search/tickets-2026-09-14';
const EV=`${DIR}/unrun3-evidence`; fs.mkdirSync(EV,{recursive:true});
const R={at:new Date().toISOString()};
const save=()=>fs.writeFileSync(`${DIR}/C45159-RUN.json`,JSON.stringify(R,null,1));
const L=(...a)=>console.log(a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));
const { browser, page, APIH, APP } = await boot('sv9160','/','admin');
const api=async(p,m='GET',b=null)=>page.evaluate(async([u,mm,bb])=>{ try{
    const r=await fetch(u,{method:mm,headers:{Accept:'application/json','Content-Type':'application/json'},
      credentials:'include',body:bb?JSON.stringify(bb):undefined});
    const t=await r.text(); let j=null; try{j=JSON.parse(t)}catch(e){}
    return {status:r.status,json:j,body:t.slice(0,300)};}catch(e){return {error:String(e).slice(0,120)};}},
  [`https://${APIH}${p}`,m,b]);

const errors=[];
page.on('pageerror', e=>errors.push('page: '+String(e).slice(0,160)));
page.on('console', m=>{ if(m.type()==='error') errors.push('console: '+m.text().slice(0,160)); });

const openAndSearch=async (label,q)=>{
  await page.goto(`${APP}/workorders`,{waitUntil:'domcontentloaded'});
  await page.waitForTimeout(6000);
  const before=errors.length;
  await page.evaluate(()=>{const b=document.querySelector('[data-test-id="global_search_trigger"]'); b&&b.click();});
  const opened=await page.waitForSelector('[data-test-id="search_modal_input"]',{state:'visible',timeout:20000})
    .then(()=>true).catch(()=>false);
  let state=null;
  if(opened){
    await page.fill('[data-test-id="search_modal_input"]','').catch(()=>{});
    await page.type('[data-test-id="search_modal_input"]',q,{delay:30});
    await page.waitForTimeout(12000);
    state=await page.evaluate(()=>{const vis=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
      const d=[...document.querySelectorAll('.q-dialog,[role=dialog]')].filter(vis).pop(); if(!d) return null;
      const tabs={}; d.querySelectorAll('[data-test-id^="search_modal_tab_"]').forEach(e=>{
        const t=(e.innerText||'').match(/\((\d+)\)/);
        tabs[e.getAttribute('data-test-id').replace('search_modal_tab_','')]=t?+t[1]:null;});
      return {tabs, rows:[...d.querySelectorAll('[data-test-id^="search_result_row_"]')].length,
        words:(d.innerText||'').replace(/\s+/g,' ').trim().slice(0,260),
        saysSomethingWentWrong:/error|something went wrong|failed|try again/i.test(d.innerText||'')};});
  }
  await page.screenshot({path:`${EV}/C45159-${label}.png`});
  return {panelOpened:opened, state, errorsWhileUsingIt:errors.slice(before)};
};

// the control first, as the administrator who HAS a branch
R.administratorWithABranch=await openAndSearch('admin-control','Bridgeport');
L('admin control:', JSON.stringify(R.administratorWithABranch.state&&R.administratorWithABranch.state.tabs));

// now the person with no branch
const USER=process.env.USER_ID||'644032f2-d8e7-4bdb-aa68-a3b9ff138d34';   // Amy Fernandez, active, no branch
const sw=await api('/api/switch-user','POST',{user_id:USER});
R.switchStatus=sw.status;
await page.waitForTimeout(2500);
const fe=await api('/api/auth/me/fe-permissions');
{ const d=fe.json&&(fe.json.data!==undefined?fe.json.data:fe.json);
  const list=d&&(d.fe_permissions||d.fePermissions||d.permissions);
  const perms=Array.isArray(list)?list:(list?Object.values(list):[]);
  R.subject={permissions:perms.map(p=>p.name||p).sort(), role:d&&(d.template_slug||d.templateSlug)}; }
const wp=await api('/api/staff/my-workplaces');
{ const d=wp.json&&(wp.json.data!==undefined?wp.json.data:wp.json);
  const l=Array.isArray(d)?d:(d&&(d.workplaces||d.collection)||[]);
  R.subject.branchesOffered=l.map(x=>x.name); }
L('the subject can do', R.subject.permissions.length, 'things; branches offered:', JSON.stringify(R.subject.branchesOffered));
R.personWithNoBranch=await openAndSearch('no-branch','Bridgeport');
L('no-branch person:', JSON.stringify(R.personWithNoBranch).slice(0,400));
R.control_theSameWordsWorkForSomeoneWithABranch =
  !!(R.administratorWithABranch.state && R.administratorWithABranch.state.rows>0);
save();
await browser.close();
