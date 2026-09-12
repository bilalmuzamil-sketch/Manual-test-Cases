// C53566, C53567, C53569 on staging. Every reading is guarded: the stored setting is read
// immediately before and after, and any reading that drifts is DISCARDED.
// The paid banner is drawn CLIENT-SIDE, so every capture is done in a rendered page, never a fetch.
import pkg from '/opt/node22/lib/node_modules/playwright/index.js';
const { chromium } = pkg; import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/invoice-design-selection/staging-2026-09-12';
const APP='https://app.staging.shopview.com', APIH='api.staging.shopview.com';
const PORTAL='https://staging.portal.shopview.com';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));
const R={discards:[],runs:{}}; const save=()=>fs.writeFileSync(`${DIR}/evidence/S9.json`, JSON.stringify(R,null,1));
const port=fs.readFileSync('/tmp/atlassian/bridge-port.txt','utf8').trim();
const C=JSON.parse(fs.readFileSync('/tmp/qa-cookies/staging-full.json','utf8'));
const browser=await chromium.launch({executablePath:process.env.CHROME_BIN||'/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
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
const setDesign=async(w)=>{ if((await stored())===w) return w;
  await api('POST','/api/organizations/invoice-settings/change-design',{documentDesign:w});
  await shop.waitForTimeout(1200); return await stored(); };
// portal session
const tok=JSON.parse((await api('POST','/api/token')).t).data.accessToken;
await shop.evaluate(async({P,tok})=>{await fetch(`${P}/sso-login`,{method:'POST',credentials:'include',
  headers:{'Content-Type':'application/json',Accept:'application/json',Authorization:`Bearer ${tok}`},
  body:JSON.stringify({returnJson:true,portalType:'customer'})});},{P:PORTAL,tok});
const pp=await ctx.newPage();
await pp.goto(`${PORTAL}/invoices`,{waitUntil:'domcontentloaded',timeout:90000});
await pp.waitForTimeout(11000);
const invs=await pp.evaluate(()=>{const j=JSON.parse(document.querySelector('script[data-page]').textContent);
  const l=j.props.invoices.data||j.props.invoices;
  return l.map(x=>({id:x.id,num:x.invoice_number||x.number,st:x.status}));});
const PAID=invs.find(x=>x.st==='paid'); const UNPAID=invs.find(x=>x.st!=='paid');
R.paidInvoice=PAID; R.unpaidInvoice=UNPAID;
log('paid invoice: %s | unpaid (contrast): %s', JSON.stringify(PAID), JSON.stringify(UNPAID));
// a payment for the standalone receipt
await pp.goto(`${PORTAL}/payments`,{waitUntil:'domcontentloaded',timeout:90000});
await pp.waitForTimeout(9000);
const pay=await pp.evaluate(()=>{const j=JSON.parse(document.querySelector('script[data-page]').textContent);
  const l=j.props.payments.data||j.props.payments;
  return l.slice(0,3).map(x=>({id:x.id,amt:x.amount,st:x.status,inv:x.invoice_number}));});
R.payments=pay; log('payments available: %s', JSON.stringify(pay));
const PAYID=pay[0]&&pay[0].id;
save();

// --- how a rendered portal document looks
const readDoc=async(url, waitSel)=>{
  await pp.goto(url,{waitUntil:'domcontentloaded',timeout:90000}).catch(()=>{});
  await pp.waitForTimeout(9000);
  return await pp.evaluate(()=>{
    const t=(document.body.innerText||'').replace(/\s+/g,' ');
    return {
      len:document.body.innerHTML.length, textLen:t.length,
      caps:/SCOPE OF WORK|BILL TO|REMIT PAYMENT TO|SUMMARY|ADDRESSES/.test(t),
      sentence:/Bill To|Remit payment to|Line Total/.test(t),
      money:(t.match(/\$-?[\d,]+\.\d{2}/g)||[]).sort(),
      docNo:(t.match(/\b(?:INV|EST|CM|S|P)[-0-9A-Z]{2,}\b/)||[])[0]||null,
      paidBanner: !!document.querySelector('#portal-paid-invoice-summary'),
      bannerText: (document.querySelector('#portal-paid-invoice-summary')||{}).innerText||null,
      head:t.slice(0,200) };});
};
const guarded=async(label,fn)=>{const a=await stored(); const out=await fn(); const b=await stored();
  if(a!==b){R.discards.push({label,before:a,after:b}); log('  !! DISCARDED %s (%s->%s)',label,a,b); return null;}
  return {design:a,...out};};

R.found=await stored(); log('=== design as found on staging: %s', R.found);
for(const want of ['legacy','modern']){
  const now=await setDesign(want);
  log('=== setting now: %s (asked %s)', now, want);
  if(now!==want){ log('   could not set - skipping'); continue; }
  R.runs[want]={};
  // C53566 — portal invoice on screen
  const onScreen=await guarded(`${want}-portal-onscreen`, ()=>readDoc(`${PORTAL}/invoices/${PAID.id}/preview`));
  if(onScreen){ R.runs[want].onScreen=onScreen;
    log('  [C53566] portal on screen: caps=%s sentence=%s money=%d banner=%s',
        onScreen.caps, onScreen.sentence, onScreen.money.length, onScreen.paidBanner); }
  await pp.screenshot({path:`${DIR}/evidence/S9-${want}-portal-onscreen.png`, fullPage:true});
  // C53567 — the paid banner document
  const banner=await guarded(`${want}-paid-banner`, ()=>readDoc(`${PORTAL}/invoices/${PAID.id}/preview?include_receipt=1`));
  if(banner){ R.runs[want].banner=banner;
    log('  [C53567] paid-banner doc: banner=%s caps=%s money=%d | text: %s',
        banner.paidBanner, banner.caps, banner.money.length, String(banner.bannerText||'').replace(/\s+/g,' ').slice(0,90)); }
  await pp.screenshot({path:`${DIR}/evidence/S9-${want}-paid-banner.png`, fullPage:true});
  // contrast: an UNPAID invoice must NOT carry the banner
  if(UNPAID){
    const un=await guarded(`${want}-unpaid-contrast`, ()=>readDoc(`${PORTAL}/invoices/${UNPAID.id}/preview?include_receipt=1`));
    if(un){ R.runs[want].unpaid={paidBanner:un.paidBanner, caps:un.caps};
      log('  [C53567] contrast, an UNPAID invoice: banner=%s', un.paidBanner); }
  }
  // C53569 — the standalone payment receipt
  if(PAYID){
    const rec=await guarded(`${want}-receipt`, ()=>readDoc(`${PORTAL}/payments/${PAYID}/receipt`));
    if(rec){ R.runs[want].receipt=rec;
      log('  [C53569] payment receipt: len=%d caps=%s money=%d | head: %s',
          rec.len, rec.caps, rec.money.length, rec.head.slice(0,110)); }
    await pp.screenshot({path:`${DIR}/evidence/S9-${want}-receipt.png`, fullPage:true});
  }
  save();
}
// --- verdicts
const L=R.runs.legacy||{}, M=R.runs.modern||{};
R.verdict={};
if(L.onScreen&&M.onScreen) R.verdict.c53566={legacyCaps:L.onScreen.caps, modernCaps:M.onScreen.caps,
  changed:L.onScreen.caps!==M.onScreen.caps || L.onScreen.len!==M.onScreen.len,
  moneySameSet:JSON.stringify(L.onScreen.money)===JSON.stringify(M.onScreen.money)};
if(L.banner&&M.banner) R.verdict.c53567={bannerLegacy:L.banner.paidBanner, bannerModern:M.banner.paidBanner,
  unpaidLegacy:(L.unpaid||{}).paidBanner, unpaidModern:(M.unpaid||{}).paidBanner,
  designChanged:L.banner.caps!==M.banner.caps || L.banner.len!==M.banner.len};
if(L.receipt&&M.receipt) R.verdict.c53569={legacyLen:L.receipt.len, modernLen:M.receipt.len,
  UNCHANGED:L.receipt.len===M.receipt.len && L.receipt.caps===M.receipt.caps,
  controlChanged:(L.onScreen&&M.onScreen)?(L.onScreen.len!==M.onScreen.len||L.onScreen.caps!==M.onScreen.caps):null};
log('VERDICTS: %s', JSON.stringify(R.verdict,null,1));
R.restored=await setDesign(R.found); log('restored staging to: %s', R.restored);
log('discards: %d', R.discards.length);
save(); log('done'); await browser.close(); process.exit(0);
