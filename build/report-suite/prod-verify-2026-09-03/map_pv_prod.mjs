import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'fs';
const APP='https://app.shopview.com', APIH='api.shopview.com';
const ck=JSON.parse(fs.readFileSync('/tmp/shopview/prod-cookies.json','utf8'));
const port=fs.readFileSync('/tmp/atlassian/bridge-port.txt','utf8').trim();
const browser=await chromium.launch({args:['--no-sandbox'],executablePath:'/opt/pw-browsers/chromium',proxy:{server:`http://127.0.0.1:${port}`}});
const ctx=await browser.newContext({ignoreHTTPSErrors:true,viewport:{width:1680,height:1050}});
await ctx.addCookies(Object.entries(ck).flatMap(([name,value])=>['app.shopview.com','api.shopview.com'].map(domain=>({name,value,domain,path:'/',secure:true,sameSite:'Lax'}))));
const probe=await ctx.newPage();
const get=async p=>{const r=await probe.request.get(`https://${APIH}${p}`,{headers:{Accept:'application/json'},ignoreHTTPSErrors:true});return r.status()===200?await r.json():null;};
const fep=(await get('/api/auth/me/fe-permissions'))?.data, user=(await get('/api/iam/view-profile/'))?.data?.user||{};
await probe.close();
await ctx.addInitScript(([user,fep])=>{try{localStorage.setItem('user',JSON.stringify({data:user}));localStorage.setItem('fe_permissions_wrapper',JSON.stringify(fep));}catch(e){}},[user,fep]);
const page=await ctx.newPage(); page.setDefaultTimeout(60000);
const fetches=[]; page.on('response',r=>{const u=r.url(); if(u.includes(APIH)&&/reporting\/reports\/parts-velocity/.test(u)) fetches.push(`${r.status()} ${decodeURIComponent(u.replace(`https://${APIH}`,'')).slice(0,180)}`);});
const lab='e=>{const c=e.cloneNode(true);c.querySelectorAll("svg,i[class*=icon]").forEach(n=>n.remove());return (c.textContent||"").replace(/\\s+/g," ").trim();}';
await page.goto(`${APP}/reports/parts-velocity`,{waitUntil:'domcontentloaded'}); await page.waitForTimeout(16000);
console.log('url:', page.url(), '| fetches so far:', fetches.length);
const m=await page.evaluate(L=>{const lab=eval(L);
  const tb=document.querySelector('table');
  return {
    leftMenu:[...new Set([...document.querySelectorAll('aside .q-item,.q-drawer .q-item,aside a')].map(lab).filter(x=>x&&x.length<40))].slice(0,40),
    chips:[...new Set([...document.querySelectorAll('.q-chip,.q-btn--outline,.q-btn--rounded,.q-select,[class*=chip],[class*=filter]')].map(lab).filter(x=>x&&x.length<40))],
    buttons:[...new Set([...document.querySelectorAll('.q-page button,.q-page .q-btn,main button')].map(lab).filter(x=>x&&x.length<30))],
    columns: tb? [...tb.querySelectorAll('thead th')].map(lab):null,
    rows: tb? tb.querySelectorAll('tbody tr').length:0 };}, lab);
console.log(JSON.stringify(m,null,1).slice(0,2400));
console.log('\nreporting fetches:'); fetches.forEach(f=>console.log('  ',f));
fs.writeFileSync('build/report-suite/prod-verify-2026-09-03/pv-prod-map.json', JSON.stringify({url:page.url(),map:m,fetches},null,1));
await page.screenshot({path:'build/report-suite/prod-verify-2026-09-03/pv-prod-map.png', fullPage:true});
await browser.close();
