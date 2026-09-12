// C53567 -- the paid banner on the portal Invoice PDF, done the way a customer reaches it.
// ROUTE (read out of the portal's own code, not guessed): the invoice detail page renders a print
// DROPDOWN only when the invoice carries a ShopPay payment; its second item is
// "Print with Payment Receipt" -> /invoices/{id}/preview?include_receipt=1&payment_id=<id>.
// The banner ("PAID IN FULL" / "PARTIALLY PAID" pill, id=portal-paid-invoice-summary) is injected
// CLIENT-SIDE into the document only when a succeeded payment is passed to that page.
// NEGATIVE CONTROLS in the same pass: the same invoice printed WITHOUT the receipt, and an invoice
// with no payment at all. Every reading guarded by a stored-setting read before and after.
import pkg from '/opt/node22/lib/node_modules/playwright/index.js';
const { chromium } = pkg; import fs from 'fs'; import { execSync } from 'child_process';
const DIR='/home/user/Manual-test-Cases/build/invoice-design-selection/staging-2026-09-12';
const EV=`${DIR}/evidence`;
const APP='https://app.staging.shopview.com', APIH='api.staging.shopview.com';
const PORTAL='https://staging.portal.shopview.com';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));
const R={discards:[],runs:{}}; const save=()=>fs.writeFileSync(`${EV}/S24.json`, JSON.stringify(R,null,1));
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
const setDesign=async(w)=>{ for(let i=0;i<3;i++){ if((await stored())===w) return w;
  await api('POST','/api/organizations/invoice-settings/change-design',{documentDesign:w});
  await shop.waitForTimeout(1500);} return await stored(); };
const tok=JSON.parse((await api('POST','/api/token')).t).data.accessToken;
await shop.evaluate(async({P,tok})=>{await fetch(`${P}/sso-login`,{method:'POST',credentials:'include',
  headers:{'Content-Type':'application/json',Accept:'application/json',Authorization:`Bearer ${tok}`},
  body:JSON.stringify({returnJson:true,portalType:'customer'})});},{P:PORTAL,tok});

const pp=await ctx.newPage();
await pp.goto(`${PORTAL}/payments`,{waitUntil:'networkidle',timeout:90000}); await pp.waitForTimeout(9000);
const cand=await pp.evaluate(()=>{const j=JSON.parse(document.querySelector('script[data-page]').textContent);
  const l=j.props.payments.data||j.props.payments;
  return l.filter(x=>x.status==='succeeded'&&x.invoice_id&&!x.is_batch_payment)
          .map(x=>({pid:x.id, invId:x.invoice_id, num:x.invoice_number, amt:x.amount}));});
R.candidates=cand.slice(0,6); log('invoice-linked succeeded payments: %s', JSON.stringify(cand.slice(0,4)));
const P1=cand[0]; if(!P1){ log('none found'); save(); await browser.close(); process.exit(1); }
R.subject=P1; log('subject: invoice %s (%s) paid by payment %s', P1.invId, P1.num, P1.pid);
// a NO-PAYMENT invoice for the second control
await pp.goto(`${PORTAL}/invoices`,{waitUntil:'networkidle',timeout:90000}); await pp.waitForTimeout(9000);
const nopay=await pp.evaluate(()=>{const j=JSON.parse(document.querySelector('script[data-page]').textContent);
  const l=j.props.invoices.data||j.props.invoices; const x=l.find(i=>i.status!=='paid');
  return x?{invId:x.id,num:x.invoice_number||x.number,st:x.status}:null;});
R.control=nopay; log('no-payment control: %s', JSON.stringify(nopay));

const read=async(url, tag)=>{
  await pp.goto(url,{waitUntil:'domcontentloaded',timeout:90000}).catch(()=>{});
  await pp.waitForTimeout(10000);
  const dom=await pp.evaluate(()=>{const el=document.querySelector('#portal-paid-invoice-summary');
    const t=(document.body.innerText||'').replace(/\s+/g,' ');
    return {banner:!!el, bannerText:el?(el.innerText||'').replace(/\s+/g,' ').trim().slice(0,220):null,
      pill:(t.match(/PAID IN FULL|PARTIALLY PAID/)||[])[0]||null,
      caps:/BILL TO|REMIT PAYMENT TO|SUMMARY|ADDRESSES|SCOPE OF WORK/.test(t),
      sentence:/Bill To|Remit payment to|Line Total/.test(t),
      title:document.title, textLen:t.length};});
  await pp.emulateMedia({media:'print'}); await pp.waitForTimeout(1200);
  const pdf=`${EV}/pdf24-${tag}.pdf`;
  await pp.pdf({path:pdf, format:'Letter', printBackground:true});
  await pp.emulateMedia({media:'screen'});
  let pt='';
  try{ pt=execSync(`python3 -c "import pymupdf,sys;d=pymupdf.open(sys.argv[1]);print('\\n'.join(p.get_text() for p in d))" "${pdf}"`,{encoding:'utf8'}); }catch(e){ pt='<<extract failed>>'; }
  const flat=pt.replace(/\s+/g,' ');
  await pp.screenshot({path:`${EV}/S24-${tag}.png`, fullPage:true});
  return {...dom, pdfBytes:fs.statSync(pdf).size, pdfPath:pdf,
    pdfPill:(flat.match(/PAID IN FULL|PARTIALLY PAID/)||[])[0]||null,
    pdfCaps:/BILL TO|REMIT PAYMENT TO|SUMMARY|ADDRESSES|SCOPE OF WORK/.test(pt),
    pdfSentence:/Bill To|Remit payment to|Line Total/.test(pt),
    pdfMoney:[...new Set(flat.match(/\$-?[\d,]+\.\d{2}/g)||[])].sort(),
    pdfChars:pt.length, pdfHead:flat.slice(0,180)};
};
const guarded=async(label,fn)=>{const a=await stored(); const out=await fn(); const b=await stored();
  if(a!==b){R.discards.push({label,before:a,after:b}); log('  !! DISCARDED %s (%s->%s)',label,a,b); return null;}
  return {design:a,...out};};

R.found=await stored(); log('=== design as found: %s', R.found);
for(const want of ['legacy','modern']){
  const now=await setDesign(want); log('=== setting now: %s', now);
  if(now!==want){ log('  COULD NOT SET - skipping'); continue; }
  R.runs[want]={};
  const withR=await guarded(`${want}-withReceipt`, ()=>read(`${PORTAL}/invoices/${P1.invId}/preview?include_receipt=1&payment_id=${P1.pid}`, `${want}-withreceipt`));
  if(withR){ R.runs[want].withReceipt=withR;
    log('  [SUBJECT] banner=%s pill=%s pdfPill=%s caps=%s pdfBytes=%d | "%s"',
      withR.banner, withR.pill, withR.pdfPill, withR.caps, withR.pdfBytes, String(withR.bannerText||'').slice(0,70)); }
  const plain=await guarded(`${want}-plain`, ()=>read(`${PORTAL}/invoices/${P1.invId}/preview`, `${want}-plain`));
  if(plain){ R.runs[want].plain=plain;
    log('  [CONTROL 1, same invoice, no receipt] banner=%s pdfPill=%s caps=%s', plain.banner, plain.pdfPill, plain.caps); }
  if(nopay){ const np=await guarded(`${want}-nopay`, ()=>read(`${PORTAL}/invoices/${nopay.invId}/preview?include_receipt=1`, `${want}-nopay`));
    if(np){ R.runs[want].noPayment=np;
      log('  [CONTROL 2, invoice with no payment] banner=%s pdfPill=%s caps=%s', np.banner, np.pdfPill, np.caps); } }
  save();
}
// the route a user actually clicks -- prove the menu exists on the subject invoice
await pp.goto(`${PORTAL}/invoices/${P1.invId}`,{waitUntil:'networkidle',timeout:90000}).catch(()=>{});
await pp.waitForTimeout(9000);
const trigger=pp.locator('button:has(svg[class*="lucide-printer"]), a:has(svg[class*="lucide-printer"])').first();
R.printControl={count:await pp.locator('button:has(svg[class*="lucide-printer"]), a:has(svg[class*="lucide-printer"])').count(),
  tag:await trigger.evaluate(e=>e.tagName).catch(()=>null), href:await trigger.getAttribute('href').catch(()=>null)};
await trigger.click().catch(e=>log('menu click err', String(e).slice(0,90)));
await pp.waitForTimeout(3500);
R.printMenu=await pp.evaluate(()=>[...document.querySelectorAll('[role=menuitem],[role=menu] a,[data-radix-popper-content-wrapper] a')]
  .map(e=>({t:(e.textContent||'').replace(/\s+/g,' ').trim(), href:e.getAttribute('href')||''})).filter(x=>x.t));
log('print control: %s | menu: %s', JSON.stringify(R.printControl), JSON.stringify(R.printMenu));
await pp.screenshot({path:`${EV}/S24-print-menu.png`, fullPage:true});
R.restored=await setDesign(R.found); log('restored to: %s', R.restored);
log('discards: %d', R.discards.length); save(); log('done');
await browser.close(); process.exit(0);
