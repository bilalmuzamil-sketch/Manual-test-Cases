// C45159 -- the last two routes before the state is called unreachable (Rule 107).
//
// Already tried and recorded: the staff screen refuses to save without a branch, and so does the
// server behind it -- "workplace_id: Missing required parameter" -- while the same call WITH the
// branch succeeds, which proves the call itself was right.
//
// Left:  (a) does somebody in the company ALREADY have no branch -- including people who were
//            invited and never accepted?
//        (b) does the branches screen assign and unassign people separately from the staff screen?
import fs from 'fs';
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
const DIR='/home/user/Manual-test-Cases/build/global-search/tickets-2026-09-14';
const R={at:new Date().toISOString()};
const L=(...a)=>console.log(a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));
const { browser, page, APIH, APP } = await boot('sv9160','/','admin');
const api=async p=>page.evaluate(async u=>{ try{
    const r=await fetch(u,{headers:{Accept:'application/json'},credentials:'include'});
    const t=await r.text(); let j=null; try{j=JSON.parse(t)}catch(e){}
    return {status:r.status,json:j,body:t.slice(0,300)};}catch(e){return {error:String(e).slice(0,120)};}},
  `https://${APIH}${p}`);

// (a) everybody, and their branch
const res=await api('/api/staff?pagination%5Bpage%5D=1&pagination%5BrowsPerPage%5D=1000&pagination%5BsortBy%5D=first_name&pagination%5Bdescending%5D=false&search=');
const d=res.json&&(res.json.data!==undefined?res.json.data:res.json);
const rows=Array.isArray(d)?d:(d&&(d.collection||d.items)||[]);
R.peopleRead=rows.length;
const noBranch=rows.filter(r=>!r.workplace_id&&!r.defaultWorkplace&&!r.defaultWorkplaceName);
R.peopleWithNoBranch=noBranch.map(r=>({name:`${r.first_name||''} ${r.last_name||''}`.trim(),
  email:r.email, id:r.id, staff_id:r.staff_id, active:r.is_active,
  everAcceptedTheInvitation:!!r.confirmed_invitation_on}));
R.howManyHaveNoBranch=noBranch.length;
// control: the reading works -- somebody DOES have one
R.control_peopleWithABranch=rows.length-noBranch.length;
L('people read:',rows.length,'| with no branch:',noBranch.length,'| with one:',R.control_peopleWithABranch);
if(noBranch.length) L('   ', JSON.stringify(R.peopleWithNoBranch.slice(0,5)));

// (b) the branches screen
await page.goto(`${APP}/administration/locations`,{waitUntil:'domcontentloaded'}).catch(()=>{});
await page.waitForTimeout(8000);
R.branchesScreen=await page.evaluate(()=>{
  const vis=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
  return {rows:[...document.querySelectorAll('tr')].map(r=>(r.innerText||'').replace(/\s+/g,' ').trim()).slice(0,8),
    buttons:[...document.querySelectorAll('button,.q-btn')].filter(vis)
      .map(b=>(b.innerText||'').replace(/\s+/g,' ').trim()).filter(Boolean).slice(0,24),
    mentionsPeople:/staff|employee|people|assign/i.test(document.body.innerText||'')};});
L('branches screen:', JSON.stringify(R.branchesScreen).slice(0,400));
fs.writeFileSync(`${DIR}/C45159-ROUTES.json`,JSON.stringify(R,null,1));
await browser.close();
