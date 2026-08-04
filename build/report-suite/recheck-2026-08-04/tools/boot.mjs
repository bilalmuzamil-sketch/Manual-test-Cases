// boot.mjs — Chromium bootstrap that REUSES the already-established session.
// Deliberately does NOT call quick-login: it is stateful on the shared PHPSESSID and
// repeated calls burned the previous worker's session. Reads the persisted cookie.
import fs from 'fs';
import pw from '/opt/node22/lib/node_modules/playwright/index.js';
const { chromium } = pw;
export const APP='https://sv8582.qa.shopview.com';
export const BASE='https://sv8582api.qa.shopview.com';
const UA='Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36';
const SESS=JSON.parse(fs.readFileSync('/tmp/report-suite-viu/rc/session.json','utf8')).cookie;

export async function api(method,path,body,cookie){
  const opts={method,redirect:'manual',headers:{Cookie:cookie||SESS,'User-Agent':UA,Accept:'application/json',Origin:APP,Referer:APP+'/'}};
  if(body!==undefined){opts.headers['Content-Type']='application/json';opts.body=JSON.stringify(body);}
  const r=await fetch(path.startsWith('http')?path:BASE+path,opts);
  const t=await r.text(); let j=null; try{j=JSON.parse(t);}catch{}
  return {status:r.status, body:j??t};
}
export async function boot(opts={}){
  const cookie = opts.cookie || SESS;
  // token + user object come from a read-only profile call, not a fresh login
  const fe = await api('GET','/api/auth/me/fe-permissions',undefined,cookie);
  if(fe.status!==200){ console.log('FE_PERMS_FAILED',fe.status, JSON.stringify(fe.body).slice(0,200)); process.exit(2); }
  const feData=fe.body?.data;
  // EXACT shape the SPA expects: { data: <the quick-login data payload> } (proven boot2 pattern)
  const userObj=JSON.parse(fs.readFileSync('/tmp/report-suite-viu/rc/userobj.json','utf8'));
  const cookies=cookie.split('; ').map(p=>{const i=p.indexOf('=');return{name:p.slice(0,i),value:p.slice(i+1),domain:'.qa.shopview.com',path:'/'};});
  const browser=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome',headless:true,
    proxy:{server:process.env.HTTPS_PROXY}, args:['--no-sandbox','--ignore-certificate-errors','--ssl-version-max=tls1.2']});
  const ctx=await browser.newContext({viewport:opts.viewport||{width:1680,height:1050},ignoreHTTPSErrors:true});
  await ctx.addCookies(cookies);
  const page=await ctx.newPage();
  const netlog=[];
  page.on('response',r=>{const u=r.url(); if(u.includes('/api/')) netlog.push({status:r.status(),method:r.request().method(),url:u});});
  await page.goto(APP+'/login',{waitUntil:'domcontentloaded',timeout:60000});
  await page.evaluate(({u,f})=>{localStorage.setItem('user',JSON.stringify(u));
    localStorage.setItem('fe_permissions_wrapper',JSON.stringify(f));
    if(u.data&&u.data.token) localStorage.setItem('token',JSON.stringify(u.data.token));},{u:userObj,f:feData});
  await page.waitForTimeout(400);
  return {browser,ctx,page,feData,netlog,cookie};
}
export async function spaGo(page,path,waitMs=6000){
  await page.evaluate(p=>{history.pushState({},'',p);dispatchEvent(new PopStateEvent('popstate'));},path);
  await page.waitForTimeout(waitMs);
}
