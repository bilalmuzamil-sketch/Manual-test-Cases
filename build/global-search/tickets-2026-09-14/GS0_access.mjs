// Can I reach the Global Search V2 QA build with the supplied cookies, and does the search work?
// This decides whether the tickets can carry screenshot evidence at all.
import fs from 'fs';
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const C=JSON.parse(fs.readFileSync('/tmp/claude-0/gs-qa-cookies.json','utf8'));
const L=(...a)=>console.log(a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));
const br=await chromium.launch({args:['--ignore-certificate-errors']});
const ctx=await br.newContext({ignoreHTTPSErrors:true});
const mk=(n,v,d)=>({name:n,value:v,domain:d,path:'/',httpOnly:false,secure:true});
await ctx.addCookies([mk('sv_sso_session',C.sv_sso_session,C.host), mk('PHPSESSID',C.PHPSESSID,C.host),
  mk('cf_clearance',C.cf_clearance,C.host), mk('cf_clearance',C.cf_clearance,C.api),
  mk('sv_sso_session',C.sv_sso_session,C.api), mk('PHPSESSID',C.PHPSESSID,C.api)]);
const page=await ctx.newPage();
const r=await page.goto(`https://${C.host}/workorders`,{waitUntil:'domcontentloaded',timeout:60000}).catch(e=>({err:e.message}));
await page.waitForTimeout(9000);
const d=await page.evaluate(()=>{const t=(document.body.innerText||'').replace(/\s+/g,' ');
  const m=document.querySelector('meta[name="app-version"]');
  return {url:location.href, build:m?m.content:null, len:t.length, head:t.slice(0,180),
    loginish:/sign in|log in|password/i.test(t),
    trigger:!!document.querySelector('[data-test-id="global_search_trigger"]')};});
L('nav:', r&&r.err?('ERR '+r.err):(r?r.status():'?'));
L('page:', JSON.stringify(d));
if(!d.loginish){
  const api=await page.evaluate(async(a)=>{const x=await fetch(`https://${a}/api/search?q=ZZT`,{credentials:'include'});
    const t=await x.text(); return {s:x.status, n:t.length, head:t.slice(0,160)};}, C.api);
  L('api /api/search?q=ZZT ->', JSON.stringify(api));
}
await page.screenshot({path:'/home/user/Manual-test-Cases/build/global-search/tickets-2026-09-14/evidence/GS0-access.png', fullPage:false});
await br.close();
