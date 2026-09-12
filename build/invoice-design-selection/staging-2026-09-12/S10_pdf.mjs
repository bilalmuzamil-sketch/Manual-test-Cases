// The portal PDF via the print icon — C53566's download half and C53567's paid banner.
import pkg from '/opt/node22/lib/node_modules/playwright/index.js';
const { chromium } = pkg; import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/invoice-design-selection/staging-2026-09-12';
const APP='https://app.staging.shopview.com', APIH='api.staging.shopview.com';
const PORTAL='https://staging.portal.shopview.com';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));
const R={}; const save=()=>fs.writeFileSync(`${DIR}/evidence/S10.json`, JSON.stringify(R,null,1));
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
const stored=async()=>{try{return JSON.parse((await api('GET','/api/organizations/invoice-settings/view')).t).data.documentDesign;}catch(e){return null;}};
const setDesign=async(w)=>{ if((await stored())===w) return w;
  await api('POST','/api/organizations/invoice-settings/change-design',{documentDesign:w});
  await shop.waitForTimeout(1200); return await stored();};
const tok=JSON.parse((await api('POST','/api/token')).t).data.accessToken;
await shop.evaluate(async({P,tok})=>{await fetch(`${P}/sso-login`,{method:'POST',credentials:'include',
  headers:{'Content-Type':'application/json',Accept:'application/json',Authorization:`Bearer ${tok}`},
  body:JSON.stringify({returnJson:true,portalType:'customer'})});},{P:PORTAL,tok});
const pp=await ctx.newPage();
await pp.goto(`${PORTAL}/invoices`,{waitUntil:'domcontentloaded',timeout:90000});
await pp.waitForTimeout(11000);
const invs=await pp.evaluate(()=>{const j=JSON.parse(document.querySelector('script[data-page]').textContent);
  const l=j.props.invoices.data||j.props.invoices; return l.map(x=>({id:x.id,st:x.status}));});
const PAID=invs.find(x=>x.st==='paid');
R.paid=PAID; log('paid invoice: %s', JSON.stringify(PAID));
R.found=await stored(); log('design as found: %s', R.found);
save();
// open the invoice page and find the print control
await pp.goto(`${PORTAL}/invoices/${PAID.id}/preview`,{waitUntil:'domcontentloaded',timeout:90000});
await pp.waitForTimeout(11000);
R.controls=await pp.evaluate(vis=>{const isVis=eval(vis);
  return [...document.querySelectorAll('button,a,[role=button]')].filter(isVis)
    .map(e=>((e.getAttribute('aria-label')||'')+'|'+(e.innerText||'').replace(/\s+/g,' ').trim()+'|'+(e.className||'').slice(0,40)).slice(0,90))
    .filter(x=>x!=='||').slice(0,30);},VIS);
log('controls on the portal invoice page:'); for(const c of R.controls) log('   ', c);
await pp.screenshot({path:`${DIR}/evidence/S10-invoice-page.png`, fullPage:true});
// click anything that looks like print
const printed=await pp.evaluate(vis=>{const isVis=eval(vis);const t=e=>((e.getAttribute('aria-label')||'')+' '+(e.innerText||'')).toLowerCase();
  const b=[...document.querySelectorAll('button,a,[role=button]')].filter(isVis).find(e=>/print|download/.test(t(e))||/print/i.test(e.innerHTML));
  if(b){b.click(); return (b.getAttribute('aria-label')||b.innerText||'print icon').trim().slice(0,40);} return null;},VIS);
await pp.waitForTimeout(4000);
R.printMenu=await pp.evaluate(vis=>{const isVis=eval(vis);
  const m=[...document.querySelectorAll('[role=menu],.dropdown,ul,div')].filter(isVis)
    .filter(e=>/print/i.test(e.innerText||'')&&(e.innerText||'').length<200);
  return m.length?m[m.length-1].innerText.replace(/\s+/g,' ').trim():null;},VIS);
log('print clicked: %s | menu: %s', printed, R.printMenu);
await pp.screenshot({path:`${DIR}/evidence/S10-print-menu.png`, fullPage:true});
save(); log('done'); await browser.close(); process.exit(0);
