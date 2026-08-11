// Step 0.2 — load the QA lead's exact entry point, cookies ONLY.
// Deliberately NO localStorage seeding and NO injected user/workplace object:
// we record where the application actually puts us (Standing Rules 12 / 57).
// Requests are proxied through node fetch inside a Playwright route handler —
// the proven pattern on this estate (Chromium cannot TLS the egress proxy itself).
const {chromium}=require('/opt/node22/lib/node_modules/playwright');
const fs=require('fs');
const APP='https://sv8685.qa.shopview.com';
const TARGET=process.argv[3]||(APP+'/schedule');
const CK=fs.readFileSync('/tmp/qa-cookies/schedule-cookie-header.txt','utf8').trim();
const UA='Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
const OUT=process.argv[2]||'/home/user/Manual-test-Cases/build/schedule/build-viu-2026-08-11/evidence';
const TAG=process.argv[4]||'step0';
(async()=>{
  const browser=await chromium.launch({args:['--no-sandbox','--ignore-certificate-errors','--disable-web-security','--disable-dev-shm-usage']});
  const ctx=await browser.newContext({viewport:{width:1680,height:1080},ignoreHTTPSErrors:true,userAgent:UA});
  await ctx.addCookies(CK.split('; ').map(p=>{const i=p.indexOf('=');return{name:p.slice(0,i),value:p.slice(i+1),domain:'.qa.shopview.com',path:'/',secure:true};}));
  const apiLog=[], nav=[];
  await ctx.route('**/*', async (route)=>{
    const req=route.request(), url=req.url();
    if(!/qa\.shopview\.com/.test(url)) return route.abort();
    try{
      const hdrs=Object.assign({},req.headers()); delete hdrs['host']; delete hdrs['content-length'];
      hdrs['cookie']=CK; hdrs['user-agent']=UA;
      const r=await fetch(url,{method:req.method(),headers:hdrs,body:req.postDataBuffer()||undefined,redirect:'manual'});
      const buf=Buffer.from(await r.arrayBuffer());
      const h={}; r.headers.forEach((v,k)=>{ if(!['content-encoding','content-length','transfer-encoding','set-cookie'].includes(k)) h[k]=v; });
      h['access-control-allow-origin']='*';
      if(/\/api\//.test(url)) apiLog.push({m:req.method(),s:r.status,u:url.replace(/^https:\/\/[^/]+/,'')});
      await route.fulfill({status:r.status,headers:h,body:buf});
    }catch(e){ try{await route.abort();}catch(_){ } }
  });
  const page=await ctx.newPage();
  page.on('framenavigated',f=>{ if(f===page.mainFrame()) nav.push(f.url()); });
  let err=null;
  try{ await page.goto(TARGET,{waitUntil:'domcontentloaded',timeout:120000}); await page.waitForTimeout(12000); }
  catch(e){ err=String(e).slice(0,300); }
  const landed=page.url();
  const title=await page.title().catch(()=>null);
  const bodyText=(await page.evaluate(()=>document.body?document.body.innerText.slice(0,4000):'').catch(()=>''))||'';
  await page.screenshot({path:`${OUT}/${TAG}-landing.png`}).catch(()=>{});
  fs.writeFileSync(`${OUT}/${TAG}-landing.json`,JSON.stringify({
    asked_for:TARGET, landed_on:landed, title, error:err,
    navigations:nav, api_calls:apiLog.slice(0,80),
    body_text_first_4000:bodyText, read_at_utc:new Date().toISOString()
  },null,2));
  console.log('ASKED  :',TARGET);
  console.log('LANDED :',landed);
  console.log('TITLE  :',title);
  console.log('NAV    :',JSON.stringify(nav));
  console.log('API    :',JSON.stringify(apiLog.slice(0,15)));
  console.log('BODY   :',bodyText.replace(/\s+/g,' ').slice(0,600));
  await browser.close();
})();
