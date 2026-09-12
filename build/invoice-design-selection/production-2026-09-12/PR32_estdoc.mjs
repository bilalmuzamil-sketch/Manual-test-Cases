// PRODUCTION -- SV-9978 caveat, part 2. The finance screen of an estimate job posts to
// /api/work-orders/invoices/estimate. Capture that response to learn the document id, then render
// the estimate under BOTH designs and see whether the Legacy Payments/Balance block appears on a
// job that has never been invoiced and has no payments.
import fs from 'fs';
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
const DIR='/home/user/Manual-test-Cases/build/invoice-design-selection/production-2026-09-12';
const EV=`${DIR}/evidence`, APP='https://app.shopview.com', APIH='api.shopview.com';
const L=(...a)=>console.log(new Date().toISOString().slice(11,19),a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));
const R={at:new Date().toISOString(), purpose:'Payments/Balance on a never-invoiced, never-paid estimate', renders:{}, drift:[]};
const save=()=>fs.writeFileSync(`${DIR}/PR32.json`, JSON.stringify(R,null,1));
const WO='f7fc549d-5b80-439b-b610-a64fdabe8c68', NUM='S1-860';
const { browser, page } = await bootProdLogin('/');
const call=(p)=>page.evaluate(async({a,p})=>{const r=await fetch(`https://${a}${p}`,{credentials:'include',headers:{Accept:'application/json'}});
  const t=await r.text(); let j=null; try{j=JSON.parse(t)}catch(e){} return {s:r.status,j};},{a:APIH,p});
const post=(p,b)=>page.evaluate(async({a,p,b})=>{const r=await fetch(`https://${a}${p}`,{method:'POST',credentials:'include',
  headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify(b)});return {s:r.status};},{a:APIH,p,b});
const html=(p)=>page.evaluate(async({a,p})=>{const r=await fetch(`https://${a}${p}`,{credentials:'include'});
  return {s:r.status, body:await r.text()};},{a:APIH,p});
const stored=async()=>{for(let i=0;i<4;i++){const r=await call('/api/organizations/invoice-settings/view');
  try{const v=r.j.data.documentDesign; if(v) return v;}catch(e){} await page.waitForTimeout(900);} return null;};
const setDesign=async(w)=>{for(let i=0;i<4;i++){ if((await stored())===w) return w;
  await post('/api/organizations/invoice-settings/change-design',{documentDesign:w}); await page.waitForTimeout(1800);} return await stored();};
const marks=(h)=>{const t=h.replace(/<[^>]+>/g,' ').replace(/&nbsp;/g,' ').replace(/\s+/g,' ');
  return {legacy:/Remit payment to/i.test(t)&&/Line Total/i.test(t), modern:/Addresses|Work Performed|Work Summary/i.test(t),
    payments:(t.match(/Payments/gi)||[]).length, balance:(t.match(/Balance/gi)||[]).length,
    deposit:(t.match(/Deposit/gi)||[]).length, docNo:[...new Set(t.match(/\b(?:INV|EST|S\d)-[A-Z0-9-]+/g)||[])].sort(),
    money:[...new Set(t.match(/\$-?[\d,]+\.\d{2}/g)||[])].sort(), len:t.length};};
R.build=await page.evaluate(()=>{const m=document.querySelector('meta[name="app-version"]');return m?m.content:null;});
// capture the estimate-document response the finance screen makes
const bodies=[];
page.on('response', async r=>{ if(/\/api\/work-orders\/invoices\/estimate/.test(r.url())){
  try{ bodies.push({s:r.status(), t:(await r.text()).slice(0,4000)}); }catch(e){} }});
await page.goto(`${APP}/workorders/${WO}/finance`,{waitUntil:'domcontentloaded',timeout:90000}).catch(()=>{});
await page.waitForTimeout(14000);
const onRec=await page.evaluate(n=>(document.body.innerText||'').includes(n), NUM);
R.onRecord=onRec; L('on record %s: %s', NUM, onRec);
if(!onRec){ L('not on the record -- stop'); save(); await browser.close(); process.exit(0); }
R.estimateResponses=bodies.map(b=>({s:b.s, head:b.t.slice(0,400)}));
L('estimate responses: %d', bodies.length);
let docId=null, payCount=null;
for(const b of bodies){ try{ const j=JSON.parse(b.t); const d=j.data||j;
  docId = d.id||d.invoice_id||d.invoiceId||(d.invoice&&d.invoice.id)||docId;
  const p=d.payments||(d.invoice&&d.invoice.payments); if(Array.isArray(p)) payCount=p.length;
}catch(e){ L('  non-JSON estimate response, %d bytes', b.t.length); } }
R.docId=docId; R.paymentsOnDoc=payCount;
L('document id %s | payments on it %s', docId, payCount);
save();
if(!docId){ L('could not read a document id from the response -- reporting as an open gap, not a finding'); save(); await browser.close(); process.exit(0); }
for(const want of ['legacy','modern']){
  const now=await setDesign(want); L('=== design %s', now);
  if(now!==want){ R.renders[want]={note:'could not reach this design'}; continue; }
  const b4=await stored();
  const r=await html(`/api/invoices/preview?invoice_id=${docId}&type=html&isEstimate=1&includeDeclined=0&historyEvent=`);
  const af=await stored();
  if(b4!==af){ R.drift.push({want,b4,af}); L('  !! drift -- discarded'); continue; }
  if(r.s!==200){ R.renders[want]={status:r.s}; L('  preview HTTP %s', r.s); continue; }
  fs.writeFileSync(`${EV}/PR32-${want}-${NUM}-estimate.html`, r.body);
  R.renders[want]=marks(r.body);
  L('  %s legacy-look:%s modern-look:%s | Payments:%s Balance:%s Deposit:%s | money:%s', want,
    R.renders[want].legacy, R.renders[want].modern, R.renders[want].payments,
    R.renders[want].balance, R.renders[want].deposit, JSON.stringify(R.renders[want].money));
  save();
}
const a=R.renders.legacy, b=R.renders.modern;
if(a&&b&&!a.status&&!b.status&&!a.note&&!b.note){
  R.verdict={designChanged:a.legacy&&b.modern, paymentsL:a.payments, paymentsM:b.payments,
    balanceL:a.balance, balanceM:b.balance,
    blockAppearsOnAnUnpaidEstimate: a.payments>0||a.balance>0,
    onlyInLegacy: (a.payments>0&&b.payments===0)||(a.balance>0&&b.balance===0),
    moneySame: JSON.stringify(a.money)===JSON.stringify(b.money)};
  L('VERDICT %s', JSON.stringify(R.verdict));
}
save(); await browser.close();
