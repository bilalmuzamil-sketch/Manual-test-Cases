// C45159 -- a user with NO home branch must not break search.
//
// The staff screen refuses to save a person without a branch, which is a fact about the FORM. The
// save itself is a single call the screen makes, and the server is the thing that decides. So:
// read the person's record, send the same save with the branch left out, and let the server answer.
//
//   * refused  -> the refusal names what it wants, and that IS the finding: the state cannot exist
//   * accepted -> sign in as that person and look at the search panel, which is the actual case
//
// Whatever happens, the branch is put back and the restore is verified.
import fs from 'fs';
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
const DIR='/home/user/Manual-test-Cases/build/global-search/tickets-2026-09-14';
const EV=`${DIR}/unrun3-evidence`; fs.mkdirSync(EV,{recursive:true});
const EMAIL=process.env.EMAIL||'clayton.stephens@staging.shopview.local';
const USER_ID=process.env.STAFF_ID||'95539f41-30b6-4362-82a7-3f517c46e034';
const R={at:new Date().toISOString(), subject:EMAIL};
const save=()=>fs.writeFileSync(`${DIR}/C45159-RESULTS.json`,JSON.stringify(R,null,1));
const L=(...a)=>console.log(a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));

const { browser, page, APIH, APP } = await boot('sv9160','/','admin');
const api=async(p,method='GET',body=null)=>page.evaluate(async([u,m,b])=>{
  try{ const r=await fetch(u,{method:m,headers:{Accept:'application/json','Content-Type':'application/json'},
      credentials:'include',body:b?JSON.stringify(b):undefined});
    const t=await r.text(); let j=null; try{j=JSON.parse(t)}catch(e){}
    return {status:r.status,json:j,body:t.slice(0,500)};}catch(e){return {error:String(e).slice(0,140)};}},
  [`https://${APIH}${p}`,method,body]);

// --- the person's record as it stands
const list=await api('/api/staff?pagination%5Bpage%5D=1&pagination%5BrowsPerPage%5D=1000&pagination%5BsortBy%5D=first_name&pagination%5Bdescending%5D=false&search=Stephens');
const d=list.json&&(list.json.data!==undefined?list.json.data:list.json);
const rows=Array.isArray(d)?d:(d&&(d.collection||d.items)||[]);
const who=rows.find(r=>(r.email||'')===EMAIL);
R.recordFound=!!who;
if(!who){ R.abort='the staff list did not return '+EMAIL; R.rowsSeen=rows.length; save();
  L(R.abort); await browser.close(); process.exit(2); }
// THE RECORD CARRIES TWO IDS. `id` is the person's login id, `staff_id` is the one the save call
// uses -- sending `id` gets "'Staff' was not found", which reads as a missing person and is really
// the wrong key. Take the one the screen itself sends.
R.staffId=who.staff_id||who.staffId||who.id;
R.loginId=who.id;
R.branchNow=who.workplace_id||who.workplaceId||(who.workplace&&who.workplace.id)||null;
R.recordKeys=Object.keys(who);
L('staff record', R.staffId, 'branch', R.branchNow);
const payload=f=>({first_name:who.first_name||who.firstName, last_name:who.last_name||who.lastName,
  email:who.email, role_id:who.role_id||who.roleId||(who.role&&who.role.id),
  job_title:who.job_title||who.jobTitle, salary_type:who.salary_type||who.salaryType||'hourly',
  salary:who.salary, billable:who.billable, clockable:who.clockable,
  is_sales_rep:who.is_sales_rep||who.isSalesRep||false, ...f});

// --- ask the server to store the person with no branch
R.clearAttempts=[];
for(const [how,extra] of [['branch set to nothing',{workplace_id:null}],
                          ['branch left out entirely',{}]]){
  const res=await api(`/api/staff/${R.staffId}/change`,'POST',payload(extra));
  R.clearAttempts.push({how, status:res.status, answer:res.body.slice(0,300)});
  L(how,'->',res.status,res.body.slice(0,160));
  if(res.status>=200&&res.status<300) break;
}
save();
const accepted=R.clearAttempts.some(a=>a.status>=200&&a.status<300);

// --- did it actually land? read the record back, never trust the status alone
const check=await api('/api/staff?pagination%5Bpage%5D=1&pagination%5BrowsPerPage%5D=1000&pagination%5BsortBy%5D=first_name&pagination%5Bdescending%5D=false&search=Stephens');
{ const dd=check.json&&(check.json.data!==undefined?check.json.data:check.json);
  const rr=Array.isArray(dd)?dd:(dd&&(dd.collection||dd.items)||[]);
  const w=rr.find(r=>(r.email||'')===EMAIL);
  R.branchAfterClearing=w?(w.workplace_id||w.workplaceId||(w.workplace&&w.workplace.id)||null):'record gone';
  R.theStateWasReached = R.branchAfterClearing===null; }
L('accepted:',accepted,'| branch stored now:',JSON.stringify(R.branchAfterClearing));
save();

if(R.theStateWasReached){
  const sw=await api('/api/switch-user','POST',{user_id:USER_ID});
  R.switchStatus=sw.status;
  await page.waitForTimeout(2500);
  const errors=[];
  page.on('pageerror', e=>errors.push(String(e).slice(0,200)));
  page.on('console', m=>{ if(m.type()==='error') errors.push(m.text().slice(0,200)); });
  await page.goto(`${APP}/workorders`,{waitUntil:'domcontentloaded'});
  await page.waitForTimeout(6000);
  R.searchPanel={};
  await page.evaluate(()=>{const b=document.querySelector('[data-test-id="global_search_trigger"]'); b&&b.click();});
  const opened=await page.waitForSelector('[data-test-id="search_modal_input"]',{state:'visible',timeout:20000})
    .then(()=>true).catch(()=>false);
  R.searchPanel.opened=opened;
  if(opened){
    await page.fill('[data-test-id="search_modal_input"]','Bridgeport').catch(()=>{});
    await page.waitForTimeout(10000);
    R.searchPanel.state=await page.evaluate(()=>{
      const vis=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
      const d=[...document.querySelectorAll('.q-dialog,[role=dialog]')].filter(vis).pop();
      if(!d) return null;
      return {words:(d.innerText||'').replace(/\s+/g,' ').trim().slice(0,300),
        rows:[...d.querySelectorAll('[data-test-id^="search_result_row_"]')].length,
        looksBroken:/error|something went wrong|failed/i.test(d.innerText||'')};});
  }
  R.errorsOnThePage=errors.slice(0,6);
  await page.screenshot({path:`${EV}/C45159-no-branch.png`});
  L('search panel:', JSON.stringify(R.searchPanel).slice(0,300));
  save();
}

// --- put the branch back, whatever happened, and verify it
const back=await api(`/api/staff/${R.staffId}/change`,'POST',payload({workplace_id:R.branchNow}));
R.restore={status:back.status};
const after=await api('/api/staff?pagination%5Bpage%5D=1&pagination%5BrowsPerPage%5D=1000&pagination%5BsortBy%5D=first_name&pagination%5Bdescending%5D=false&search=Stephens');
{ const dd=after.json&&(after.json.data!==undefined?after.json.data:after.json);
  const rr=Array.isArray(dd)?dd:(dd&&(dd.collection||dd.items)||[]);
  const w=rr.find(r=>(r.email||'')===EMAIL);
  R.restore.branchNow=w?(w.workplace_id||w.workplaceId||(w.workplace&&w.workplace.id)||null):'record gone';
  R.restore.verified=R.restore.branchNow===R.branchNow; }
L('branch restored:', R.restore.verified, JSON.stringify(R.restore.branchNow));
save();
await browser.close();
