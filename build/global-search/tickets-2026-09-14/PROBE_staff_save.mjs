// C45159 needs a user with NO home branch. The staff screen will not save one without a branch, so
// before that is called a blocker, find out what the screen actually SENDS when it saves - then the
// same call can be made with the branch left out, and the answer comes from the server rather than
// from the form's own validation.
//
// Nothing is changed by the save here: the dialog is opened and saved with its existing values.
import fs from 'fs';
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
const DIR='/home/user/Manual-test-Cases/build/global-search/tickets-2026-09-14';
const SUBJECT=process.env.SUBJECT||'clayton.stephens@staging.shopview.local';
const SEARCH_TERM=process.env.SEARCH_TERM||'Stephens';
const R={at:new Date().toISOString(), subject:SUBJECT};
const save=()=>fs.writeFileSync(`${DIR}/PROBE-STAFF-SAVE.json`,JSON.stringify(R,null,1));
const L=(...a)=>console.log(a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));

const { browser, page, APIH, APP } = await boot('sv9160','/administration/staff','admin');
await page.setViewportSize({width:1600,height:1400}).catch(()=>{});
const api=async(p,method='GET',body=null)=>page.evaluate(async([u,m,b])=>{
  try{ const r=await fetch(u,{method:m,headers:{Accept:'application/json','Content-Type':'application/json'},
      credentials:'include',body:b?JSON.stringify(b):undefined});
    const t=await r.text(); let j=null; try{j=JSON.parse(t)}catch(e){}
    return {status:r.status,json:j,body:t.slice(0,400)};}catch(e){return {error:String(e).slice(0,140)};}},
  [`https://${APIH}${p}`,method,body]);

const calls=[];
page.on('request', r=>{ const u=r.url(); if(!/\/api\//.test(u)||/sentry|google/.test(u)) return;
  let post=''; try{ post=r.postData()||''; }catch(e){}
  calls.push({method:r.method(), url:u.replace(`https://${APIH}`,''), post:post.slice(0,900)}); });

await page.waitForTimeout(10000);
R.callsOnLoad=calls.map(c=>`${c.method} ${c.url}`);
// which call brings back the people?
R.staffListCall=(calls.find(c=>/staff|employee|user/i.test(c.url)&&!/my-workplaces/.test(c.url))||{}).url||null;
L('staff list call:', R.staffListCall);

// do any of the records carry a branch, and is anybody without one?
for(const p of ['/api/staff','/api/staff/list','/api/technicians','/api/iam/staff', R.staffListCall].filter(Boolean)){
  const res=await api(p);
  const d=res.json&&(res.json.data!==undefined?res.json.data:res.json);
  const rows=Array.isArray(d)?d:(d&&(d.collection||d.items||d.staff)||[]);
  R[`read ${p}`]={status:res.status, rows:Array.isArray(rows)?rows.length:null,
    keys:rows&&rows[0]?Object.keys(rows[0]).slice(0,30):null};
  if(Array.isArray(rows)&&rows.length&&rows[0]){
    const wk=Object.keys(rows[0]).filter(k=>/workplace|location|branch|shop/i.test(k));
    R[`read ${p}`].branchFields=wk;
    if(wk.length){ const none=rows.filter(r=>wk.every(k=>{const v=r[k];
        return v==null||v===''||(Array.isArray(v)&&!v.length);}));
      R[`read ${p}`].peopleWithNoBranch=none.slice(0,10)
        .map(r=>({name:r.name||`${r.firstName||''} ${r.lastName||''}`.trim(), id:r.id})); } }
}
save();

// --- open the edit dialog and save it unchanged, to capture the shape of the save
const clickAt=async b=>{ await page.mouse.move(b.x+b.w/2,b.y+b.h/2); await page.waitForTimeout(140);
  await page.mouse.down(); await page.waitForTimeout(80); await page.mouse.up(); };
{
  const i=await page.evaluate(()=>{const vis=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
    const el=[...document.querySelectorAll('input[type=text],input:not([type])')].filter(vis)[0];
    if(!el) return null; const r=el.getBoundingClientRect(); return {x:r.x,y:r.y,w:r.width,h:r.height};});
  if(i){ await clickAt(i); await page.keyboard.type(SEARCH_TERM,{delay:60}); await page.waitForTimeout(5000); }
}
const opened=await page.evaluate(em=>{
  const vis=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
  const row=[...document.querySelectorAll('tr')].find(x=>(x.innerText||'').includes(em));
  if(!row) return null; row.scrollIntoView({block:'center'});
  const hit=[...row.querySelectorAll('*')].filter(vis)
    .filter(e=>(e.textContent||'').trim()==='edit_note')
    .sort((a,b)=>a.getBoundingClientRect().width*a.getBoundingClientRect().height
                -b.getBoundingClientRect().width*b.getBoundingClientRect().height)[0];
  if(!hit) return null; const r=hit.getBoundingClientRect(); return {x:r.x,y:r.y,w:r.width,h:r.height};}, SUBJECT);
R.editOpened=!!opened;
if(opened){ await clickAt(opened); await page.waitForTimeout(6000); }
const before=calls.length;
const saveBtn=await page.evaluate(()=>{const vis=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
  const d=document.querySelector('.q-dialog'); if(!d) return null;
  const b=[...d.querySelectorAll('button')].filter(vis).find(e=>/^save/i.test((e.innerText||'').trim()));
  if(!b) return null; const r=b.getBoundingClientRect(); return {x:r.x,y:r.y,w:r.width,h:r.height};});
R.saveButtonFound=!!saveBtn;
if(saveBtn){ await clickAt(saveBtn); await page.waitForTimeout(7000); }
R.callsMadeBySaving=calls.slice(before).map(c=>({method:c.method, url:c.url, body:c.post}));
L('saving sent:', JSON.stringify(R.callsMadeBySaving).slice(0,700));
save();
await browser.close();
