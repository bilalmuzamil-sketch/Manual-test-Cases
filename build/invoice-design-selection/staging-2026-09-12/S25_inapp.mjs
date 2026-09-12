// C53567 step 2 -- the contrast: the paid banner must NOT appear on the IN-APP preview of the same
// invoice, nor on an estimate. Positive control in the same pass: the portal PDF of that same
// invoice, which DOES carry it (S24). Guarded readings; the setting is restored.
import pkg from '/opt/node22/lib/node_modules/playwright/index.js';
const { chromium } = pkg; import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/invoice-design-selection/staging-2026-09-12';
const EV=`${DIR}/evidence`;
const APP='https://app.staging.shopview.com', APIH='api.staging.shopview.com';
const PORTAL='https://staging.portal.shopview.com';
const PAID_INV='7d7cc1da-6fb2-49de-ac23-eb0604128653', PAY=145;
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));
const R={discards:[]}; const save=()=>fs.writeFileSync(`${EV}/S25.json`, JSON.stringify(R,null,1));
const port=fs.readFileSync('/tmp/atlassian/bridge-port.txt','utf8').trim();
const C=JSON.parse(fs.readFileSync('/tmp/qa-cookies/staging-full.json','utf8'));
const browser=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args:[`--proxy-server=http://127.0.0.1:${port}`,'--ignore-certificate-errors','--no-sandbox']});
const ctx=await browser.newContext({ignoreHTTPSErrors:true, viewport:{width:1700,height:1200}});
for (const h of ['app.staging.shopview.com',APIH,'staging.portal.shopview.com'])
  await ctx.addCookies([{name:'sv_sso_session',value:C.sv_sso_session,domain:h,path:'/',secure:true},
                        {name:'PHPSESSID',value:C.PHPSESSID,domain:h,path:'/',secure:true}]);
await ctx.addCookies([{name:'cf_clearance',value:C.cf_clearance,domain:'.shopview.com',path:'/',secure:true}]);
const shop=await ctx.newPage();
await shop.goto(`${APP}/`,{waitUntil:'domcontentloaded',timeout:90000}).catch(()=>{});
await shop.waitForTimeout(6000);
const api=(m,path,body)=>shop.evaluate(async({a,m,path,body})=>{const r=await fetch(`https://${a}${path}`,{method:m,
  credentials:'include',headers:{'Content-Type':'application/json',Accept:'application/json'},
  body:body?JSON.stringify(body):undefined}); return {s:r.status,t:await r.text()};},{a:APIH,m,path,body:body||null});
const stored=async()=>{const r=await api('GET','/api/organizations/invoice-settings/view');
  try{return JSON.parse(r.t).data.documentDesign;}catch(e){return null;}};
R.found=await stored(); log('design as found: %s', R.found);
const tok=JSON.parse((await api('POST','/api/token')).t).data.accessToken;
await shop.evaluate(async({P,tok})=>{await fetch(`${P}/sso-login`,{method:'POST',credentials:'include',
  headers:{'Content-Type':'application/json',Accept:'application/json',Authorization:`Bearer ${tok}`},
  body:JSON.stringify({returnJson:true,portalType:'customer'})});},{P:PORTAL,tok});
const pp=await ctx.newPage();
// which work order does the paid invoice belong to?
await pp.goto(`${PORTAL}/invoices/${PAID_INV}`,{waitUntil:'networkidle',timeout:90000}); await pp.waitForTimeout(9000);
const meta=await pp.evaluate(()=>{const j=JSON.parse(document.querySelector('script[data-page]').textContent);
  const i=j.props.invoice||{}; return {num:i.invoiceNumber, wo:i.workOrder, cust:i.customer};});
R.subject=meta; log('subject invoice %s | work order %s', meta.num, JSON.stringify(meta.wo).slice(0,150));
const WO=meta.wo && (meta.wo.id||meta.wo.uuid);
// POSITIVE CONTROL, same pass: the portal PDF page of this invoice DOES carry the banner
const before=await stored();
await pp.goto(`${PORTAL}/invoices/${PAID_INV}/preview?include_receipt=1&payment_id=${PAY}`,{waitUntil:'domcontentloaded',timeout:90000});
await pp.waitForTimeout(10000);
R.positiveControl=await pp.evaluate(()=>({banner:!!document.querySelector('#portal-paid-invoice-summary'),
  pill:((document.body.innerText||'').match(/PAID IN FULL|PARTIALLY PAID/)||[])[0]||null}));
log('POSITIVE CONTROL (portal, with receipt): %s', JSON.stringify(R.positiveControl));
// the IN-APP finance tab for the same work order
const look=async(url, tag, waitMs=14000)=>{
  await shop.goto(url,{waitUntil:'domcontentloaded',timeout:90000}).catch(()=>{});
  await shop.waitForTimeout(waitMs);
  const r=await shop.evaluate(()=>{
    const all=[document, ...[...document.querySelectorAll('iframe')].map(f=>{try{return f.contentDocument;}catch(e){return null;}}).filter(Boolean)];
    let banner=false, pill=null, txt='';
    for(const d of all){ if(d.querySelector('#portal-paid-invoice-summary')) banner=true;
      const t=(d.body&&d.body.innerText||''); txt+=' '+t;
      const m=t.match(/PAID IN FULL|PARTIALLY PAID/); if(m&&!pill) pill=m[0]; }
    const f=txt.replace(/\s+/g,' ');
    return {banner, pill, frames:all.length, len:f.length,
      caps:/BILL TO|REMIT PAYMENT TO|SUMMARY|ADDRESSES|SCOPE OF WORK/.test(f),
      docNo:(f.match(/\bINV-[A-Z0-9-]+/)||[])[0]||null, head:f.slice(0,180)};});
  await shop.screenshot({path:`${EV}/S25-${tag}.png`, fullPage:true});
  return r;
};
if(WO){ R.inAppFinance=await look(`${APP}/workorders/${WO}/finance`, 'inapp-finance');
  log('IN-APP finance tab: banner=%s pill=%s docNo=%s frames=%d | %s',
    R.inAppFinance.banner, R.inAppFinance.pill, R.inAppFinance.docNo, R.inAppFinance.frames, R.inAppFinance.head.slice(0,110)); }
else log('no work order id on the invoice props');
const after=await stored();
if(before!==after){ R.discards.push({label:'in-app', before, after}); log('!! setting drifted %s->%s', before, after); }
R.endDesign=after; log('design at end: %s | discards %d', after, R.discards.length);
save(); log('done'); await browser.close(); process.exit(0);
