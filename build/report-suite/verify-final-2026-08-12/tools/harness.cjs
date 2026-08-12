// Shared bridge + hydration for the Report Suite QA branch.
// Two deliberate differences from the 12-Aug-morning boot.cjs:
//   1. the bridge FULFILS WITH 599 on a thrown fetch instead of route.abort(), so
//      "the app never asked for this" and "the request failed" stop looking identical
//      (schedule/build-viu-2026-08-12/HARNESS-FIX.md section 2).
//   2. RENDERED() reads the COMPUTED STYLE, so a label under text-transform is reported
//      as the tester sees it, not as the markup ships it.
const {chromium}=require('/opt/node22/lib/node_modules/playwright');
const fs=require('fs'),path=require('path'),crypto=require('crypto');
const APP='https://sv8582.qa.shopview.com', API='https://sv8582api.qa.shopview.com';
const CK=fs.readFileSync('/tmp/qa-cookies/reports-cookie-header.txt','utf8').trim();
const UA='Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
const CACHE='/tmp/assetcache'; fs.mkdirSync(CACHE,{recursive:true});
const isStatic=u=>/\.(js|css|woff2?|ttf|png|jpg|jpeg|svg|ico|webp|map)(\?|$)/i.test(u);

async function api(p,opts={}){
  const r=await fetch((p.startsWith('http')?p:API+p),{method:opts.method||'GET',
    headers:Object.assign({Cookie:CK,Accept:'application/json','Content-Type':'application/json','User-Agent':UA},opts.headers||{}),
    body:opts.body!==undefined?(typeof opts.body==='string'?opts.body:JSON.stringify(opts.body)):undefined});
  const t=await r.text(); try{return{status:r.status,body:JSON.parse(t)};}catch(e){return{status:r.status,body:t};}
}

async function boot(opts={}){
  const me=await api('/api/auth/me/fe-permissions');
  if(me.status!==200) throw new Error('SESSION DEAD '+me.status+' '+JSON.stringify(me.body).slice(0,140));
  const browser=await chromium.launch({args:['--no-sandbox','--ignore-certificate-errors','--disable-web-security','--disable-dev-shm-usage']});
  const ctx=await browser.newContext({viewport:opts.viewport||{width:1680,height:1080},ignoreHTTPSErrors:true,userAgent:UA,acceptDownloads:true});
  await ctx.addCookies(CK.split('; ').map(p=>{const i=p.indexOf('=');return{name:p.slice(0,i),value:p.slice(i+1),domain:'.qa.shopview.com',path:'/',secure:true};}));
  const apiLog=[], bridgeErrors=[];
  await ctx.route('**/*', async (route)=>{
    const req=route.request(); const url=req.url();
    if(!/qa\.shopview\.com/.test(url)) return route.abort();
    const st=isStatic(url)&&req.method()==='GET';
    const key=path.join(CACHE, crypto.createHash('sha1').update(url).digest('hex'));
    if(st && fs.existsSync(key+'.bin')){
      const h=JSON.parse(fs.readFileSync(key+'.hdr','utf8'));
      return route.fulfill({status:h.s,headers:h.h,body:fs.readFileSync(key+'.bin')});
    }
    try{
      const hdrs=Object.assign({},req.headers()); delete hdrs['host']; delete hdrs['content-length'];
      hdrs['cookie']=CK; hdrs['user-agent']=UA;
      const pd=req.postDataBuffer();
      const r=await fetch(url,{method:req.method(),headers:hdrs,body:pd||undefined,redirect:'manual'});
      const buf=Buffer.from(await r.arrayBuffer());
      const h={}; r.headers.forEach((v,k)=>{ if(!['content-encoding','content-length','transfer-encoding','set-cookie'].includes(k)) h[k]=v; });
      h['access-control-allow-origin']='*';
      if(/\/api\//.test(url)) apiLog.push({m:req.method(),u:url.replace(API,''),s:r.status});
      if(st){ fs.writeFileSync(key+'.bin',buf); fs.writeFileSync(key+'.hdr',JSON.stringify({s:r.status,h})); }
      await route.fulfill({status:r.status,headers:h,body:buf});
    }catch(e){
      bridgeErrors.push({m:req.method(),u:url.replace(API,'').replace(APP,''),e:String(e).slice(0,120)});
      try{ await route.fulfill({status:599,headers:{'content-type':'application/json','access-control-allow-origin':'*'},body:'{"bridge":"fetch threw"}'}); }catch(_){}
    }
  });
  const seed=JSON.parse(fs.readFileSync('/tmp/seed.json','utf8'));
  await ctx.addInitScript(sd=>{try{
    localStorage.setItem('user',JSON.stringify(sd.user));
    localStorage.setItem('fe_permissions_wrapper',JSON.stringify(sd.fp));
    localStorage.setItem('token',sd.user.data.token);
    localStorage.setItem('bookkeeping_enabled','false');
    localStorage.setItem('location',sd.wp.id);
    localStorage.setItem('timezone',sd.wp.tz);
    localStorage.setItem('country_code',sd.wp.cc);
    localStorage.setItem('current_shop_id',sd.wp.shop);
  }catch(e){}}, seed);
  const page=await ctx.newPage();
  await page.goto(APP+'/',{waitUntil:'domcontentloaded',timeout:120000});
  await page.waitForTimeout(3000);
  return {browser,ctx,page,APP,API,CK,api,apiLog,bridgeErrors};
}

// ---- the label reader. RENDERED = what the tester actually reads on screen. ----
// textContent  = the string as shipped in the markup
// innerText    = Chromium applies text-transform, so this is the rendered form
// tt           = the computed text-transform, recorded so the difference is explainable
const RENDERED=`
function __lab(e){
  if(!e) return null;
  const cs=getComputedStyle(e);
  const tc=(e.textContent||'').replace(/\\s+/g,' ').trim();
  const it=(e.innerText||'').replace(/\\s+/g,' ').trim();
  return {tc, it, tt:cs.textTransform, vis:cs.visibility!=='hidden'&&cs.display!=='none'};
}
function __labs(sel,root){
  return [...(root||document).querySelectorAll(sel)].map(e=>{
    const l=__lab(e);
    return Object.assign(l,{tid:e.getAttribute('data-test-id'),aria:e.getAttribute('aria-label')});
  }).filter(x=>x.tc||x.tid);
}
`;
module.exports={boot,APP,API,CK,api,UA,RENDERED};
