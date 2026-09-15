// C45149 -- a record the user has since lost access to must not appear in their recent activity.
//
// The precondition cannot be found, only built: somebody has to open a record and then lose access
// to it. Two runs, because the role is changed by an administrator in between and the session in
// the middle has to be the SUBJECT's:
//
//   MODE=view   switch to the subject, open a customer, and prove it is in their recent list
//   MODE=check  switch to the subject again, after the permission is gone, and read the list
//
// Controls (Rule 104): the record must be IN the list in the first run, or its absence in the
// second proves nothing; the list must still hold OTHER entries in the second run, or "gone" just
// means the panel did not draw; and the subject's own permission list is read each time, because
// the role form's read-back and the user's actual permissions disagreed earlier today.
import fs from 'fs';
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
const DIR='/home/user/Manual-test-Cases/build/global-search/tickets-2026-09-14';
const EV=`${DIR}/unrun3-evidence`; fs.mkdirSync(EV,{recursive:true});
const MODE=process.env.MODE||'view';
const STAFF=process.env.STAFF_ID||'95539f41-30b6-4362-82a7-3f517c46e034';
const TARGET=process.env.TARGET||'ZZAUTOTEST Bridgeport Hauling';
const STATE=`${DIR}/C45149-RESULTS.json`;
const R=fs.existsSync(STATE)?JSON.parse(fs.readFileSync(STATE,'utf8')):{};
const save=()=>fs.writeFileSync(STATE,JSON.stringify(R,null,1));
const L=(...a)=>console.log(new Date().toISOString().slice(11,19),a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));

const { browser, page, APIH, APP } = await boot('sv9160','/','admin');
const api=async(p,method='GET',body=null)=>page.evaluate(async([u,m,b])=>{
  try{ const r=await fetch(u,{method:m,headers:{Accept:'application/json','Content-Type':'application/json'},
      credentials:'include',body:b?JSON.stringify(b):undefined});
    const t=await r.text(); let j=null; try{j=JSON.parse(t)}catch(e){}
    return {status:r.status,json:j,body:t.slice(0,300)};}catch(e){return {error:String(e).slice(0,120)};}},
  [`https://${APIH}${p}`,method,body]);

const out={at:new Date().toISOString(), mode:MODE};
const sw=await api('/api/switch-user','POST',{user_id:STAFF});
out.switchStatus=sw.status;
await page.waitForTimeout(2500);
const fe=await api('/api/auth/me/fe-permissions');
{ const d=fe.json&&(fe.json.data!==undefined?fe.json.data:fe.json);
  const list=d&&(d.fe_permissions||d.fePermissions||d.permissions);
  const perms=Array.isArray(list)?list:(list?Object.values(list):[]);
  out.permissions=perms.map(p=>p.name||p).sort(); }
L('signed in as the subject with', out.permissions.length, 'permissions:', out.permissions.join(', '));

const modalOpen=async()=>page.evaluate(()=>{const e=document.querySelector('[data-test-id="search_modal_input"]');
  if(!e) return false; const r=e.getBoundingClientRect(); return r.width>2&&r.height>2;});
const closeModal=async()=>{ for(let i=0;i<3;i++){ if(!await modalOpen()) return true;
  await page.keyboard.press('Escape'); await page.waitForTimeout(800);} return !(await modalOpen()); };
const openModal=async()=>{ await closeModal();
  await page.evaluate(()=>{const b=document.querySelector('[data-test-id="global_search_trigger"]'); b&&b.click();});
  await page.waitForSelector('[data-test-id="search_modal_input"]',{state:'visible',timeout:20000}); };
const readRecents=async()=>{ await page.waitForTimeout(4000);
  return page.evaluate(()=>{const vis=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
    const d=[...document.querySelectorAll('.q-dialog,[role=dialog]')].filter(vis).pop(); if(!d) return null;
    return {rows:[...d.querySelectorAll('[data-test-id^="search_result_row_"]')]
        .map(e=>({tid:e.getAttribute('data-test-id'),
                  text:(e.innerText||'').replace(/\s+/g,' ').trim().slice(0,70)})),
      heading:(d.querySelector('[data-test-id="search_recents_title"]')||{}).innerText||null,
      firstWords:(d.innerText||'').replace(/\s+/g,' ').trim().slice(0,200)};});};

await page.goto(`${APP}/workorders`,{waitUntil:'domcontentloaded'}); await page.waitForTimeout(4500);

if(MODE==='view'){
  // find the record through SEARCH and open it, the way the case's user would have
  await openModal();
  const s='[data-test-id="search_modal_input"]';
  await page.fill(s,''); await page.type(s,TARGET,{delay:30});
  await page.waitForTimeout(9000);
  const row=await page.evaluate(t=>{const vis=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
    const d=[...document.querySelectorAll('.q-dialog,[role=dialog]')].filter(vis).pop(); if(!d) return null;
    const r=[...d.querySelectorAll('[data-test-id^="search_result_row_customers"]')]
      .find(e=>(e.innerText||'').includes(t.replace('ZZAUTOTEST ','')));
    if(!r) return null; r.click();
    return {tid:r.getAttribute('data-test-id'), text:(r.innerText||'').replace(/\s+/g,' ').trim().slice(0,70)};},TARGET);
  out.openedRow=row;
  await page.waitForTimeout(7000);
  out.urlAfterOpening=page.url();
  // ALSO open a record of a kind the user will KEEP. Otherwise the second run cannot tell
  // "the customer was filtered out" from "the recent list did not draw" -- the whole list would be
  // empty either way.
  if(process.env.KEEPER){
    await page.goto(`${APP}/workorders`,{waitUntil:'domcontentloaded'}); await page.waitForTimeout(3500);
    await openModal();
    await page.fill(s,''); await page.type(s,process.env.KEEPER,{delay:30});
    await page.waitForTimeout(9000);
    out.keeperRow=await page.evaluate(()=>{const vis=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
      const d=[...document.querySelectorAll('.q-dialog,[role=dialog]')].filter(vis).pop(); if(!d) return null;
      const r=[...d.querySelectorAll('[data-test-id^="search_result_row_part_sales"]')][0];
      if(!r) return null; const t=(r.innerText||'').replace(/\s+/g,' ').trim().slice(0,70); r.click(); return t;});
    await page.waitForTimeout(7000);
    out.urlAfterKeeper=page.url();
  }
  // now read the recent list back
  await page.goto(`${APP}/workorders`,{waitUntil:'domcontentloaded'}); await page.waitForTimeout(4000);
  await openModal();
  const rec=await readRecents();
  out.recents=rec&&rec.rows.map(r=>r.text);
  out.targetIsInTheRecentList=!!(rec&&rec.rows.some(r=>new RegExp(TARGET.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),'i').test(r.text)));
  await page.screenshot({path:`${EV}/C45149-before.png`});
  L('the record is in the recent list:', out.targetIsInTheRecentList);
} else {
  await openModal();
  const rec=await readRecents();
  out.recents=rec&&rec.rows.map(r=>r.text);
  out.recentListHasAnythingAtAll=!!(rec&&rec.rows.length);
  out.targetStillInTheRecentList=!!(rec&&rec.rows.some(r=>new RegExp(TARGET.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),'i').test(r.text)));
  out.panelWords=rec&&rec.firstWords;
  await page.screenshot({path:`${EV}/C45149-after.png`});
  L('the record is STILL in the recent list:', out.targetStillInTheRecentList,
    '| the list has', (rec&&rec.rows.length)||0, 'entries');
}
R[MODE]=out; save();
await browser.close();
