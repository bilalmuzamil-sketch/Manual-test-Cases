// PRODUCTION -- estimates that were never invoiced, parts sales, and credit documents.
// Estimates in their own right, not the estimate view of a paid job.
import fs from 'fs';
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
const DIR='/home/user/Manual-test-Cases/build/invoice-design-selection/production-2026-09-12';
const EV=`${DIR}/evidence`; fs.mkdirSync(EV,{recursive:true});
const APIH='api.shopview.com';
const L=(...a)=>console.log(new Date().toISOString().slice(11,19),a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));
const R={at:new Date().toISOString(), estimates:[], renders:{}, drift:[], partSales:null, credits:null};
const save=()=>fs.writeFileSync(`${DIR}/PR9.json`, JSON.stringify(R,null,1));
const { browser, page } = await bootProdLogin('/');
const call=(m,p)=>page.evaluate(async({a,m,p})=>{const r=await fetch(`https://${a}${p}`,{method:m,credentials:'include',
  headers:{Accept:'application/json'}});const t=await r.text();let j=null;try{j=JSON.parse(t)}catch(e){}
  return {status:r.status,json:j,text:t.slice(0,300)};},{a:APIH,m,p});
const html=(p)=>page.evaluate(async({a,p})=>{const r=await fetch(`https://${a}${p}`,{credentials:'include'});
  return {status:r.status, body:await r.text()};},{a:APIH,p});
const post=(p,b)=>page.evaluate(async({a,p,b})=>{const r=await fetch(`https://${a}${p}`,{method:'POST',credentials:'include',
  headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify(b)});
  return {status:r.status};},{a:APIH,p,b});
const rowsOf=(j)=>{const pick=o=>{for(const k of ['collection','data','rows','items','results']){if(Array.isArray(o&&o[k]))return o[k];}
  if(Array.isArray(o))return o; for(const k of Object.keys(o||{})){const v=pick(o[k]); if(v&&v.length)return v;} return [];};return pick(j);};
const flat=(b)=>{let t=b.replace(/<script[\s\S]*?<\/script>/gi,'').replace(/<style[\s\S]*?<\/style>/gi,'');
  return t.replace(/<[^>]+>/g,' ').replace(/&nbsp;/g,' ').replace(/&amp;/g,'&').replace(/\s+/g,' ').trim();};
const marks=(b)=>{const t=flat(b); return {
  legacy:/Remit payment to/.test(t) && /Line Total/.test(t),
  modern:/\bAddresses\b/.test(t) || /\bWork Performed\b/.test(t),
  money:[...new Set(t.match(/\$-?[\d,]+\.\d{2}/g)||[])].sort(),
  docs:[...new Set(t.match(/\b(?:INV|EST|CM|PS)-[A-Z0-9-]+/g)||[])].sort(),
  payments:/\bPayments\b/.test(t), balance:/\bBalance\b/.test(t),
  authorizer:/\bAuthorizer\b/.test(t), len:b.length};};
const stored=async()=>{for(let i=0;i<4;i++){const r=await call('GET','/api/organizations/invoice-settings/view');
  try{const v=r.json.data.documentDesign; if(v) return v;}catch(e){} await page.waitForTimeout(900);} return null;};
const setDesign=async(w)=>{for(let i=0;i<4;i++){ if((await stored())===w) return w;
  await post('/api/organizations/invoice-settings/change-design',{documentDesign:w}); await page.waitForTimeout(1800);} return await stored();};

R.build=await page.evaluate(()=>{const m=document.querySelector('meta[name="app-version"]');return m?m.content:null;});
R.found=await stored(); L('build %s | design found %s', R.build, R.found);
// --- estimates that have never been invoiced
const wl=await call('GET','/api/work-orders?limit=200');
const wos=rowsOf(wl.json);
R.statusesSeen=[...new Set(wos.map(w=>w.status))];
L('work orders %d | statuses: %s', wos.length, JSON.stringify(R.statusesSeen));
for(const w of wos){
  if(R.estimates.length>=5) break;
  if(!/estimate/i.test(String(w.status||''))) continue;
  const d=await call('GET',`/api/work-orders/view/${w.id}`);
  let x=(d.json&&(d.json.data||d.json))||{}; if(x.work_order) x=x.work_order;
  R.estimates.push({wo:w.number||x.number, id:w.id, invoiceId:x.invoice_id||null, status:w.status});
}
L('never-invoiced estimates: %s', JSON.stringify(R.estimates.map(e=>`${e.wo}(inv=${e.invoiceId?'yes':'no'})`)));
save();
// --- part sales and credits, by walking the app's own lists
for (const [name,path] of [['partSales','/api/part-sales?limit=50'],['credits','/api/credit-memos?limit=50']]){
  const r=await call('GET',path);
  R[name]={status:r.status, n:r.status===200?rowsOf(r.json).length:0,
    sample:r.status===200?rowsOf(r.json).slice(0,3).map(x=>({id:x.id,num:x.number||x.invoice_number||null,st:x.status||null})):r.text};
  L('%s -> %s, rows %s', name, r.status, R[name].n);
}
save();
// --- render the estimates under both designs
for(const want of ['legacy','modern']){
  const now=await setDesign(want); L('=== design %s', now);
  if(now!==want) continue;
  R.renders[want]={};
  for(const e of R.estimates){
    if(!e.invoiceId){ R.renders[want][e.wo]={note:'no document id on this estimate'}; continue; }
    const b4=await stored();
    const r=await html(`/api/invoices/preview?invoice_id=${e.invoiceId}&type=html&isEstimate=1&includeDeclined=0&historyEvent=`);
    const af=await stored();
    if(b4!==af){ R.drift.push({wo:e.wo,b4,af}); L('   !! drift on %s - discarded', e.wo); continue; }
    if(r.status!==200){ R.renders[want][e.wo]={status:r.status}; continue; }
    R.renders[want][e.wo]=marks(r.body);
    fs.writeFileSync(`${EV}/PR9-${want}-${e.wo}-estimate.html`, r.body);
  }
  L('  captured %d', Object.keys(R.renders[want]).length);
  save();
}
R.compare=[];
for(const k of Object.keys(R.renders.legacy||{})){
  const a=R.renders.legacy[k], b=(R.renders.modern||{})[k];
  if(!a||!b||a.status||b.status||a.note||b.note){ R.compare.push({k,note:(a&&(a.note||a.status))||'missing'}); continue; }
  const sa=new Set(a.money), sb=new Set(b.money);
  R.compare.push({k, legacyLooksLegacy:a.legacy, modernLooksModern:b.modern,
    designChanged:a.legacy&&b.modern, moneySame: JSON.stringify(a.money)===JSON.stringify(b.money),
    onlyLegacy:[...sa].filter(x=>!sb.has(x)), onlyModern:[...sb].filter(x=>!sa.has(x)),
    docsSame: JSON.stringify(a.docs)===JSON.stringify(b.docs),
    paymentsBlockLegacy:a.payments, paymentsBlockModern:b.payments,
    balanceLegacy:a.balance, balanceModern:b.balance});
}
for(const c of R.compare) L('%-12s legacy-look:%s modern-look:%s | money same:%s only-legacy:%s | docs same:%s | Payments L/M:%s/%s Balance L/M:%s/%s',
  c.k, c.legacyLooksLegacy, c.modernLooksModern, c.moneySame, JSON.stringify(c.onlyLegacy||[]), c.docsSame,
  c.paymentsBlockLegacy, c.paymentsBlockModern, c.balanceLegacy, c.balanceModern);
L('drift discards: %d | design left at %s', R.drift.length, await stored());
save(); L('done'); await browser.close(); process.exit(0);
