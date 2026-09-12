// PRODUCTION -- the three customer-portal cases. Entry is the profile menu's "Customer Portal" item,
// which mints the portal session itself (the direct sso-login call is refused on production).
// Everything else follows the method proven on Staging.
import fs from 'fs';
import { execSync } from 'child_process';
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
const DIR='/home/user/Manual-test-Cases/build/invoice-design-selection/production-2026-09-12';
const EV=`${DIR}/evidence`; fs.mkdirSync(EV,{recursive:true});
const APIH='api.shopview.com';
const L=(...a)=>console.log(new Date().toISOString().slice(11,19),a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));
const R={at:new Date().toISOString(), cap:{}, drift:[]};
const save=()=>fs.writeFileSync(`${DIR}/PR18.json`, JSON.stringify(R,null,1));
const { browser, ctx, page } = await bootProdLogin('/');
const call=(p)=>page.evaluate(async({a,p})=>{const r=await fetch(`https://${a}${p}`,{credentials:'include',headers:{Accept:'application/json'}});
  const t=await r.text(); let j=null; try{j=JSON.parse(t)}catch(e){} return {s:r.status,j};},{a:APIH,p});
const post=(p,b)=>page.evaluate(async({a,p,b})=>{const r=await fetch(`https://${a}${p}`,{method:'POST',credentials:'include',
  headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify(b)});return {s:r.status};},{a:APIH,p,b});
const stored=async()=>{for(let i=0;i<4;i++){const r=await call('/api/organizations/invoice-settings/view');
  try{const v=r.j.data.documentDesign; if(v) return v;}catch(e){} await page.waitForTimeout(900);} return null;};
const setDesign=async(w)=>{for(let i=0;i<4;i++){ if((await stored())===w) return w;
  await post('/api/organizations/invoice-settings/change-design',{documentDesign:w}); await page.waitForTimeout(1800);} return await stored();};
const pdfText=(p)=>{try{return execSync(`python3 -c "import pymupdf,sys;d=pymupdf.open(sys.argv[1]);print(chr(10).join(pg.get_text() for pg in d))" "${p}"`,{encoding:'utf8'});}catch(e){return '';}};
R.build=await page.evaluate(()=>{const m=document.querySelector('meta[name="app-version"]');return m?m.content:null;});
R.found=await stored(); L('build %s | design found %s', R.build, R.found);
// --- enter the portal by the menu
await page.evaluate(()=>{const ok=e=>{const r=e.getBoundingClientRect();return r.width>0&&r.height>0;};
  const t=e=>(e.innerText||'').replace(/\s+/g,' ').trim();
  const b=[...document.querySelectorAll('button,.q-btn')].filter(ok).find(e=>/Hrs Today/.test(t(e))); if(b) b.click();});
await page.waitForTimeout(3500);
const pops=[]; const on=q=>pops.push(q); ctx.on('page', on);
await page.evaluate(()=>{const ok=e=>{const r=e.getBoundingClientRect();return r.width>0&&r.height>0;};
  const m=[...document.querySelectorAll('.q-menu')].filter(ok).pop()||document;
  const el=[...m.querySelectorAll('.q-item,a,button')].filter(ok).find(e=>/Customer Portal/i.test(e.innerText||''));
  if(el) el.click();});
await page.waitForTimeout(14000); ctx.off('page', on);
const pp=pops[pops.length-1];
if(!pp){ L('portal did not open'); save(); await browser.close(); process.exit(1); }
const PORTAL=new URL(pp.url()).origin;
R.portal=PORTAL; L('portal: %s', PORTAL);
const readPage=async(q)=>q.evaluate(()=>{try{ return JSON.parse(document.querySelector('script[data-page]').textContent).props; }catch(e){ return null; }});
await pp.goto(`${PORTAL}/invoices`,{waitUntil:'domcontentloaded',timeout:90000}).catch(()=>{});
await pp.waitForTimeout(12000);
const props=await readPage(pp);
const invs=props&&props.invoices?(props.invoices.data||props.invoices):[];
R.invoices={n:invs.length, sample:invs.slice(0,6).map(x=>({id:x.id,num:x.invoice_number||x.number,st:x.status}))};
L('portal invoices: %d | %s', invs.length, JSON.stringify(R.invoices.sample));
await pp.screenshot({path:`${EV}/PR18-portal-invoices.png`, fullPage:true});
save();
const PAID=invs.find(x=>x.status==='paid'), UNPAID=invs.find(x=>x.status!=='paid');
R.subjects={paid:PAID&&{id:PAID.id,num:PAID.invoice_number||PAID.number}, unpaid:UNPAID&&{id:UNPAID.id,num:UNPAID.invoice_number||UNPAID.number}};
L('subjects: %s', JSON.stringify(R.subjects));
// payments, for the receipt and the paid banner
await pp.goto(`${PORTAL}/payments`,{waitUntil:'domcontentloaded',timeout:90000}).catch(()=>{});
await pp.waitForTimeout(11000);
const pprops=await readPage(pp);
const pays=pprops&&pprops.payments?(pprops.payments.data||pprops.payments):[];
R.payments={n:pays.length, linked:pays.filter(p=>p.status==='succeeded'&&p.invoice_id&&!p.is_batch_payment)
  .slice(0,4).map(p=>({pid:p.id,inv:p.invoice_id,num:p.invoice_number,amt:p.amount}))};
L('portal payments: %d | invoice-linked succeeded: %s', pays.length, JSON.stringify(R.payments.linked));
await pp.screenshot({path:`${EV}/PR18-portal-payments.png`, fullPage:true});
save();
const LINK=R.payments.linked[0]||null;
const RECEIPT=pays.find(p=>p.status==='succeeded');
const grab=async(url,tag)=>{
  await pp.goto(url,{waitUntil:'domcontentloaded',timeout:90000}).catch(()=>{});
  await pp.waitForTimeout(11000);
  const dom=await pp.evaluate(()=>{const t=(document.body.innerText||'').replace(/\s+/g,' ');
    return {banner:!!document.querySelector('#portal-paid-invoice-summary'),
      pill:(t.match(/PAID IN FULL|PARTIALLY PAID/)||[])[0]||null, title:document.title,
      legacyLook:/Remit payment to/i.test(t)&&!/ADDRESSES/.test(t), modernLook:/ADDRESSES|WORK PERFORMED|SUMMARY/.test(t),
      money:[...new Set(t.match(/\$-?[\d,]+\.\d{2}/g)||[])].sort(),
      docNo:[...new Set(t.match(/\b(?:INV|EST|CM|S\d?)-[A-Z0-9-]+/g)||[])].sort(), textLen:t.length};});
  await pp.emulateMedia({media:'print'}); await pp.waitForTimeout(1200);
  const f=`${EV}/PR18-${tag}.pdf`;
  await pp.pdf({path:f, format:'Letter', printBackground:true}).catch(()=>{});
  await pp.emulateMedia({media:'screen'});
  const txt=fs.existsSync(f)?pdfText(f).replace(/\s+/g,' '):'';
  await pp.screenshot({path:`${EV}/PR18-${tag}.png`, fullPage:true});
  return {...dom, pdfBytes:fs.existsSync(f)?fs.statSync(f).size:null, pdfChars:txt.length,
    pdfPill:(txt.match(/PAID IN FULL|PARTIALLY PAID/)||[])[0]||null,
    pdfMoney:[...new Set(txt.match(/\$-?[\d,]+\.\d{2}/g)||[])].sort(),
    pdfLegacy:/Remit payment to/i.test(txt)&&!/ADDRESSES/.test(txt), pdfModern:/ADDRESSES|SUMMARY/.test(txt)};
};
for(const want of ['legacy','modern']){
  const now=await setDesign(want); L('=== %s', now); if(now!==want) continue;
  R.cap[want]={};
  const b4=await stored();
  if(PAID) R.cap[want].invoice = await grab(`${PORTAL}/invoices/${PAID.id}/preview`, `${want}-invoice`);
  if(LINK) R.cap[want].withReceipt = await grab(`${PORTAL}/invoices/${LINK.inv}/preview?include_receipt=1&payment_id=${LINK.pid}`, `${want}-withreceipt`);
  if(UNPAID) R.cap[want].unpaid = await grab(`${PORTAL}/invoices/${UNPAID.id}/preview`, `${want}-unpaid`);
  if(RECEIPT) R.cap[want].receipt = await grab(`${PORTAL}/payments/${RECEIPT.id}/receipt`, `${want}-receipt`);
  const af=await stored();
  if(b4!==af){ R.drift.push({want,b4,af}); L('  !! drift during %s', want); }
  for(const [k,v] of Object.entries(R.cap[want])) L('  %-12s legacy=%s modern=%s banner=%s pdfPill=%s money=%d pdfBytes=%s docs=%s',
    k, v.legacyLook, v.modernLook, v.banner, v.pdfPill, v.money.length, v.pdfBytes, JSON.stringify(v.docNo));
  save();
}
L('design left at %s | drift %d', await stored(), R.drift.length);
save(); L('done'); await browser.close(); process.exit(0);
