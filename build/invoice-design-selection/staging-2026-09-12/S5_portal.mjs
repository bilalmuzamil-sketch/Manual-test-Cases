// READ ONLY. Mint the portal session directly (the menu click just POSTs sso-login) and survey
// what documents already exist, so nothing has to be created.
import pkg from '/opt/node22/lib/node_modules/playwright/index.js';
const { chromium } = pkg; import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/invoice-design-selection/staging-2026-09-12';
const APP='https://app.staging.shopview.com', APIH='api.staging.shopview.com';
const PORTAL='https://staging.portal.shopview.com';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));
const R={readOnly:true}; const save=()=>fs.writeFileSync(`${DIR}/evidence/S5.json`, JSON.stringify(R,null,1));
const port=fs.readFileSync('/tmp/atlassian/bridge-port.txt','utf8').trim();
const C=JSON.parse(fs.readFileSync('/tmp/qa-cookies/staging-full.json','utf8'));
const browser=await chromium.launch({executablePath:process.env.CHROME_BIN||'/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args:[`--proxy-server=http://127.0.0.1:${port}`,'--ignore-certificate-errors','--no-sandbox']});
const ctx=await browser.newContext({ignoreHTTPSErrors:true, viewport:{width:1700,height:1150}});
for (const host of ['app.staging.shopview.com', APIH, 'staging.portal.shopview.com'])
  await ctx.addCookies([{name:'sv_sso_session',value:C.sv_sso_session,domain:host,path:'/',secure:true},
                        {name:'PHPSESSID',value:C.PHPSESSID,domain:host,path:'/',secure:true}]);
await ctx.addCookies([{name:'cf_clearance',value:C.cf_clearance,domain:'.shopview.com',path:'/',secure:true}]);
const p=await ctx.newPage();
await p.goto(`${APP}/`,{waitUntil:'domcontentloaded',timeout:90000}).catch(()=>{});
await p.waitForTimeout(6000);
// mint the portal session the way the menu item does
R.ssoLogin=await p.evaluate(async(P)=>{try{
  const r=await fetch(`${P}/sso-login`,{method:'POST',credentials:'include',headers:{'Accept':'application/json'}});
  return {s:r.status, t:(await r.text()).slice(0,300)};}catch(e){return {s:0,t:String(e).slice(0,120)};}}, PORTAL);
log('POST %s/sso-login -> %s %s', PORTAL, R.ssoLogin.s, R.ssoLogin.t.slice(0,150).replace(/\s+/g,' '));
save();
// go to the portal and see what we get
const pp=await ctx.newPage();
await pp.goto(`${PORTAL}/invoices`,{waitUntil:'domcontentloaded',timeout:90000}).catch(()=>{});
await pp.waitForTimeout(12000);
R.portal={url:pp.url(), text:await pp.evaluate(()=>(document.body.innerText||'').replace(/\s+/g,' ').slice(0,800))};
log('portal url: %s', R.portal.url);
log('portal page: %s', R.portal.text.slice(0,400));
const ck=await ctx.cookies(PORTAL);
R.portalCookies=ck.map(c=>c.name);
log('portal cookies now: %s', JSON.stringify(R.portalCookies));
// the embedded page data (Inertia) tells us the rows without scraping the table
R.pageData=await pp.evaluate(()=>{const el=document.querySelector('script[data-page]');
  if(!el) return null; try{const j=JSON.parse(el.textContent);
    const pr=j.props||{}; const keys=Object.keys(pr);
    const inv=pr.invoices&&(pr.invoices.data||pr.invoices);
    return {component:j.component, propKeys:keys,
      invoiceCount:Array.isArray(inv)?inv.length:null,
      sample:Array.isArray(inv)?inv.slice(0,8).map(x=>({n:x.invoice_number||x.number, st:x.status||x.payment_status, bal:x.total_balance||x.balance})):null};
  }catch(e){return {error:String(e).slice(0,120)};}});
log('portal page data: %s', JSON.stringify(R.pageData).slice(0,700));
await pp.screenshot({path:`${DIR}/evidence/S5-portal.png`, fullPage:true});
save(); log('done — nothing changed'); await browser.close(); process.exit(0);
