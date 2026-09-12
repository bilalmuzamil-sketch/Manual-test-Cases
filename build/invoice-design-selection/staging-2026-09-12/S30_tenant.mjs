// SV-9973 / SV-9974 "Note for dev": is "Bravo Mechanical Services" a hardcoded placeholder, or a
// real record read from the wrong place? Read the portal's own props.tenant and compare it with the
// organisation and workplace the invoice actually belongs to. READ ONLY -- nothing is written.
import pkg from '/opt/node22/lib/node_modules/playwright/index.js';
const { chromium } = pkg; import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/invoice-design-selection/staging-2026-09-12/evidence';
const APP='https://app.staging.shopview.com', APIH='api.staging.shopview.com';
const PORTAL='https://staging.portal.shopview.com';
const INV='21c5d7e5-f42d-4398-bd25-cf40c7650bb7';           // S-32981, the invoice on both tickets
const L=(...a)=>console.log(new Date().toISOString().slice(11,19),a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));
const R={readOnly:true}; const save=()=>fs.writeFileSync(`${EV}/S30.json`, JSON.stringify(R,null,1));
const port=fs.readFileSync('/tmp/atlassian/bridge-port.txt','utf8').trim();
const C=JSON.parse(fs.readFileSync('/tmp/qa-cookies/staging-full.json','utf8'));
const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args:[`--proxy-server=http://127.0.0.1:${port}`,'--ignore-certificate-errors','--no-sandbox']});
const ctx=await b.newContext({ignoreHTTPSErrors:true,viewport:{width:1700,height:1200}});
for (const h of ['app.staging.shopview.com',APIH,'staging.portal.shopview.com'])
  await ctx.addCookies([{name:'sv_sso_session',value:C.sv_sso_session,domain:h,path:'/',secure:true},
                        {name:'PHPSESSID',value:C.PHPSESSID,domain:h,path:'/',secure:true}]);
await ctx.addCookies([{name:'cf_clearance',value:C.cf_clearance,domain:'.shopview.com',path:'/',secure:true}]);
const shop=await ctx.newPage();
await shop.goto(`${APP}/`,{waitUntil:'domcontentloaded',timeout:90000}).catch(()=>{});
await shop.waitForTimeout(9000);
L('shop landed: %s', shop.url().slice(0,90));
if(!/app\.staging\.shopview\.com/.test(shop.url())){ L('not on the app origin - re-navigating'); await shop.goto(`${APP}/`,{waitUntil:'domcontentloaded',timeout:90000}).catch(()=>{}); await shop.waitForTimeout(9000); L('now: %s', shop.url().slice(0,90)); }
// the borrowed cookie authenticates the API but leaves the SPA on /login; one click on the
// DEV MODE panel completes the sign-in (learning L0064) and refreshes the session the token mint needs.
if(/\/login/.test(shop.url())){
  await shop.evaluate(()=>{const vis=e=>{const r=e.getBoundingClientRect();return r.width>0&&r.height>0;};
    const t=e=>(e.innerText||'').replace(/\s+/g,' ').trim();
    const el=[...document.querySelectorAll('button,.q-btn,[role=button],a')].filter(vis)
      .find(e=>/\bAdmin\b/.test(t(e))&&!/Panel|Settings:/.test(t(e)));
    if(el) el.click();});
  await shop.waitForTimeout(15000);
  L('after DEV sign-in: %s | user set: %s', shop.url().slice(0,80),
    await shop.evaluate(()=>{try{return !!localStorage.getItem('user');}catch(e){return false;}}));
}
const api=(p)=>shop.evaluate(async({a,p})=>{const r=await fetch(`https://${a}${p}`,{credentials:'include',headers:{Accept:'application/json'}});
  return {s:r.status,t:await r.text()};},{a:APIH,p});
const org=await api('/api/organizations/view');
try{ const d=JSON.parse(org.t).data||{}; R.organization={name:d.name,id:d.id,legalName:d.legalName||d.legal_name||null}; }
catch(e){ R.organization={status:org.s, body:org.t.slice(0,160)}; }
L('SHOP APP organisation: %s', JSON.stringify(R.organization));
L('org raw: %s %s', org.s, org.t.slice(0,300));
const tk=await shop.evaluate(async(a)=>{const r=await fetch(`https://${a}/api/token`,{method:'POST',credentials:'include',
  headers:{'Content-Type':'application/json',Accept:'application/json'}}); return await r.text();},APIH);
L('token raw: %s', tk.slice(0,220));
const accessToken=JSON.parse(tk).data.accessToken;
await shop.evaluate(async({P,tok})=>{await fetch(`${P}/sso-login`,{method:'POST',credentials:'include',
  headers:{'Content-Type':'application/json',Accept:'application/json',Authorization:`Bearer ${tok}`},
  body:JSON.stringify({returnJson:true,portalType:'customer'})});},{P:PORTAL,tok:accessToken});
const pp=await ctx.newPage();
await pp.goto(`${PORTAL}/invoices/${INV}/preview`,{waitUntil:'domcontentloaded',timeout:90000});
await pp.waitForTimeout(10000);
const d=await pp.evaluate(()=>{const j=JSON.parse(document.querySelector('script[data-page]').textContent);
  const p=j.props; return {title:document.title, tenant:p.tenant,
    invoiceOrg:(p.invoice&&p.invoice.organization)||null, invoiceWorkplace:(p.invoice&&p.invoice.workplace)||null,
    invoiceNumber:p.invoice&&p.invoice.invoiceNumber,
    workplaces:(p.portal&&p.portal.workplaces)||null};});
R.portal=d;
L('PORTAL page title  : %s', d.title);
L('PORTAL props.tenant: %s', JSON.stringify(d.tenant));
L('invoice organisation: %s', JSON.stringify(d.invoiceOrg));
L('invoice workplace   : %s', JSON.stringify(d.invoiceWorkplace));
L('portal workplaces   : %s', JSON.stringify(d.workplaces).slice(0,400));
R.verdict = {
  tenantName: d.tenant && d.tenant.name,
  tenantLooksLikeARealRecord: !!(d.tenant && (d.tenant.id || d.tenant.address1 || d.tenant.city || d.tenant.tax_code)),
  tenantFields: d.tenant ? Object.keys(d.tenant) : null,
  matchesInvoiceOrg: !!(d.tenant && d.invoiceOrg && d.tenant.name===(d.invoiceOrg.name||d.invoiceOrg)),
};
L('VERDICT: %s', JSON.stringify(R.verdict));
// the header the letterhead shows, read off the rendered document
R.letterhead=await pp.evaluate(()=>((document.body.innerText||'').replace(/\s+/g,' ').match(/^(.{0,90})/)||[])[1]);
L('letterhead starts: %s', R.letterhead);
await pp.screenshot({path:`${EV}/S30-portal-preview-title.png`, fullPage:false});
save(); L('done'); await b.close(); process.exit(0);
