// READ ONLY. Confirm the three tests are runnable: a paid invoice renders, the paid-banner route
// works, and whether a standalone payment receipt already exists.
import pkg from '/opt/node22/lib/node_modules/playwright/index.js';
const { chromium } = pkg; import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/invoice-design-selection/staging-2026-09-12';
const APP='https://app.staging.shopview.com', APIH='api.staging.shopview.com';
const PORTAL='https://staging.portal.shopview.com';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));
const R={readOnly:true}; const save=()=>fs.writeFileSync(`${DIR}/evidence/S7.json`, JSON.stringify(R,null,1));
const port=fs.readFileSync('/tmp/atlassian/bridge-port.txt','utf8').trim();
const C=JSON.parse(fs.readFileSync('/tmp/qa-cookies/staging-full.json','utf8'));
const browser=await chromium.launch({executablePath:process.env.CHROME_BIN||'/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args:[`--proxy-server=http://127.0.0.1:${port}`,'--ignore-certificate-errors','--no-sandbox']});
const ctx=await browser.newContext({ignoreHTTPSErrors:true, viewport:{width:1700,height:1150}});
for (const host of ['app.staging.shopview.com', APIH, 'staging.portal.shopview.com'])
  await ctx.addCookies([{name:'sv_sso_session',value:C.sv_sso_session,domain:host,path:'/',secure:true},
                        {name:'PHPSESSID',value:C.PHPSESSID,domain:host,path:'/',secure:true}]);
await ctx.addCookies([{name:'cf_clearance',value:C.cf_clearance,domain:'.shopview.com',path:'/',secure:true}]);
const p=await ctx.newPage();
await p.goto(`${APP}/`,{waitUntil:'domcontentloaded',timeout:90000}).catch(()=>{});
await p.waitForTimeout(6000);
const tokRes=await p.evaluate(async(a)=>{const r=await fetch(`https://${a}/api/token`,{method:'POST',credentials:'include',
  headers:{'Content-Type':'application/json',Accept:'application/json'}}); return await r.text();},APIH);
const tok=JSON.parse(tokRes).data.accessToken;
await p.evaluate(async({P,tok})=>{await fetch(`${P}/sso-login`,{method:'POST',credentials:'include',
  headers:{'Content-Type':'application/json',Accept:'application/json',Authorization:`Bearer ${tok}`},
  body:JSON.stringify({returnJson:true,portalType:'customer'})});},{P:PORTAL,tok});
const pp=await ctx.newPage();
await pp.goto(`${PORTAL}/invoices`,{waitUntil:'domcontentloaded',timeout:90000});
await pp.waitForTimeout(11000);
const data=await pp.evaluate(()=>{const el=document.querySelector('script[data-page]');
  const j=JSON.parse(el.textContent); const inv=j.props.invoices.data||j.props.invoices;
  return inv.map(x=>({id:x.id,num:x.invoice_number||x.number,st:x.status,bal:x.balance||x.total_balance}));});
R.invoices=data;
const paid=data.filter(x=>x.st==='paid');
log('portal invoices: %d | paid: %d', data.length, paid.length);
log('  paid examples: %s', JSON.stringify(paid.slice(0,4)));
R.paid=paid.slice(0,4); save();
// 1. can we render a paid invoice's portal preview? (read only)
if(paid.length){
  const inv=paid[0];
  const prev=await pp.evaluate(async({P,id})=>{const r=await fetch(`${P}/invoices/${id}/preview`,{credentials:'include'});
    const t=await r.text(); return {s:r.status, len:t.length, hasHtmlContent:/htmlContent/.test(t)};},{P:PORTAL,id:inv.id});
  R.preview=prev; log('portal preview of a paid invoice (%s): %s, %d bytes, carries document html: %s',
    inv.num||inv.id.slice(0,8), prev.s, prev.len, prev.hasHtmlContent);
  const banner=await pp.evaluate(async({P,id})=>{const r=await fetch(`${P}/invoices/${id}/preview?include_receipt=1`,{credentials:'include'});
    const t=await r.text(); return {s:r.status, len:t.length};},{P:PORTAL,id:inv.id});
  R.bannerRoute=banner; log('paid-banner route (include_receipt=1): %s, %d bytes', banner.s, banner.len);
}
save();
// 2. is there a standalone Payment Receipt already?
await pp.goto(`${PORTAL}/payments`,{waitUntil:'domcontentloaded',timeout:90000}).catch(()=>{});
await pp.waitForTimeout(10000);
R.payments=await pp.evaluate(()=>{const el=document.querySelector('script[data-page]'); if(!el) return null;
  try{const j=JSON.parse(el.textContent); const pr=j.props||{};
    const list=pr.payments&&(pr.payments.data||pr.payments);
    return {component:j.component, count:Array.isArray(list)?list.length:null,
      rows:Array.isArray(list)?list.slice(0,6).map(x=>({id:x.id,amt:x.amount,date:x.created_at||x.payment_date,st:x.status})):null};
  }catch(e){return {error:String(e).slice(0,120)};}});
log('portal payments page: %s', JSON.stringify(R.payments).slice(0,500));
await pp.screenshot({path:`${DIR}/evidence/S7-payments.png`, fullPage:true});
save(); log('done — nothing changed'); await browser.close(); process.exit(0);
