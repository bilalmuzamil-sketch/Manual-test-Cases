// READ ONLY. Mint the portal token the way the app does, SSO into the portal, survey what exists.
import pkg from '/opt/node22/lib/node_modules/playwright/index.js';
const { chromium } = pkg; import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/invoice-design-selection/staging-2026-09-12';
const APP='https://app.staging.shopview.com', APIH='api.staging.shopview.com';
const PORTAL='https://staging.portal.shopview.com';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));
const R={readOnly:true}; const save=()=>fs.writeFileSync(`${DIR}/evidence/S6.json`, JSON.stringify(R,null,1));
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
// 1. mint the token
R.tokenMeta={};
R.token=await p.evaluate(async(a)=>{const r=await fetch(`https://${a}/api/token`,{method:'POST',credentials:'include',
  headers:{'Content-Type':'application/json',Accept:'application/json'}});
  const t=await r.text(); return {s:r.status, t:t};},APIH);
log('POST /api/token -> %s (body withheld, it carries a token)', R.token.s);
let tok=null; try{ const j=JSON.parse(R.token.t); tok=(j.data&&(j.data.accessToken||j.data.token))||j.accessToken||j.token||null; }catch(e){}
log('token extracted: %s', tok? (String(tok).slice(0,18)+'…') : 'NONE');
R.token={s:R.token.s, t:'(withheld)'};
save();
if(!tok){ log('no token — stopping'); save(); await browser.close(); process.exit(1); }
// 2. sso into the portal
R.sso=await p.evaluate(async({P,tok})=>{const r=await fetch(`${P}/sso-login`,{method:'POST',credentials:'include',
  headers:{'Content-Type':'application/json',Accept:'application/json',Authorization:`Bearer ${tok}`},
  body:JSON.stringify({returnJson:true, portalType:'customer'})});
  const t=await r.text(); return {s:r.status, t:t.slice(0,400)};},{P:PORTAL,tok});
log('POST sso-login -> %s %s', R.sso.s, R.sso.t.slice(0,220).replace(/\s+/g,' '));
save();
let redirect=null; try{ redirect=JSON.parse(R.sso.t).redirect; }catch(e){}
log('redirect: %s', redirect);
if(!redirect){ log('no redirect — stopping'); save(); await browser.close(); process.exit(1); }
// 3. follow it
const pp=await ctx.newPage();
await pp.goto(redirect,{waitUntil:'domcontentloaded',timeout:90000}).catch(()=>{});
await pp.waitForTimeout(12000);
R.portal={url:pp.url(), text:await pp.evaluate(()=>(document.body.innerText||'').replace(/\s+/g,' ').slice(0,900))};
log('PORTAL url: %s', R.portal.url);
log('PORTAL page: %s', R.portal.text.slice(0,450));
R.pageData=await pp.evaluate(()=>{const el=document.querySelector('script[data-page]'); if(!el) return null;
  try{const j=JSON.parse(el.textContent); const pr=j.props||{};
    const inv=pr.invoices&&(pr.invoices.data||pr.invoices);
    return {component:j.component, propKeys:Object.keys(pr),
      count:Array.isArray(inv)?inv.length:null,
      rows:Array.isArray(inv)?inv.slice(0,12).map(x=>({n:x.invoice_number||x.number,
        st:x.status||x.payment_status, bal:x.balance||x.total_balance, id:x.id})):null};}catch(e){return {error:String(e).slice(0,150)};}});
log('portal data: %s', JSON.stringify(R.pageData).slice(0,900));
await pp.screenshot({path:`${DIR}/evidence/S6-portal.png`, fullPage:true});
save(); log('done — nothing changed'); await browser.close(); process.exit(0);
