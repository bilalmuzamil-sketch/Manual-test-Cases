import pw from '/opt/node22/lib/node_modules/playwright/index.js';
import fs from 'fs';
const { chromium } = pw;
const ENVS={
  qa:{app:'https://sv9833.qa.shopview.com',api:'https://sv9833api.qa.shopview.com',ck:'/tmp/sv9833/cookies.json',dom:'.qa.shopview.com'},
  stg:{app:'https://app.staging.shopview.com',api:'https://api.staging.shopview.com',ck:'/tmp/sv9833/stg-cookies.json',dom:'.staging.shopview.com'},
};
const UA='Mozilla/5.0';
export async function boot(envName='qa',key='admin'){
  const E=ENVS[envName]; const APP=E.app, API=E.api;
  const CK=Object.entries(JSON.parse(fs.readFileSync(E.ck,'utf8'))).map(([k,v])=>`${k}=${v}`).join('; ');
  const r=await fetch(API+'/api/quick-login',{method:'POST',redirect:'manual',
    headers:{'Cookie':CK,'User-Agent':UA,'Content-Type':'application/json','Origin':APP,'Referer':APP+'/'},
    body:JSON.stringify({key})});
  const t=await r.text(); let data=null; try{data=JSON.parse(t)}catch{}
  if(r.status>=400){console.log('LOGIN FAIL',envName,r.status,t.slice(0,200));process.exit(2);}
  const m=(r.headers.get('set-cookie')||'').match(/PHPSESSID=([^;]+)/);
  const parts=CK.split('; ').filter(x=>!x.startsWith('PHPSESSID=')); if(m) parts.unshift('PHPSESSID='+m[1]);
  const sess=parts.join('; ');
  const H={'Cookie':sess,'User-Agent':UA,'Accept':'application/json','Origin':APP,'Referer':APP+'/','Content-Type':'application/json'};
  const fe=await (await fetch(API+'/api/auth/me/fe-permissions',{headers:H})).json().catch(()=>null);
  const cookies=sess.split('; ').map(p=>{const i=p.indexOf('=');return{name:p.slice(0,i),value:p.slice(i+1),domain:E.dom,path:'/'}});
  const browser=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome',headless:true,
    proxy:{server:process.env.HTTPS_PROXY},args:['--no-sandbox','--ignore-certificate-errors','--ssl-version-max=tls1.2']});
  const ctx=await browser.newContext({viewport:{width:+(process.env.SV_VW||1600),height:+(process.env.SV_VH||1000)},ignoreHTTPSErrors:true});
  await ctx.addCookies(cookies);
  const page=await ctx.newPage();
  const net=[];
  page.on('request',q=>{ const u=q.url(); if(u.startsWith(API)&&q.method()!=='GET') net.push({m:q.method(),u:u.replace(API,''),body:(()=>{try{return q.postData()}catch{return null}})()}); });
  page.on('response',async s=>{ const u=s.url(); if(u.startsWith(API)&&s.request().method()!=='GET'){ const e=net.find(x=>x.u===u.replace(API,'')&&x.st===undefined); if(e){e.st=s.status(); try{e.res=(await s.text()).slice(0,300)}catch{} } } });
  await page.goto(APP+'/login',{waitUntil:'domcontentloaded',timeout:60000});
  await page.evaluate(({u,f})=>{localStorage.setItem('user',JSON.stringify(u));
    localStorage.setItem('fe_permissions_wrapper',JSON.stringify(f));
    if(u.data&&u.data.token) localStorage.setItem('token',JSON.stringify(u.data.token));
    const det=u.data&&u.data.details||{};
    if(det.bookkeeping_enabled!==undefined) localStorage.setItem('bookkeeping_enabled',String(det.bookkeeping_enabled));},
    {u:{data:data?.data??data},f:fe?.data});
  await page.waitForTimeout(400);
  return {browser,ctx,page,H,APP,API,net,user:data?.data,fe:fe?.data};
}
export const api=async(E,H,p,m='GET',b=null)=>{const o={method:m,headers:H};if(b)o.body=JSON.stringify(b);
  const r=await fetch(E+p,o);const t=await r.text();try{return{s:r.status,b:JSON.parse(t)}}catch{return{s:r.status,b:t.slice(0,300)}}};
