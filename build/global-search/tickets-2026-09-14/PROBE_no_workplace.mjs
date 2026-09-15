// C45159 needs a user with NO default workplace. The staff edit dialog will not save without a
// location, so the state cannot be made that way -- which is a fact about that ONE route, not about
// the task (Rule 68). Before calling it blocked, look for the other routes:
//
//   1. does such a user ALREADY EXIST?  (read the staff list with its workplace data)
//   2. what does the staff screen actually CALL when it saves?  (intercept it, then it can be
//      replayed with the location left out)
//   3. is there a separate Locations screen that assigns and unassigns people?
//
// Nothing is changed here. This reports what each route offers.
import fs from 'fs';
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
const DIR='/home/user/Manual-test-Cases/build/global-search/tickets-2026-09-14';
const R={at:new Date().toISOString()};
const save=()=>fs.writeFileSync(`${DIR}/PROBE-NO-WORKPLACE.json`,JSON.stringify(R,null,1));
const L=(...a)=>console.log(a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));

const { browser, page, APIH, APP } = await boot('sv9160','/','admin');
const api=async(p,method='GET',body=null)=>page.evaluate(async([u,m,b])=>{
  try{ const r=await fetch(u,{method:m,headers:{Accept:'application/json','Content-Type':'application/json'},
      credentials:'include',body:b?JSON.stringify(b):undefined});
    const t=await r.text(); let j=null; try{j=JSON.parse(t)}catch(e){}
    return {status:r.status,json:j,body:t.slice(0,400)};}catch(e){return {error:String(e).slice(0,120)};}},
  [`https://${APIH}${p}`,method,body]);

// --- route 2 first, because it also tells us the shape of a staff record: watch the traffic the
// staff screen makes as it loads
const seen=[];
page.on('request', r => { const u=r.url();
  if(/\/api\//.test(u)) seen.push({method:r.method(), url:u.replace(`https://${APIH}`,''),
    post:(r.postData()||'').slice(0,300)}); });
await page.goto(`${APP}/administration/staff`,{waitUntil:'domcontentloaded'});
await page.waitForTimeout(12000);
R.callsTheStaffScreenMakes=seen.map(x=>`${x.method} ${x.url}`).slice(0,40);
R.postBodies=seen.filter(x=>x.post).map(x=>`${x.method} ${x.url} :: ${x.post}`).slice(0,10);
L('calls:', JSON.stringify(R.callsTheStaffScreenMakes.slice(0,12),null,1));
save();

// --- route 1: read the list the screen itself reads, and look for a person with no workplace
const listPath=(seen.find(x=>/staff/i.test(x.url)&&x.method==='GET')||{}).url;
R.listPath=listPath||null;
if(listPath){
  const res=await api(listPath);
  const d=res.json&&(res.json.data!==undefined?res.json.data:res.json);
  const rows=Array.isArray(d)?d:(d&&(d.collection||d.items||d.staff)||[]);
  R.sampleRecord=rows[0]?Object.keys(rows[0]):null;
  const wpKey=(rows[0]?Object.keys(rows[0]):[]).find(k=>/workplace|location/i.test(k));
  R.workplaceField=wpKey||null;
  if(wpKey){
    const none=rows.filter(r=>{const v=r[wpKey];
      return v==null||(Array.isArray(v)&&v.length===0)||v==='';});
    R.peopleWithNoWorkplace=none.map(r=>({name:r.name||`${r.firstName||''} ${r.lastName||''}`.trim(),
      email:r.email, id:r.id}));
    R.howManyPeople=rows.length;
  }
}
L('a person with no workplace already exists:', JSON.stringify(R.peopleWithNoWorkplace||null));
save();

// --- route 3: is there a Locations screen that assigns people?
await page.goto(`${APP}/administration/locations`,{waitUntil:'domcontentloaded'}).catch(()=>{});
await page.waitForTimeout(8000);
R.locationsScreen=await page.evaluate(()=>{
  const vis=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
  return {url:location.pathname,
    words:(document.body.innerText||'').replace(/\s+/g,' ').trim().slice(0,400),
    buttons:[...document.querySelectorAll('button,.q-btn')].filter(vis)
      .map(b=>(b.innerText||'').replace(/\s+/g,' ').trim()).filter(Boolean).slice(0,20)};});
L('locations screen:', JSON.stringify(R.locationsScreen).slice(0,300));
save();
await browser.close();
