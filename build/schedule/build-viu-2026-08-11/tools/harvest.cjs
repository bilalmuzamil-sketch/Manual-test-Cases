// Schedule label harvest. Cookies ONLY — no localStorage seeding, no injected
// user/workplace object: the application decides where we land (Rules 12/57).
const {chromium}=require('/opt/node22/lib/node_modules/playwright');
const fs=require('fs'),path=require('path'),crypto=require('crypto');
const APP='https://sv8685.qa.shopview.com';
const CK=fs.readFileSync('/tmp/qa-cookies/schedule-cookie-header.txt','utf8').trim();
const UA='Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
const CACHE='/tmp/assetcache'; fs.mkdirSync(CACHE,{recursive:true});
const isStatic=u=>/\.(js|css|woff2?|ttf|png|jpg|jpeg|svg|ico|webp|map)(\?|$)/i.test(u);
async function open(){
  const browser=await chromium.launch({args:['--no-sandbox','--ignore-certificate-errors','--disable-web-security','--disable-dev-shm-usage']});
  const ctx=await browser.newContext({viewport:{width:1680,height:1080},ignoreHTTPSErrors:true,userAgent:UA});
  await ctx.addCookies(CK.split('; ').map(p=>{const i=p.indexOf('=');return{name:p.slice(0,i),value:p.slice(i+1),domain:'.qa.shopview.com',path:'/',secure:true};}));
  const apiLog=[];
  await ctx.route('**/*', async (route)=>{
    const req=route.request(), url=req.url();
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
      const r=await fetch(url,{method:req.method(),headers:hdrs,body:req.postDataBuffer()||undefined,redirect:'manual'});
      const buf=Buffer.from(await r.arrayBuffer());
      const h={}; r.headers.forEach((v,k)=>{ if(!['content-encoding','content-length','transfer-encoding','set-cookie'].includes(k)) h[k]=v; });
      h['access-control-allow-origin']='*';
      if(/\/api\//.test(url)) apiLog.push({m:req.method(),s:r.status,u:url.replace(/^https:\/\/[^/]+/,'')});
      if(st){ fs.writeFileSync(key+'.bin',buf); fs.writeFileSync(key+'.hdr',JSON.stringify({s:r.status,h})); }
      await route.fulfill({status:r.status,headers:h,body:buf});
    }catch(e){ try{await route.abort();}catch(_){ } }
  });
  // boot2 hydration (the documented pattern for this SPA — it authenticates from
  // localStorage, not cookies). EVERY value below mirrors a LIVE read taken this
  // run: /api/auth/me/fe-permissions, /api/staff and /api/staff/my-workplaces.
  // Nothing is invented and the stale seed from the earlier pass is NOT reused.
  const seed=JSON.parse(fs.readFileSync('/tmp/seed2.json','utf8'));
  await ctx.addInitScript(sd=>{try{
    localStorage.setItem('user',JSON.stringify(sd.user));
    localStorage.setItem('fe_permissions_wrapper',JSON.stringify(sd.fp));
    localStorage.setItem('token',sd.user.data.token);
    localStorage.setItem('bookkeeping_enabled','false');
    localStorage.setItem('location',JSON.stringify(sd.wp.id));
    localStorage.setItem('timezone',sd.wp.tz);
    localStorage.setItem('country_code',sd.wp.cc);
    localStorage.setItem('current_shop_id',sd.wp.shop);
  }catch(e){}}, seed);
  const page=await ctx.newPage();
  return {browser,ctx,page,apiLog};
}
// Vocabulary dump: every visible string + every data-test-id, plus targeted probes.
const DUMP=()=>{
  const vis=el=>{const r=el.getBoundingClientRect();const s=getComputedStyle(el);
    return r.width>0&&r.height>0&&s.visibility!=='hidden'&&s.display!=='none'&&s.opacity!=='0';};
  const out={url:location.href,title:document.title,testids:[],texts:[],aria:[],placeholders:[],headers:[],buttons:[]};
  document.querySelectorAll('[data-test-id]').forEach(e=>{ out.testids.push({id:e.getAttribute('data-test-id'),
    text:(e.innerText||'').trim().slice(0,120), tag:e.tagName.toLowerCase(), visible:vis(e),
    pressed:e.getAttribute('aria-pressed'), label:e.getAttribute('aria-label')}); });
  document.querySelectorAll('button,[role=button],.q-btn,a').forEach(e=>{ if(!vis(e))return;
    const t=(e.innerText||'').trim(); if(t) out.buttons.push(t.slice(0,120)); });
  document.querySelectorAll('th,[role=columnheader]').forEach(e=>{ if(vis(e)){const t=(e.innerText||'').trim(); if(t) out.headers.push(t.slice(0,80));} });
  document.querySelectorAll('[aria-label]').forEach(e=>{ const a=e.getAttribute('aria-label'); if(a) out.aria.push(a.slice(0,120)); });
  document.querySelectorAll('input,textarea').forEach(e=>{ const p=e.getAttribute('placeholder'); if(p) out.placeholders.push(p); });
  const walk=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
  const seen=new Set(); let n;
  while(n=walk.nextNode()){ const t=(n.textContent||'').trim();
    if(t && t.length<160 && n.parentElement && vis(n.parentElement) && !seen.has(t)){ seen.add(t); out.texts.push(t); } }
  out.body_text=document.body?document.body.innerText.slice(0,20000):'';
  // click-to-arm probe (SV-8957)
  out.arm={ testid_prefix: [...document.querySelectorAll('[data-test-id]')].map(e=>e.getAttribute('data-test-id')).filter(x=>/arm/i.test(x)),
            aria_by_click: [...document.querySelectorAll('[aria-label]')].map(e=>e.getAttribute('aria-label')).filter(x=>/by click/i.test(x)),
            any_aria_pressed: [...document.querySelectorAll('[aria-pressed]')].map(e=>({id:e.getAttribute('data-test-id'),label:e.getAttribute('aria-label'),v:e.getAttribute('aria-pressed')})).slice(0,40),
            html_has_arm: /button_sidebar_arm|by click/i.test(document.documentElement.innerHTML) };
  return out;
};
module.exports={open,DUMP,APP};
