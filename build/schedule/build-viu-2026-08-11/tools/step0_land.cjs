// Step 0.2 — load the QA lead's exact entry point with cookies ONLY.
// No localStorage seeding, no hydration, no injected user/workplace: we record
// where the application actually puts us (Rules 12/57).
const {chromium}=require('/opt/node22/lib/node_modules/playwright');
const fs=require('fs');
const APP='https://sv8685.qa.shopview.com';
const TARGET=APP+'/schedule';
const CK=fs.readFileSync('/tmp/qa-cookies/schedule-cookie-header.txt','utf8').trim();
const UA='Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
const OUT=process.argv[2]||'/home/user/Manual-test-Cases/build/schedule/build-viu-2026-08-11/evidence';
(async()=>{
  const PROXY=process.env.HTTPS_PROXY||process.env.https_proxy;
  const browser=await chromium.launch({proxy:{server:PROXY},args:['--no-sandbox','--ignore-certificate-errors','--disable-dev-shm-usage']});
  const ctx=await browser.newContext({viewport:{width:1680,height:1080},ignoreHTTPSErrors:true,userAgent:UA});
  await ctx.addCookies(CK.split('; ').map(p=>{const i=p.indexOf('=');return{name:p.slice(0,i),value:p.slice(i+1),domain:'.qa.shopview.com',path:'/',secure:true};}));
  const apiLog=[]; const nav=[];
  ctx.on('response',r=>{const u=r.url(); if(/\/api\//.test(u)) apiLog.push({s:r.status(),u:u.replace(/^https:\/\/[^/]+/,'')});});
  const page=await ctx.newPage();
  page.on('framenavigated',f=>{ if(f===page.mainFrame()) nav.push(f.url()); });
  let err=null;
  try{ await page.goto(TARGET,{waitUntil:'domcontentloaded',timeout:120000}); await page.waitForTimeout(9000); }
  catch(e){ err=String(e).slice(0,300); }
  const landed=page.url();
  const title=await page.title().catch(()=>null);
  const bodyText=(await page.evaluate(()=>document.body?document.body.innerText.slice(0,3000):'').catch(()=>''))||'';
  await page.screenshot({path:OUT+'/step0-schedule-landing.png',fullPage:false}).catch(()=>{});
  fs.writeFileSync(OUT+'/step0-landing.json',JSON.stringify({
    asked_for:TARGET, landed_on:landed, title, error:err,
    navigations:nav, api_calls:apiLog.slice(0,60),
    body_text_first_3000:bodyText, read_at_utc:new Date().toISOString()
  },null,2));
  console.log('ASKED  :',TARGET);
  console.log('LANDED :',landed);
  console.log('TITLE  :',title);
  console.log('API    :',JSON.stringify(apiLog.slice(0,12)));
  console.log('BODY   :',bodyText.replace(/\n+/g,' | ').slice(0,400));
  await browser.close();
})();
