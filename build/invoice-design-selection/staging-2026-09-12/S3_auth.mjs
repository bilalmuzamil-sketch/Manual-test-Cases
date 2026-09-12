// READ ONLY. Which route authenticates on staging: the QA lead's cookies (API?) or dev quick-login (SPA?)
import pkg from '/opt/node22/lib/node_modules/playwright/index.js';
const { chromium } = pkg; import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/invoice-design-selection/staging-2026-09-12';
const APP='https://app.staging.shopview.com', APIH='api.staging.shopview.com';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));
const R={}; const save=()=>fs.writeFileSync(`${DIR}/evidence/S3.json`, JSON.stringify(R,null,1));
const port=fs.readFileSync('/tmp/atlassian/bridge-port.txt','utf8').trim();
const C=JSON.parse(fs.readFileSync('/tmp/qa-cookies/staging-full.json','utf8'));
const VIS=`(e)=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);
  return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden'&&parseFloat(c.opacity)>0.01;}`;
const browser=await chromium.launch({executablePath:process.env.CHROME_BIN||'/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args:[`--proxy-server=http://127.0.0.1:${port}`,'--ignore-certificate-errors','--no-sandbox']});

// ---------- A. his cookies: does the API answer? ----------
{
  const ctx=await browser.newContext({ignoreHTTPSErrors:true});
  for (const host of ['app.staging.shopview.com', APIH])
    await ctx.addCookies([{name:'sv_sso_session',value:C.sv_sso_session,domain:host,path:'/',secure:true},
                          {name:'PHPSESSID',value:C.PHPSESSID,domain:host,path:'/',secure:true}]);
  await ctx.addCookies([{name:'cf_clearance',value:C.cf_clearance,domain:'.shopview.com',path:'/',secure:true}]);
  const p=await ctx.newPage();
  await p.goto(`${APP}/`,{waitUntil:'domcontentloaded',timeout:90000}).catch(()=>{});
  await p.waitForTimeout(6000);
  const api=(path)=>p.evaluate(async({a,path})=>{try{const r=await fetch(`https://${a}${path}`,{credentials:'include',headers:{Accept:'application/json'}});
    return {s:r.status,t:(await r.text()).slice(0,300)};}catch(e){return {s:0,t:String(e).slice(0,80)};}},{a:APIH,path});
  R.cookieRoute={};
  for(const path of ['/api/organizations/invoice-settings/view','/api/staff/my-workplaces','/api/auth/me/fe-permissions']){
    const r=await api(path); R.cookieRoute[path]={s:r.s,t:r.t.slice(0,160)};
    log('[his cookies] %s -> %s %s', path, r.s, r.t.slice(0,110).replace(/\s+/g,' '));
  }
  await ctx.close();
}
save();
// ---------- B. dev quick-login on staging ----------
{
  const ctx=await browser.newContext({ignoreHTTPSErrors:true, viewport:{width:1700,height:1150}});
  await ctx.addCookies([{name:'cf_clearance',value:C.cf_clearance,domain:'.shopview.com',path:'/',secure:true}]);
  const p=await ctx.newPage();
  await p.goto(`${APP}/login`,{waitUntil:'domcontentloaded',timeout:90000}).catch(()=>{});
  await p.waitForTimeout(9000);
  R.loginPage=await p.evaluate(()=>(document.body.innerText||'').replace(/\s+/g,' ').slice(0,260));
  log('[quick-login] login page: %s', R.loginPage.slice(0,180));
  const clicked=await p.evaluate(vis=>{const isVis=eval(vis);const t=e=>(e.innerText||'').replace(/\s+/g,' ').trim();
    const b=[...document.querySelectorAll('button,.q-btn,div,span')].filter(isVis).find(e=>/^admin_panel_settings\s*Admin$|^Admin$/i.test(t(e)));
    if(b){b.click(); return t(b);} return null;},VIS);
  await p.waitForTimeout(14000);
  R.quickLogin={clicked, url:p.url(),
    signedIn:await p.evaluate(()=>{try{return !!JSON.parse(localStorage.getItem('user')||'null');}catch(e){return false;}})};
  log('[quick-login] clicked %s -> %s | signed in: %s', clicked, p.url(), R.quickLogin.signedIn);
  if(R.quickLogin.signedIn){
    R.quickLogin.who=await p.evaluate(()=>{try{const u=JSON.parse(localStorage.getItem('user')||'{}');const d=u.data||u;
      return {email:d.email, perms:(d.fePermissions||d.fe_permissions||[]).length, org:(d.organization&&d.organization.name)||null};}catch(e){return null;}});
    R.quickLogin.bar=await p.evaluate(vis=>{const isVis=eval(vis);const t=e=>(e.innerText||'').replace(/\s+/g,' ').trim();
      return [...document.querySelectorAll('button,.q-btn')].filter(isVis).map(t).find(x=>/ - \d+|Staging/.test(x))||null;},VIS);
    log('[quick-login] who: %s | top bar: %s', JSON.stringify(R.quickLogin.who), R.quickLogin.bar);
    const st=await p.evaluate(async(a)=>{const r=await fetch(`https://${a}/api/organizations/invoice-settings/view`,{credentials:'include',headers:{Accept:'application/json'}});
      return {s:r.status,t:(await r.text()).slice(0,400)};},APIH);
    R.quickLogin.settings=st;
    log('[quick-login] invoice-settings -> %s %s', st.s, st.t.slice(0,220).replace(/\s+/g,' '));
    await p.screenshot({path:`${DIR}/evidence/S3-quicklogin.png`});
  }
  await ctx.close();
}
save(); log('done — nothing changed'); await browser.close(); process.exit(0);
