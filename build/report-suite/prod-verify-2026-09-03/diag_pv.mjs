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
// also fetch what the SPA usually caches: organization feature flags + workplaces, to hydrate fully
const orgId = user?.organization_id || fep?.organization_id || null;
await probe.close();
await ctx.addInitScript(([user,fep])=>{try{localStorage.setItem('user',JSON.stringify({data:user}));localStorage.setItem('fe_permissions_wrapper',JSON.stringify(fep));}catch(e){}},[user,fep]);
const page=await ctx.newPage(); page.setDefaultTimeout(60000);
const calls=[]; page.on('response',r=>{const u=r.url(); if(u.includes(APIH)) calls.push(`${r.status()} ${r.request().method()} ${u.replace(`https://${APIH}`,'').slice(0,90)}`);});
await page.goto(`${APP}/reports/parts-velocity`,{waitUntil:'domcontentloaded'}); await page.waitForTimeout(16000);
const s=await page.evaluate(()=>({url:location.href, ls:Object.keys(localStorage),
  bodyLen:(document.body.innerText||'').length,
  bodyText:(document.body.innerText||'').replace(/\s+/g,' ').slice(0,400),
  hasTable:!!document.querySelector('table'), asideItems:document.querySelectorAll('aside .q-item,.q-drawer .q-item').length,
  spinner:!!document.querySelector('.q-spinner,.q-loading') }));
console.log('userOrgId:', orgId);
console.log(JSON.stringify(s,null,1));
console.log('--- ALL API calls ---'); [...new Set(calls)].forEach(c=>console.log('  ',c));
await page.screenshot({path:'build/report-suite/prod-verify-2026-09-03/diag-pv.png', fullPage:true});
await browser.close();
