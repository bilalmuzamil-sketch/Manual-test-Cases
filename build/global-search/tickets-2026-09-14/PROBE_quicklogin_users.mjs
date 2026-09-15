// Can I sign in AS a person who has no home branch, rather than impersonating them?
// Impersonation is refused for them ("Access denied") while it works for someone who has a branch,
// so the branchless state may only be reachable by signing in as that person directly. The sign-in
// screen on a QA branch carries a DEV MODE panel that logs in as a chosen user; this reads what it
// offers, and the list behind it, without signing in as anyone.
import fs from 'fs';
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const DIR='/home/user/Manual-test-Cases/build/global-search/tickets-2026-09-14';
const PORT=fs.readFileSync('/tmp/atlassian/bridge-port.txt','utf8').trim();
const APP='https://sv9160.qa.shopview.com', APIH='sv9160api.qa.shopview.com';
const R={at:new Date().toISOString()};
const L=(...a)=>console.log(a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));
const browser=await chromium.launch({proxy:{server:`http://127.0.0.1:${PORT}`},
  args:['--no-sandbox','--ignore-certificate-errors']});
const ctx=await browser.newContext({viewport:{width:1600,height:1000}, ignoreHTTPSErrors:true});
const page=await ctx.newPage(); page.setDefaultTimeout(60000);
await page.goto(`${APP}/login`,{waitUntil:'domcontentloaded'});
await page.waitForTimeout(9000);
R.panel=await page.evaluate(()=>{
  const vis=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
  return {buttons:[...document.querySelectorAll('button,.q-btn')].filter(vis)
      .map(b=>(b.innerText||'').replace(/\s+/g,' ').trim()).filter(Boolean).slice(0,30),
    words:(document.body.innerText||'').replace(/\s+/g,' ').trim().slice(0,400),
    selects:[...document.querySelectorAll('.q-select,select')].filter(vis)
      .map(s=>(s.innerText||'').replace(/\s+/g,' ').trim().slice(0,60))};});
L('the sign-in screen offers:', JSON.stringify(R.panel.buttons));
L('selects:', JSON.stringify(R.panel.selects));
R.usersEndpoint=await page.evaluate(async h=>{ try{
    const r=await fetch(`https://${h}/api/quick-login/users`,{headers:{Accept:'application/json'}});
    const t=await r.text(); let j=null; try{j=JSON.parse(t)}catch(e){}
    const d=j&&(j.data!==undefined?j.data:j);
    const rows=Array.isArray(d)?d:(d&&(d.collection||d.users)||[]);
    return {status:r.status, n:Array.isArray(rows)?rows.length:null,
      sample:Array.isArray(rows)?rows.slice(0,12).map(x=>({email:x.email,role:x.role||x.role_label,
        id:x.id, workplace:x.workplace_id||x.defaultWorkplaceName||null})):null,
      body:t.slice(0,200)};
  }catch(e){ return {error:String(e).slice(0,140)}; }}, APIH);
L('quick-login users:', JSON.stringify(R.usersEndpoint).slice(0,700));
fs.writeFileSync(`${DIR}/PROBE-QUICKLOGIN-USERS.json`,JSON.stringify(R,null,1));
await browser.close();
