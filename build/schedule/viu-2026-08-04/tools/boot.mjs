// Filters QA branch sv8785 — Chromium bootstrap reusing the ONE established session.
// Deliberately never calls quick-login (stateful on the shared PHPSESSID).
import fs from 'fs';
import pw from '/opt/node22/lib/node_modules/playwright/index.js';
const { chromium } = pw;
const CK=JSON.parse(fs.readFileSync('/tmp/schedule-viu/cookies.json','utf8'));
const S=JSON.parse(fs.readFileSync('/tmp/sviu/session.json','utf8'));
export const APP='https://'+CK.host;
export const BASE='https://'+CK.api;
export const COOKIE=`sv_sso_session=${CK.sv_sso_session}; PHPSESSID=${S.phpsessid}; cf_clearance=${CK.cf_clearance}`;
const UA='Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36';
export async function api(method,path,body,cookie){
  const opts={method,redirect:'manual',headers:{Cookie:cookie||COOKIE,'User-Agent':UA,Accept:'application/json',Origin:APP,Referer:APP+'/'}};
  if(body!==undefined){opts.headers['Content-Type']='application/json';opts.body=JSON.stringify(body);}
  const r=await fetch(path.startsWith('http')?path:BASE+path,opts);
  const t=await r.text(); let j=null; try{j=JSON.parse(t);}catch{}
  return {status:r.status, body:j??t, headers:Object.fromEntries(r.headers)};
}
export async function boot(opts={}){
  const cookie=opts.cookie||COOKIE;
  const fe=await api('GET','/api/auth/me/fe-permissions',undefined,cookie);
  if(fe.status!==200){console.log('FE_PERMS_FAILED',fe.status,JSON.stringify(fe.body).slice(0,300));process.exit(2);}
  const feData=fe.body?.data;
  const userObj={data:S.user.data};
  const cookies=cookie.split('; ').map(p=>{const i=p.indexOf('=');return{name:p.slice(0,i),value:p.slice(i+1),domain:'.qa.shopview.com',path:'/'};});
  const browser=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome',headless:true,
    proxy:{server:process.env.HTTPS_PROXY},args:['--no-sandbox','--ignore-certificate-errors','--ssl-version-max=tls1.2']});
  const ctx=await browser.newContext({viewport:opts.viewport||{width:1680,height:1050},ignoreHTTPSErrors:true,
    userAgent:opts.userAgent||UA, isMobile:opts.isMobile||false, hasTouch:opts.hasTouch||false, deviceScaleFactor:opts.dsf||1, timezoneId:opts.tz||undefined});
  await ctx.addCookies(cookies);
  const page=await ctx.newPage();
  const netlog=[];
  page.on('request',r=>{const u=r.url(); if(u.includes('/api/')) netlog.push({phase:'req',method:r.request?r.request().method():r.method(),url:u});});
  page.on('response',async r=>{const u=r.url(); if(u.includes('/api/')) netlog.push({phase:'res',status:r.status(),method:r.request().method(),url:u});});
  await page.goto(APP+'/login',{waitUntil:'domcontentloaded',timeout:60000});
  await page.evaluate(({u,f})=>{localStorage.setItem('user',JSON.stringify(u));
    localStorage.setItem('fe_permissions_wrapper',JSON.stringify(f));
    if(u.data&&u.data.token) localStorage.setItem('token',JSON.stringify(u.data.token));},{u:userObj,f:feData});
  await page.waitForTimeout(400);
  return {browser,ctx,page,feData,netlog,cookie};
}
