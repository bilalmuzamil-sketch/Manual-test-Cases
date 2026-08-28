import { chromium } from 'playwright';
import fs from 'node:fs';
const APP='https://app.staging.shopview.com', API='https://api.staging.shopview.com';
const raw=fs.readFileSync('/tmp/sv8815-staging/cookies.txt','utf8').trim();
// PHPSESSID deliberately dropped - the server mints a fresh session for the browser.
const cookies=raw.split('; ').map(p=>{const i=p.indexOf('=');return {name:p.slice(0,i), value:p.slice(i+1), domain:'.staging.shopview.com', path:'/', secure:true};})
  .filter(c=>c.name==='sv_sso_session'||c.name==='cf_clearance');
const port=fs.readFileSync('/tmp/sv8815-staging/bridgeport.txt','utf8').trim();
export async function open(){
  const browser=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome',headless:true,
    proxy:{server:'http://127.0.0.1:'+port},args:['--no-sandbox','--ignore-certificate-errors','--ssl-version-max=tls1.2']});
  const ctx=await browser.newContext({viewport:{width:2400,height:1300},acceptDownloads:true});
  await ctx.addCookies(cookies);
  const page=await ctx.newPage();
  page.on('pageerror',e=>console.log('  PAGE ERR:',String(e).slice(0,130)));
  // The SPA sometimes bounces to /login before it has hydrated the session. That is a
  // TIMING flake, not an auth failure - the cookie is still good (proved with curl). So
  // retry rather than declaring the session dead (playbook: never diagnose off one run).
  for(let attempt=1; attempt<=4; attempt++){
    await page.goto(APP+'/login',{waitUntil:'domcontentloaded',timeout:60000});
    await page.waitForTimeout(9000);
    if(/\/login/.test(page.url())){
      const b=page.locator('[data-test-id="button_quick_login_admin"]').first();
      if(await b.count()) { await b.evaluate(e=>e.click()); await page.waitForTimeout(15000); }
    }
    if(!/\/login/.test(page.url())) break;
    console.log('  login attempt '+attempt+' still on /login, retrying');
    await page.waitForTimeout(4000);
  }
  console.log('  landed at:', page.url());
  if(/\/login/.test(page.url())) throw new Error('LOGIN FAILED at '+page.url());
  const api=(m,pth,b)=>page.evaluate(async([m,pth,b,API])=>{
    const r=await fetch(API+pth,{method:m,credentials:'include',headers:{'Content-Type':'application/json'},body:b?JSON.stringify(b):undefined});
    let j=null; try{j=await r.json()}catch(e){}; return {status:r.status,json:j};
  },[m,pth,b,API]);
  return {browser,ctx,page,api,APP,API};
}
export const HD='b3c8c820-f815-4cf1-8938-10956c5ee71a';
export async function ensureHD(s){
  const r=await s.api('POST','/api/iam/change-location',{workplace_id:HD,workplace_timezone:'America/Edmonton'});
  return r.status;
}
export async function mode(s){
  const w=await s.api('GET','/api/workplaces');
  const col=w.json?.data?.collection||[];
  return (col.find(x=>x.id===HD)||{}).salesTaxRoundingMode;
}
