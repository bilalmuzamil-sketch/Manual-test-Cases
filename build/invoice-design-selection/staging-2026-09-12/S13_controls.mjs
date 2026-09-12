import pkg from '/opt/node22/lib/node_modules/playwright/index.js';
const { chromium } = pkg; import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/invoice-design-selection/staging-2026-09-12';
const APP='https://app.staging.shopview.com', APIH='api.staging.shopview.com';
const PORTAL='https://staging.portal.shopview.com';
const log=(...a)=>console.log(a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));
const port=fs.readFileSync('/tmp/atlassian/bridge-port.txt','utf8').trim();
const C=JSON.parse(fs.readFileSync('/tmp/qa-cookies/staging-full.json','utf8'));
const browser=await chromium.launch({executablePath:process.env.CHROME_BIN||'/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args:[`--proxy-server=http://127.0.0.1:${port}`,'--ignore-certificate-errors','--no-sandbox']});
const ctx=await browser.newContext({ignoreHTTPSErrors:true, viewport:{width:1700,height:1200}, acceptDownloads:true});
for (const h of ['app.staging.shopview.com',APIH,'staging.portal.shopview.com'])
  await ctx.addCookies([{name:'sv_sso_session',value:C.sv_sso_session,domain:h,path:'/',secure:true},
                        {name:'PHPSESSID',value:C.PHPSESSID,domain:h,path:'/',secure:true}]);
await ctx.addCookies([{name:'cf_clearance',value:C.cf_clearance,domain:'.shopview.com',path:'/',secure:true}]);
const shop=await ctx.newPage();
await shop.goto(`${APP}/`,{waitUntil:'domcontentloaded',timeout:90000}).catch(()=>{});
await shop.waitForTimeout(6000);
const tok=JSON.parse(await shop.evaluate(async(a)=>{const r=await fetch(`https://${a}/api/token`,{method:'POST',credentials:'include',
  headers:{'Content-Type':'application/json',Accept:'application/json'}}); return await r.text();},APIH)).data.accessToken;
await shop.evaluate(async({P,tok})=>{await fetch(`${P}/sso-login`,{method:'POST',credentials:'include',
  headers:{'Content-Type':'application/json',Accept:'application/json',Authorization:`Bearer ${tok}`},
  body:JSON.stringify({returnJson:true,portalType:'customer'})});},{P:PORTAL,tok});
const pp=await ctx.newPage();
await pp.goto(`${PORTAL}/invoices/21c5d7e5-f42d-4398-bd25-cf40c7650bb7`,{waitUntil:'networkidle',timeout:90000}).catch(()=>{});
await pp.waitForTimeout(14000);
const all=await pp.evaluate(()=>{
  const vis=e=>{const r=e.getBoundingClientRect(); const c=getComputedStyle(e);
    return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden';};
  return [...document.querySelectorAll('button,a,[role=button],[class*=cursor-pointer],svg')].filter(vis)
    .map(e=>{const r=e.getBoundingClientRect(); return {tag:e.tagName,
      label:e.getAttribute('aria-label')||e.getAttribute('title')||'',
      text:(e.textContent||'').replace(/\s+/g,' ').trim().slice(0,45),
      cls:(e.className&&e.className.baseVal!==undefined?e.className.baseVal:String(e.className||'')).slice(0,70),
      icon:(e.tagName==='SVG'?e.innerHTML.slice(0,80):(e.querySelector('svg')?(e.querySelector('svg').getAttribute('class')||e.querySelector('svg').innerHTML.slice(0,80)):'')),
      href:e.getAttribute('href')||'', x:Math.round(r.x), y:Math.round(r.y), w:Math.round(r.width), h:Math.round(r.height)};});});
log('clickables/icons total:', all.length);
for(const a of all) log('   ', JSON.stringify(a).slice(0,210));
await pp.screenshot({path:`${DIR}/evidence/S13-invoice-page.png`, fullPage:true});
fs.writeFileSync('/tmp/claude-0/S13.json', JSON.stringify(all,null,1));
await browser.close(); process.exit(0);
