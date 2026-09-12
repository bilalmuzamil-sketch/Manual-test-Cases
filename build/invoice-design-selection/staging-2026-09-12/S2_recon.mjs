// READ ONLY. Confirm the feature is live on staging, confirm portal access, and look for
// documents that already exist so nothing has to be created. Nothing is written by this probe.
import pkg from '/opt/node22/lib/node_modules/playwright/index.js';
const { chromium } = pkg; import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/invoice-design-selection/staging-2026-09-12';
const APP='https://app.staging.shopview.com', APIH='api.staging.shopview.com';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));
const R={readOnly:true}; const save=()=>fs.writeFileSync(`${DIR}/evidence/S2.json`, JSON.stringify(R,null,1));
const port=fs.readFileSync('/tmp/atlassian/bridge-port.txt','utf8').trim();
const C=JSON.parse(fs.readFileSync('/tmp/qa-cookies/staging-full.json','utf8'));
const browser=await chromium.launch({executablePath:process.env.CHROME_BIN||'/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args:[`--proxy-server=http://127.0.0.1:${port}`,'--ignore-certificate-errors','--no-sandbox']});
const ctx=await browser.newContext({ignoreHTTPSErrors:true, viewport:{width:1700,height:1150}});
for (const host of ['app.staging.shopview.com', APIH]){
  await ctx.addCookies([
    {name:'sv_sso_session',value:C.sv_sso_session,domain:host,path:'/',secure:true},
    {name:'PHPSESSID',value:C.PHPSESSID,domain:host,path:'/',secure:true}]);
}
await ctx.addCookies([{name:'cf_clearance',value:C.cf_clearance,domain:'.shopview.com',path:'/',secure:true}]);
const page=await ctx.newPage();
const VIS=`(e)=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);
  return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden'&&parseFloat(c.opacity)>0.01;}`;
await page.goto(`${APP}/`,{waitUntil:'domcontentloaded',timeout:90000}).catch(()=>{});
await page.waitForTimeout(14000);
R.url=page.url();
R.signedIn=await page.evaluate(()=>{try{return !!JSON.parse(localStorage.getItem('user')||'null');}catch(e){return false;}});
R.bar=await page.evaluate(vis=>{const isVis=eval(vis);const t=e=>(e.innerText||'').replace(/\s+/g,' ').trim();
  return [...document.querySelectorAll('button,.q-btn')].filter(isVis).map(t).find(x=>/ - \d+|Staging|Location/.test(x))||null;},VIS);
log('landed: %s | signed in: %s | top bar: %s', R.url, R.signedIn, R.bar);
if(!R.signedIn){ log('NOT SIGNED IN — stopping'); R.page=await page.evaluate(()=>(document.body.innerText||'').replace(/\s+/g,' ').slice(0,300)); log(R.page); save(); await browser.close(); process.exit(1); }
const api=(p)=>page.evaluate(async({a,p})=>{const r=await fetch(`https://${a}${p}`,{credentials:'include',headers:{Accept:'application/json'}});
  return {status:r.status,text:await r.text()};},{a:APIH,p});
// 1. IS THE FEATURE LIVE?  (read only)
const st=await api('/api/organizations/invoice-settings/view');
R.settings={status:st.status};
if(st.status===200){ const d=JSON.parse(st.text).data||{};
  R.settings.keys=Object.keys(d); R.settings.documentDesign=d.documentDesign; }
log('invoice-settings: %s | documentDesign = %s', st.status, R.settings.documentDesign);
log('   keys: %s', JSON.stringify(R.settings.keys));
// what the Settings > Invoice tab actually shows
await page.goto(`${APP}/administration/settings`,{waitUntil:'domcontentloaded',timeout:90000});
await page.waitForTimeout(8000);
await page.evaluate(vis=>{const isVis=eval(vis);const t=e=>(e.innerText||'').replace(/\s+/g,' ').trim();
  const el=[...document.querySelectorAll('a,div,[role=tab],.q-tab')].filter(isVis).find(e=>t(e)==='Invoice'); if(el)el.click();},VIS);
await page.waitForTimeout(7000);
R.invoiceTab={controls:await page.evaluate(vis=>{const isVis=eval(vis);
  return [...document.querySelectorAll('.q-field,.q-select,.q-toggle')].filter(isVis)
    .map(e=>(e.innerText||'').replace(/\s+/g,' ').trim().slice(0,70)).filter(Boolean).slice(0,20);},VIS)};
log('Invoice tab controls: %s', JSON.stringify(R.invoiceTab.controls));
await page.screenshot({path:`${DIR}/evidence/S2-invoice-settings.png`, fullPage:true});
save();
// 2. PORTAL reachable? (read only — just open the menu item)
const pages0=ctx.pages().length;
await page.evaluate(vis=>{const isVis=eval(vis);const t=e=>(e.innerText||'').replace(/\s+/g,' ').trim();
  const b=[...document.querySelectorAll('button,.q-btn')].filter(isVis).find(e=>/Staging|Location| - \d+/.test(t(e))); if(b)b.click();},VIS);
await page.waitForTimeout(3000);
R.profileMenu=await page.evaluate(vis=>{const isVis=eval(vis);
  const m=[...document.querySelectorAll('.q-menu')].filter(isVis).pop();
  return m?[...m.querySelectorAll('.q-item')].map(e=>(e.innerText||'').replace(/\s+/g,' ').trim()):null;},VIS);
log('profile menu: %s', JSON.stringify(R.profileMenu));
await page.evaluate(vis=>{const isVis=eval(vis);const t=e=>(e.innerText||'').replace(/\s+/g,' ').trim();
  const e2=[...document.querySelectorAll('.q-item,a')].filter(isVis).find(x=>/customer portal/i.test(t(x))); if(e2)e2.click();},VIS);
await page.waitForTimeout(12000);
const pgs=ctx.pages(); const portal=pgs.length>pages0?pgs[pgs.length-1]:null;
R.portal={newTab:!!portal, url:portal?portal.url():page.url()};
log('PORTAL: new tab = %s | url = %s', R.portal.newTab, R.portal.url);
if(portal){
  await portal.waitForTimeout(9000);
  R.portal.text=await portal.evaluate(()=>(document.body.innerText||'').replace(/\s+/g,' ').slice(0,700));
  R.portal.rows=await portal.evaluate(()=>[...document.querySelectorAll('tbody tr')].map(r=>(r.innerText||'').replace(/\s+/g,' ').slice(0,150)).slice(0,15));
  log('portal page: %s', (R.portal.text||'').slice(0,300));
  log('portal invoice rows: %d', (R.portal.rows||[]).length);
  for(const r of (R.portal.rows||[]).slice(0,10)) log('   ', r);
  await portal.screenshot({path:`${DIR}/evidence/S2-portal.png`, fullPage:true});
}
save(); log('done — nothing was changed'); await browser.close(); process.exit(0);
