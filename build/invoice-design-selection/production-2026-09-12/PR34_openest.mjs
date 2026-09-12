// PRODUCTION -- SV-9978 caveat SETTLED. Render estimate documents for work orders that have NEVER
// been invoiced and carry NO payments, under both designs, through the app's own route
// POST /api/work-orders/invoices/estimate (taking work_order_id, as the finance screen sends it).
import fs from 'fs';
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
const DIR='/home/user/Manual-test-Cases/build/invoice-design-selection/production-2026-09-12';
const EV=`${DIR}/evidence`, APIH='api.shopview.com';
const L=(...a)=>console.log(new Date().toISOString().slice(11,19),a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));
const R={at:new Date().toISOString(), purpose:'does the Legacy Payments/Balance block appear on a never-invoiced, never-paid estimate?', subjects:[], renders:{}, drift:[]};
const save=()=>fs.writeFileSync(`${DIR}/PR34.json`, JSON.stringify(R,null,1));
const SUBJ=[['S1-816','893072a2-09ad-45b5-a567-8a3f1c018de0'],['S1-822','6ba7d87c-2a16-428a-9ba8-d142aa7af012'],
            ['S1-821','02703d1f-faf2-4d01-9afb-dfb60083865e'],['S1-818','c4dc42fb-efe0-4c63-a024-c05de5024e7e']];
const { browser, page } = await bootProdLogin('/');
const call=(p)=>page.evaluate(async({a,p})=>{const r=await fetch(`https://${a}${p}`,{credentials:'include',headers:{Accept:'application/json'}});
  const t=await r.text(); let j=null; try{j=JSON.parse(t)}catch(e){} return {s:r.status,j};},{a:APIH,p});
const post=(p,b)=>page.evaluate(async({a,p,b})=>{const r=await fetch(`https://${a}${p}`,{method:'POST',credentials:'include',
  headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify(b)});return {s:r.status};},{a:APIH,p,b});
const postText=(p,b)=>page.evaluate(async({a,p,b})=>{const r=await fetch(`https://${a}${p}`,{method:'POST',credentials:'include',
  headers:{'Content-Type':'application/json'},body:JSON.stringify(b)});return {s:r.status, body:await r.text()};},{a:APIH,p,b});
const stored=async()=>{for(let i=0;i<4;i++){const r=await call('/api/organizations/invoice-settings/view');
  try{const v=r.j.data.documentDesign; if(v) return v;}catch(e){} await page.waitForTimeout(900);} return null;};
const setDesign=async(w)=>{for(let i=0;i<4;i++){ if((await stored())===w) return w;
  await post('/api/organizations/invoice-settings/change-design',{documentDesign:w}); await page.waitForTimeout(1800);} return await stored();};
const marks=(h)=>{const t=h.replace(/<[^>]+>/g,' ').replace(/&nbsp;/g,' ').replace(/\s+/g,' ');
  return {legacy:/Remit payment to/i.test(t)&&/Line Total/i.test(t), modern:/Addresses|Work Performed|Work Summary/i.test(t),
    payments:(t.match(/Payments/gi)||[]).length, balance:(t.match(/Balance/gi)||[]).length,
    deposit:(t.match(/Deposit/gi)||[]).length,
    money:[...new Set(t.match(/\$-?[\d,]+\.\d{2}/g)||[])].sort(), len:t.length};};
R.build=await page.evaluate(()=>{const m=document.querySelector('meta[name="app-version"]');return m?m.content:null;});
// confirm each subject really has no invoice and no payments
for(const [num,id] of SUBJ){
  const d=await call(`/api/work-orders/view/${id}`);
  let x=(d.j&&(d.j.data||d.j))||{}; if(x.work_order) x=x.work_order;
  const pays=x.payments||x.invoice_payments||[];
  R.subjects.push({num,id,status:x.status,invoiceId:x.invoice_id||null,payments:Array.isArray(pays)?pays.length:null});
}
L('subjects %s', JSON.stringify(R.subjects));
save();
const body=(id)=>({work_order_id:id, type:'html', isEstimate:1, includeDeclined:0,
  issueDate:new Date().toISOString(), dueDate:new Date().toISOString(), historyEvent:null});
for(const want of ['legacy','modern']){
  const now=await setDesign(want); L('=== design %s', now);
  if(now!==want){ R.renders[want]={note:'could not reach this design'}; continue; }
  R.renders[want]={};
  for(const [num,id] of SUBJ){
    const b4=await stored();
    const r=await postText('/api/work-orders/invoices/estimate', body(id));
    const af=await stored();
    if(b4!==af){ R.drift.push({num,want,b4,af}); L('   !! drift on %s -- discarded', num); continue; }
    if(r.s!==200){ R.renders[want][num]={status:r.s}; L('   %s HTTP %s', num, r.s); continue; }
    fs.writeFileSync(`${EV}/PR34-${want}-${num}-estimate.html`, r.body);
    R.renders[want][num]=marks(r.body);
    const m=R.renders[want][num];
    L('   %-8s %s legacy-look:%s modern-look:%s | Payments:%s Balance:%s Deposit:%s', num, want, m.legacy, m.modern, m.payments, m.balance, m.deposit);
  }
  save();
}
R.verdict=[];
for(const [num] of SUBJ){
  const a=(R.renders.legacy||{})[num], b=(R.renders.modern||{})[num];
  if(!a||!b||a.status||b.status){ R.verdict.push({num, note:'not captured under both designs'}); continue; }
  R.verdict.push({num, designChanged:a.legacy&&b.modern,
    paymentsL:a.payments, paymentsM:b.payments, balanceL:a.balance, balanceM:b.balance,
    blockOnUnpaidEstimate:(a.payments>0||a.balance>0),
    onlyInLegacy:((a.payments>0&&b.payments===0)||(a.balance>0&&b.balance===0)),
    moneySame:JSON.stringify(a.money)===JSON.stringify(b.money)});
}
for(const v of R.verdict) L('VERDICT %s', JSON.stringify(v));
save(); await browser.close();
