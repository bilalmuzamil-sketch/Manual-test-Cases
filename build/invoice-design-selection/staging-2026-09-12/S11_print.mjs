// Find the portal print/download control, capture the PDF AND its filename.
import pkg from '/opt/node22/lib/node_modules/playwright/index.js';
const { chromium } = pkg; import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/invoice-design-selection/staging-2026-09-12';
const APP='https://app.staging.shopview.com', APIH='api.staging.shopview.com';
const PORTAL='https://staging.portal.shopview.com';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));
const R={}; const save=()=>fs.writeFileSync(`${DIR}/evidence/S11.json`, JSON.stringify(R,null,1));
const port=fs.readFileSync('/tmp/atlassian/bridge-port.txt','utf8').trim();
const C=JSON.parse(fs.readFileSync('/tmp/qa-cookies/staging-full.json','utf8'));
const browser=await chromium.launch({executablePath:process.env.CHROME_BIN||'/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args:[`--proxy-server=http://127.0.0.1:${port}`,'--ignore-certificate-errors','--no-sandbox']});
const ctx=await browser.newContext({ignoreHTTPSErrors:true, viewport:{width:1700,height:1200}, acceptDownloads:true});
for (const h of ['app.staging.shopview.com',APIH,'staging.portal.shopview.com'])
  await ctx.addCookies([{name:'sv_sso_session',value:C.sv_sso_session,domain:h,path:'/',secure:true},
                        {name:'PHPSESSID',value:C.PHPSESSID,domain:h,path:'/',secure:true}]);
await ctx.addCookies([{name:'cf_clearance',value:C.cf_clearance,domain:'.shopview.com',path:'/',secure:true}]);
const VIS=`(e)=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);
  return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden'&&parseFloat(c.opacity)>0.01;}`;
const shop=await ctx.newPage();
await shop.goto(`${APP}/`,{waitUntil:'domcontentloaded',timeout:90000}).catch(()=>{});
await shop.waitForTimeout(6000);
const api=(m,path,body)=>shop.evaluate(async({a,m,path,body})=>{const r=await fetch(`https://${a}${path}`,{method:m,
  credentials:'include',headers:{'Content-Type':'application/json',Accept:'application/json'},
  body:body?JSON.stringify(body):undefined}); return {s:r.status,t:await r.text()};},{a:APIH,m,path,body:body||null});
const tok=JSON.parse((await api('POST','/api/token')).t).data.accessToken;
await shop.evaluate(async({P,tok})=>{await fetch(`${P}/sso-login`,{method:'POST',credentials:'include',
  headers:{'Content-Type':'application/json',Accept:'application/json',Authorization:`Bearer ${tok}`},
  body:JSON.stringify({returnJson:true,portalType:'customer'})});},{P:PORTAL,tok});
const pp=await ctx.newPage();
const dls=[]; pp.on('download', d=>dls.push(d));
await pp.goto(`${PORTAL}/invoices`,{waitUntil:'domcontentloaded',timeout:90000});
await pp.waitForTimeout(12000);
// 1. what does the LIST row offer?
R.listRow=await pp.evaluate(()=>{
  const row=[...document.querySelectorAll('tbody tr')][0]; if(!row) return null;
  const vis=e=>{const r=e.getBoundingClientRect(); return r.width>0&&r.height>0;};
  return {text:(row.innerText||'').replace(/\s+/g,' ').slice(0,140),
    controls:[...row.querySelectorAll('button,a,[role=button]')].filter(vis)
      .map(e=>((e.getAttribute('aria-label')||e.getAttribute('title')||'')+'|'+(e.textContent||'').trim()).slice(0,50))};});
log('first list row: %s', JSON.stringify(R.listRow).slice(0,400));
// open the first PAID invoice's own page
const paidId=await pp.evaluate(()=>{const j=JSON.parse(document.querySelector('script[data-page]').textContent);
  const l=j.props.invoices.data||j.props.invoices; const p=l.find(x=>x.status==='paid'); return p?p.id:null;});
R.paidId=paidId; log('paid invoice id: %s', paidId);
await pp.goto(`${PORTAL}/invoices/${paidId}`,{waitUntil:'domcontentloaded',timeout:90000});
await pp.waitForTimeout(12000);
R.invoicePage={url:pp.url(),
  controls:await pp.evaluate(vis=>{const isVis=eval(vis);
    return [...document.querySelectorAll('button,a,[role=button]')].filter(isVis)
      .map(e=>((e.getAttribute('aria-label')||e.getAttribute('title')||'')+'|'+(e.innerText||'').replace(/\s+/g,' ').trim()).slice(0,60))
      .filter(x=>x!=='|').slice(0,30);},VIS),
  text:await pp.evaluate(()=>(document.body.innerText||'').replace(/\s+/g,' ').slice(0,400))};
log('invoice page url: %s', R.invoicePage.url);
log('controls: %s', JSON.stringify(R.invoicePage.controls));
await pp.screenshot({path:`${DIR}/evidence/S11-invoice-page.png`, fullPage:true});
save();
// 2. click the print/download control and capture the download
const clicked=await pp.evaluate(vis=>{const isVis=eval(vis);
  const t=e=>((e.getAttribute('aria-label')||'')+' '+(e.getAttribute('title')||'')+' '+(e.innerText||'')).toLowerCase();
  const cands=[...document.querySelectorAll('button,a,[role=button]')].filter(isVis);
  const b=cands.find(e=>/print|download|pdf/.test(t(e)));
  if(b){b.click(); return ((b.getAttribute('aria-label')||b.getAttribute('title')||b.innerText||'?')).trim().slice(0,40);} 
  return null;},VIS);
await pp.waitForTimeout(6000);
R.afterClick={clicked, menu:await pp.evaluate(vis=>{const isVis=eval(vis);
  const m=[...document.querySelectorAll('[role=menu],[role=menuitem],ul li')].filter(isVis)
    .map(e=>(e.innerText||'').replace(/\s+/g,' ').trim()).filter(x=>x&&x.length<60);
  return [...new Set(m)].slice(0,12);},VIS)};
log('print control clicked: %s | menu: %s', clicked, JSON.stringify(R.afterClick.menu));
await pp.screenshot({path:`${DIR}/evidence/S11-print-menu.png`, fullPage:true});
// pick the print-with-receipt option if present
const opt=await pp.evaluate(vis=>{const isVis=eval(vis);const t=e=>(e.innerText||'').replace(/\s+/g,' ').trim();
  const o=[...document.querySelectorAll('[role=menuitem],li,button,a')].filter(isVis).find(e=>/print with payment receipt|payment receipt/i.test(t(e)));
  if(o){o.click(); return t(o);} return null;},VIS);
await pp.waitForTimeout(10000);
R.chose=opt; log('chose: %s', opt);
R.downloads=[]; 
for(const d of dls){ const fn=d.suggestedFilename(); const path=`${DIR}/evidence/S11-${fn}`;
  try{ await d.saveAs(path); R.downloads.push({filename:fn, saved:path, bytes:fs.statSync(path).size}); }
  catch(e){ R.downloads.push({filename:fn, error:String(e).slice(0,90)}); } }
log('DOWNLOADS: %s', JSON.stringify(R.downloads));
R.pagesNow=ctx.pages().map(x=>x.url()).slice(-3);
log('pages now: %s', JSON.stringify(R.pagesNow));
await pp.screenshot({path:`${DIR}/evidence/S11-after.png`, fullPage:true});
save(); log('done'); await browser.close(); process.exit(0);
