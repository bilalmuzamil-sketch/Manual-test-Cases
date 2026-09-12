// C53567 step 2, second half -- the contrast on an ESTIMATE. Entry: the DEV MODE quick-login panel,
// which DOES work on staging once a live session cookie exists (proven 2026-09-12).
import pkg from '/opt/node22/lib/node_modules/playwright/index.js';
const { chromium } = pkg; import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/invoice-design-selection/staging-2026-09-12/evidence';
const APP='https://app.staging.shopview.com', APIH='api.staging.shopview.com';
const L=(...a)=>console.log(new Date().toISOString().slice(11,19),a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));
const R={}; const save=()=>fs.writeFileSync(`${EV}/S28.json`, JSON.stringify(R,null,1));
const port=fs.readFileSync('/tmp/atlassian/bridge-port.txt','utf8').trim();
const C=JSON.parse(fs.readFileSync('/tmp/qa-cookies/staging-full.json','utf8'));
const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args:[`--proxy-server=http://127.0.0.1:${port}`,'--ignore-certificate-errors','--no-sandbox']});
const ctx=await b.newContext({ignoreHTTPSErrors:true,viewport:{width:1700,height:1300}});
for (const h of ['app.staging.shopview.com',APIH])
  await ctx.addCookies([{name:'sv_sso_session',value:C.sv_sso_session,domain:h,path:'/',secure:true},
                        {name:'PHPSESSID',value:C.PHPSESSID,domain:h,path:'/',secure:true}]);
await ctx.addCookies([{name:'cf_clearance',value:C.cf_clearance,domain:'.shopview.com',path:'/',secure:true}]);
const p=await ctx.newPage();
await p.goto(`${APP}/`,{waitUntil:'domcontentloaded',timeout:90000}).catch(()=>{});
await p.waitForTimeout(5000);
await p.evaluate(()=>{const vis=e=>{const r=e.getBoundingClientRect();return r.width>0&&r.height>0;};
  const t=e=>(e.innerText||'').replace(/\s+/g,' ').trim();
  const el=[...document.querySelectorAll('button,.q-btn,[role=button],a')].filter(vis).find(e=>/\bAdmin\b/.test(t(e))&&!/Panel|Settings:/.test(t(e)));
  if(el) el.click();});
await p.waitForTimeout(14000);
R.signedIn=await p.evaluate(()=>{try{return !!localStorage.getItem('user');}catch(e){return false;}});
L('signed in: %s | url %s', R.signedIn, p.url().slice(0,80));
const api=(path)=>p.evaluate(async({a,path})=>{const r=await fetch(`https://${a}${path}`,{credentials:'include',headers:{Accept:'application/json'}});
  return {s:r.status,t:await r.text()};},{a:APIH,path});
const stored=async()=>{const r=await api('/api/organizations/invoice-settings/view'); try{return JSON.parse(r.t).data.documentDesign;}catch(e){return null;}};
R.design=await stored(); L('design: %s', R.design);
// find a work order that is NOT invoiced -> its Finance tab shows an ESTIMATE.
// The app's own landing URL is /workorders?status=paid, so the same screen filtered to estimates is
// /workorders?status=estimate -- walked through the list rows, not guessed at an API.
await p.goto(`${APP}/workorders?status=estimate`,{waitUntil:'domcontentloaded',timeout:90000}).catch(()=>{});
await p.waitForTimeout(15000);
// the list rows are TABLE ROWS, not links (a href-only scan returns zero -- learning L0060).
// Click the first Estimate row the way a user does, then read its Finance tab.
await p.screenshot({path:`${EV}/S28-estimate-list.png`, fullPage:true});
const clicked=await p.evaluate(()=>{const vis=e=>{const r=e.getBoundingClientRect();return r.width>0&&r.height>0;};
  const tr=[...document.querySelectorAll('tr,[role=row]')].filter(vis)
    .find(r=>/Estimate/.test(r.innerText||'') && /S2-\d+/.test(r.innerText||''));
  if(!tr) return null; const cell=tr.querySelector('td:nth-child(4)')||tr;
  cell.click(); return (tr.innerText||'').replace(/\s+/g,' ').slice(0,60);});
L('clicked row: %s', clicked);
await p.waitForTimeout(13000);
L('url now: %s', p.url().slice(0,100));
const m=p.url().match(/\/workorders\/([0-9a-f-]{12,})/);
const pick = m ? {id:m[1], number:clicked} : null;
R.pick=pick; L('estimate candidate: %s', JSON.stringify(pick));
if(pick){
  await p.goto(`${APP}/workorders/${pick.id}/finance`,{waitUntil:'domcontentloaded',timeout:90000}).catch(()=>{});
  await p.waitForTimeout(17000);
  R.estimate=await p.evaluate(()=>{const t=(document.body.innerText||'').replace(/\s+/g,' ');
    return {banner:!!document.querySelector('#portal-paid-invoice-summary'),
      pill:(t.match(/PAID IN FULL|PARTIALLY PAID/)||[])[0]||null,
      docWord:(t.match(/\b(Estimate|Invoice):?\s*[A-Z0-9-]*/)||[])[0]||null,
      documentRendered:/Bill To|BILL TO|Remit payment to|REMIT PAYMENT TO/.test(t),
      len:t.length, head:t.slice(0,240)};});
  L('ESTIMATE finance tab: %s', JSON.stringify(R.estimate).slice(0,420));
  await p.screenshot({path:`${EV}/S28-inapp-estimate.png`, fullPage:true});
}
R.designEnd=await stored(); L('design at end: %s', R.designEnd);
save(); L('done'); await b.close(); process.exit(0);
