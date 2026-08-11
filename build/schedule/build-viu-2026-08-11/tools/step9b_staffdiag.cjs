// Isolate the empty Staff / Roles lists. Log BOTH SIDES of every request the page
// makes: url, method, query, headers, status, and the body when JSON. The fetch
// bridge is itself a suspect, so bridge errors are captured rather than swallowed.
const {chromium}=require('/opt/node22/lib/node_modules/playwright');
const fs=require('fs');
const APP='https://sv8685.qa.shopview.com';
const CK=fs.readFileSync('/tmp/qa-cookies/schedule-cookie-header.txt','utf8').trim();
const UA='Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
const OUT='/home/user/Manual-test-Cases/build/schedule/build-viu-2026-08-11/evidence';
const isStatic=u=>/\.(js|css|woff2?|ttf|png|jpg|jpeg|svg|ico|webp|map)(\?|$)/i.test(u);
const log=[]; const say=(...a)=>{console.log(...a); log.push(a.join(' '));};
(async()=>{
  const browser=await chromium.launch({args:['--no-sandbox','--ignore-certificate-errors','--disable-web-security','--disable-dev-shm-usage']});
  const ctx=await browser.newContext({viewport:{width:1680,height:1080},ignoreHTTPSErrors:true,userAgent:UA});
  await ctx.addCookies(CK.split('; ').map(p=>{const i=p.indexOf('=');return{name:p.slice(0,i),value:p.slice(i+1),domain:'.qa.shopview.com',path:'/',secure:true};}));
  const calls=[];
  await ctx.route('**/*', async (route)=>{
    const req=route.request(), url=req.url();
    if(!/qa\.shopview\.com/.test(url)) return route.abort();
    const api=/\/api\//.test(url);
    try{
      const hdrs=Object.assign({},req.headers()); delete hdrs['host']; delete hdrs['content-length'];
      hdrs['cookie']=CK; hdrs['user-agent']=UA;
      const r=await fetch(url,{method:req.method(),headers:hdrs,body:req.postDataBuffer()||undefined,redirect:'manual'});
      const buf=Buffer.from(await r.arrayBuffer());
      const h={}; r.headers.forEach((v,k)=>{ if(!['content-encoding','content-length','transfer-encoding','set-cookie'].includes(k)) h[k]=v; });
      h['access-control-allow-origin']='*';
      if(api){
        let body=null, count=null;
        const ct=(h['content-type']||'');
        if(/json/.test(ct)){ try{ const j=JSON.parse(buf.toString('utf8'));
          const c=j&&j.data&&j.data.collection; if(Array.isArray(c)) count=c.length;
          body=JSON.stringify(j).slice(0,600); }catch(e){ body='<unparseable>'; } }
        calls.push({m:req.method(),u:url.replace(/^https:\/\/[^/]+/,''),s:r.status,ct,collection_count:count,
                    accept:req.headers()['accept'],body_head:body,post:req.postData()?req.postData().slice(0,300):null});
      }
      await route.fulfill({status:r.status,headers:h,body:buf});
    }catch(e){
      // the bridge itself failing is a real candidate - record it, never swallow it
      if(api) calls.push({m:req.method(),u:url.replace(/^https:\/\/[^/]+/,''),BRIDGE_ERROR:String(e).slice(0,200)});
      try{await route.abort();}catch(_){ }
    }
  });
  const seed=JSON.parse(fs.readFileSync('/tmp/seed3.json','utf8'));
  await ctx.addInitScript(sd=>{try{
    localStorage.setItem('user',JSON.stringify(sd.user));
    localStorage.setItem('fe_permissions_wrapper',JSON.stringify(sd.fp));
    localStorage.setItem('token',sd.user.data.token);
    localStorage.setItem('bookkeeping_enabled','false');
    localStorage.setItem('location',JSON.stringify(sd.wp.id));
    localStorage.setItem('timezone',sd.wp.tz);
    localStorage.setItem('country_code',sd.wp.cc);
    localStorage.setItem('current_shop_id',sd.wp.shop);
    localStorage.setItem('organization_id',sd.org);
    localStorage.setItem('organizationId',sd.org);
    localStorage.setItem('organization',JSON.stringify({id:sd.org}));
  }catch(e){}}, seed);
  const page=await ctx.newPage();
  const conerr=[]; page.on('pageerror',e=>conerr.push(String(e).slice(0,200)));
  page.on('console',m=>{ if(m.type()==='error') conerr.push('console: '+m.text().slice(0,200)); });

  for(const [route,tag] of [['/administration/roles-permissions','roles-fix'],['/administration/staff','staff-fix']]){
    calls.length=0; conerr.length=0;
    await page.goto(APP+route,{waitUntil:'domcontentloaded',timeout:120000});
    await page.waitForTimeout(15000);
    const dom=await page.evaluate(()=>({
      rows:document.querySelectorAll('tbody tr, [role=row]').length,
      empty:/Empty bays|No .* found|Active\(0\)/.test(document.body.innerText),
      tabs:(document.body.innerText.match(/Active\(\d+\)|Deactivated\(\d+\)/g)||[]),
      body:document.body.innerText.replace(/\s+/g,' ').slice(0,320)
    }));
    say(`\n===== ${route} =====`);
    say(`DOM: rows=${dom.rows} emptyState=${dom.empty} tabs=${JSON.stringify(dom.tabs)}`);
    say(`API CALLS THE PAGE MADE (${calls.length}):`);
    for(const c of calls) say('  '+JSON.stringify(c).slice(0,420));
    if(conerr.length) say(`JS ERRORS (${conerr.length}): `+JSON.stringify(conerr.slice(0,4)));
    else say('JS ERRORS: none');
    fs.writeFileSync(`${OUT}/diag-${tag}.json`,JSON.stringify({route,dom,calls,js_errors:conerr},null,1));
    await page.screenshot({path:`${OUT}/diag-${tag}.png`}).catch(()=>{});
  }
  fs.writeFileSync(OUT+'/staff-diagnosis.log',log.join('\n'));
  say('\nDONE');
  await browser.close();
})();
