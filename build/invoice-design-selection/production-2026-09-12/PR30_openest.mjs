// PRODUCTION -- settle the caveat on the SV-9978 estimate finding: does the Legacy Payments/Balance
// block also appear on an estimate that has NEVER been invoiced and carries NO payments?
// S2-864 and S2-833 both belong to already-paid jobs, so they are the easy case. This hunts an
// estimate-status work order that has a renderable document and no payments on it.
import fs from 'fs';
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
const DIR='/home/user/Manual-test-Cases/build/invoice-design-selection/production-2026-09-12';
const EV=`${DIR}/evidence`, APIH='api.shopview.com';
const L=(...a)=>console.log(new Date().toISOString().slice(11,19),a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));
const R={at:new Date().toISOString(), purpose:'SV-9978 caveat: Payments/Balance on a never-invoiced estimate', cand:[], renders:{}, drift:[]};
const save=()=>fs.writeFileSync(`${DIR}/PR30.json`, JSON.stringify(R,null,1));
const { browser, page } = await bootProdLogin('/');
const call=(p)=>page.evaluate(async({a,p})=>{const r=await fetch(`https://${a}${p}`,{credentials:'include',headers:{Accept:'application/json'}});
  const t=await r.text(); let j=null; try{j=JSON.parse(t)}catch(e){} return {s:r.status,j,t:t.slice(0,300)};},{a:APIH,p});
const post=(p,b)=>page.evaluate(async({a,p,b})=>{const r=await fetch(`https://${a}${p}`,{method:'POST',credentials:'include',
  headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify(b)});
  const t=await r.text(); let j=null; try{j=JSON.parse(t)}catch(e){} return {s:r.status,j,t:t.slice(0,300)};},{a:APIH,p,b});
const html=(p)=>page.evaluate(async({a,p})=>{const r=await fetch(`https://${a}${p}`,{credentials:'include'});
  return {s:r.status, body:await r.text()};},{a:APIH,p});
const rowsOf=(j)=>{const pick=o=>{for(const k of ['collection','data','rows','items','results']){if(Array.isArray(o&&o[k]))return o[k];}
  if(Array.isArray(o))return o; for(const k of Object.keys(o||{})){const v=pick(o[k]); if(v&&v.length)return v;} return [];};return pick(j);};
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
// --- enumerate every work order, keep the estimate-status ones with a document id and no payments
const wos=rowsOf((await call('/api/work-orders?limit=300')).j);
R.total=wos.length; R.statuses=[...new Set(wos.map(w=>w.status))];
L('work orders %d statuses %s', wos.length, JSON.stringify(R.statuses));
for(const w of wos){
  if(!/estimate/i.test(String(w.status||''))) continue;
  const d=await call(`/api/work-orders/view/${w.id}`);
  let x=(d.j&&(d.j.data||d.j))||{}; if(x.work_order) x=x.work_order;
  const pays=(x.payments||x.invoice_payments||[]);
  R.cand.push({wo:w.number||x.number, id:w.id, invoiceId:x.invoice_id||x.invoiceId||null,
    payments:Array.isArray(pays)?pays.length:null, total:x.total||x.grand_total||null, status:w.status});
}
L('estimate-status work orders: %s', JSON.stringify(R.cand));
save();
const subject=R.cand.find(c=>c.invoiceId && !c.payments) || R.cand.find(c=>c.invoiceId);
R.subject=subject||null;
if(!subject){ L('NO estimate-status work order carries a renderable document id -- reporting that, not guessing'); save(); await browser.close(); process.exit(0); }
L('subject %s doc=%s payments=%s', subject.wo, subject.invoiceId, subject.payments);
for(const want of ['legacy','modern']){
  const now=await setDesign(want); L('=== design %s', now);
  if(now!==want){ R.renders[want]={note:'could not reach this design'}; continue; }
  const b4=await stored();
  const r=await html(`/api/invoices/preview?invoice_id=${subject.invoiceId}&type=html&isEstimate=1&includeDeclined=0&historyEvent=`);
  const af=await stored();
  if(b4!==af){ R.drift.push({want,b4,af}); L('  !! drift -- discarded'); continue; }
  if(r.s!==200){ R.renders[want]={status:r.s}; L('  preview %s', r.s); continue; }
  fs.writeFileSync(`${EV}/PR30-${want}-${subject.wo}-estimate.html`, r.body);
  R.renders[want]=marks(r.body);
  L('  %s: legacy-look:%s modern-look:%s Payments:%s Balance:%s Deposit:%s', want,
    R.renders[want].legacy, R.renders[want].modern, R.renders[want].payments, R.renders[want].balance, R.renders[want].deposit);
  save();
}
const a=R.renders.legacy, b=R.renders.modern;
if(a&&b&&!a.status&&!b.status&&!a.note&&!b.note){
  R.verdict={designChanged:a.legacy&&b.modern,
    paymentsOnlyInLegacy: a.payments>0 && b.payments===0,
    balanceOnlyInLegacy: a.balance>0 && b.balance===0,
    paymentsL:a.payments, paymentsM:b.payments, balanceL:a.balance, balanceM:b.balance,
    moneySame: JSON.stringify(a.money)===JSON.stringify(b.money),
    onlyLegacyMoney:a.money.filter(x=>!b.money.includes(x)), onlyModernMoney:b.money.filter(x=>!a.money.includes(x))};
  L('VERDICT %s', JSON.stringify(R.verdict));
}
save(); await browser.close();
