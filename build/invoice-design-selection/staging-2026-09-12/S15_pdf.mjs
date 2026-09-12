// C53566 (PDF half), C53567 (paid banner on the PORTAL-GENERATED PDF), C53569 (PDF half)
// The portal's print control (printer icon on the invoice page) opens /preview in a new tab;
// that page is the printable document, and "Save as PDF" is the browser's own print. So the
// PDF is produced HERE with Chromium's print engine on that exact page -- print CSS included.
// Every reading is guarded: the stored setting is read immediately before and after; drift = discard.
// POSITIVE CONTROL: the same parameterised capture runs over an UNPAID invoice in the same pass.
import pkg from '/opt/node22/lib/node_modules/playwright/index.js';
const { chromium } = pkg; import fs from 'fs'; import { execSync } from 'child_process';
const DIR='/home/user/Manual-test-Cases/build/invoice-design-selection/staging-2026-09-12';
const EV=`${DIR}/evidence`;
const APP='https://app.staging.shopview.com', APIH='api.staging.shopview.com';
const PORTAL='https://staging.portal.shopview.com';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));
const R={discards:[],runs:{}}; const save=()=>fs.writeFileSync(`${EV}/S15.json`, JSON.stringify(R,null,1));
const port=fs.readFileSync('/tmp/atlassian/bridge-port.txt','utf8').trim();
const C=JSON.parse(fs.readFileSync('/tmp/qa-cookies/staging-full.json','utf8'));
const browser=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args:[`--proxy-server=http://127.0.0.1:${port}`,'--ignore-certificate-errors','--no-sandbox']});
const ctx=await browser.newContext({ignoreHTTPSErrors:true, viewport:{width:1700,height:1200}, acceptDownloads:true});
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
const setDesign=async(w)=>{ for(let i=0;i<3;i++){ if((await stored())===w) return w;
    await api('POST','/api/organizations/invoice-settings/change-design',{documentDesign:w});
    await shop.waitForTimeout(1500);} return await stored(); };
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
R.paid=PAID; R.unpaid=UNPAID; log('paid: %s | unpaid control: %s', JSON.stringify(PAID), JSON.stringify(UNPAID));
await pp.goto(`${PORTAL}/payments`,{waitUntil:'domcontentloaded',timeout:90000});
await pp.waitForTimeout(9000);
const pay=await pp.evaluate(()=>{const j=JSON.parse(document.querySelector('script[data-page]').textContent);
  const l=j.props.payments.data||j.props.payments; return l.slice(0,1).map(x=>({id:x.id,amt:x.amount}));});
R.payment=pay[0]; log('payment for the receipt: %s', JSON.stringify(pay[0]));

// capture one printable page exactly as the browser's Save-as-PDF would
const capture=async(url, tag)=>{
  await pp.goto(url,{waitUntil:'domcontentloaded',timeout:90000}).catch(()=>{});
  await pp.waitForTimeout(9000);
  const title=await pp.title();
  await pp.emulateMedia({media:'print'});
  await pp.waitForTimeout(1500);
  const printText=await pp.evaluate(()=>(document.body.innerText||'').replace(/\s+/g,' '));
  const pdfPath=`${EV}/pdf-${tag}.pdf`;
  await pp.pdf({path:pdfPath, format:'Letter', printBackground:true});
  await pp.emulateMedia({media:'screen'});
  await pp.waitForTimeout(800);
  const scr=await pp.evaluate(()=>{const t=(document.body.innerText||'').replace(/\s+/g,' ');
    return {textLen:t.length, htmlLen:document.body.innerHTML.length,
      caps:/SCOPE OF WORK|BILL TO|REMIT PAYMENT TO|SUMMARY|ADDRESSES/.test(t),
      sentence:/Bill To|Remit payment to|Line Total/.test(t),
      money:(t.match(/\$-?[\d,]+\.\d{2}/g)||[]).sort(),
      docNo:(t.match(/\b(?:INV|EST|CM|S|P)[-0-9A-Z]{3,}\b/)||[])[0]||null,
      head:t.slice(0,160)};});
  let pdfText='';
  try{ pdfText=execSync(`python3 /home/user/Manual-test-Cases/build/testing-tools/pdf_text.py "${pdfPath}"`,{encoding:'utf8'}); }
  catch(e){ pdfText='<<extract failed: '+String(e).slice(0,80)+'>>'; }
  const pt=pdfText.replace(/\s+/g,' ');
  return {title, savedAs:title.replace(/[\/\\:]/g,'_')+'.pdf', pdfBytes:fs.statSync(pdfPath).size,
    pdfPath, printText:printText.slice(0,300),
    pdfCaps:/SCOPE OF WORK|BILL TO|REMIT PAYMENT TO|SUMMARY|ADDRESSES/.test(pt),
    pdfMoney:(pt.match(/\$-?[\d,]+\.\d{2}/g)||[]).sort(),
    pdfPaidWords:(pt.match(/\bPAID\b|Paid in full|Payment Received|PAID IN FULL/gi)||[]),
    pdfLen:pt.length, pdfHead:pt.slice(0,220), screen:scr};
};
const guarded=async(label,fn)=>{const a=await stored(); const out=await fn(); const b=await stored();
  if(a!==b){R.discards.push({label,before:a,after:b}); log('  !! DISCARDED %s (%s->%s)',label,a,b); return null;}
  return {design:a,...out};};

R.found=await stored(); log('=== design as found on staging: %s', R.found);
for(const want of ['legacy','modern']){
  const now=await setDesign(want); log('=== setting now: %s (asked %s)', now, want);
  if(now!==want){ log('   COULD NOT SET - skipping %s', want); continue; }
  R.runs[want]={};
  const a=await guarded(`${want}-paid-pdf`, ()=>capture(`${PORTAL}/invoices/${PAID.id}/preview`, `${want}-paid`));
  if(a){ R.runs[want].paid=a;
    log('  [paid] title="%s" pdfBytes=%d pdfCaps=%s money=%d paidWords=%s', a.title, a.pdfBytes, a.pdfCaps, a.pdfMoney.length, JSON.stringify(a.pdfPaidWords)); }
  if(UNPAID){ const b=await guarded(`${want}-unpaid-pdf`, ()=>capture(`${PORTAL}/invoices/${UNPAID.id}/preview`, `${want}-unpaid`));
    if(b){ R.runs[want].unpaid=b;
      log('  [unpaid CONTROL] title="%s" pdfBytes=%d pdfCaps=%s paidWords=%s', b.title, b.pdfBytes, b.pdfCaps, JSON.stringify(b.pdfPaidWords)); } }
  if(R.payment){ const c=await guarded(`${want}-receipt-pdf`, ()=>capture(`${PORTAL}/payments/${R.payment.id}/receipt`, `${want}-receipt`));
    if(c){ R.runs[want].receipt=c;
      log('  [receipt] title="%s" pdfBytes=%d pdfCaps=%s pdfLen=%d', c.title, c.pdfBytes, c.pdfCaps, c.pdfLen); } }
  save();
}
R.restored=await setDesign(R.found); log('restored staging to: %s', R.restored);
log('discards: %d', R.discards.length);
save(); log('done'); await browser.close(); process.exit(0);
