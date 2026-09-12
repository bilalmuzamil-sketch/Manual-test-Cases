// PRODUCTION -- the document cases. Same method proven on the QA branch (P06): render each document
// through the app's own preview route under each design and compare LABELLED TOTALS, not every
// dollar string on the page (the blunt version reports layout as a figure difference).
// Guarded: the stored design is read before and after every capture; drift is recorded, not believed.
import fs from 'fs';
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
const DIR='/home/user/Manual-test-Cases/build/invoice-design-selection/production-2026-09-12';
const EV=`${DIR}/evidence`; fs.mkdirSync(EV,{recursive:true});
const APIH='api.shopview.com';
const L=(...a)=>console.log(new Date().toISOString().slice(11,19),a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));
const R={at:new Date().toISOString(), docs:[], renders:{}, drift:[]};
const save=()=>fs.writeFileSync(`${DIR}/PR8.json`, JSON.stringify(R,null,1));
const { browser, page } = await bootProdLogin('/');
const call=(m,p)=>page.evaluate(async({a,m,p})=>{const r=await fetch(`https://${a}${p}`,{method:m,credentials:'include',
  headers:{Accept:'application/json'}});const t=await r.text();let j=null;try{j=JSON.parse(t)}catch(e){}
  return {status:r.status,json:j,text:t.slice(0,400)};},{a:APIH,m,p});
const html=(p)=>page.evaluate(async({a,p})=>{const r=await fetch(`https://${a}${p}`,{credentials:'include'});
  return {status:r.status, body:await r.text()};},{a:APIH,p});
const post=(p,b)=>page.evaluate(async({a,p,b})=>{const r=await fetch(`https://${a}${p}`,{method:'POST',credentials:'include',
  headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify(b)});
  return {status:r.status,text:(await r.text()).slice(0,200)};},{a:APIH,p,b});
const rowsOf=(j)=>{const pick=o=>{for(const k of ['collection','data','rows','items','results']){if(Array.isArray(o&&o[k]))return o[k];}
  if(Array.isArray(o))return o; for(const k of Object.keys(o||{})){const v=pick(o[k]); if(v&&v.length)return v;} return [];};return pick(j);};
const LABELS=['Subtotal','Sub Total','Tax','GST','Total','Balance','Amount Due','Paid','Deposit','Discount','Shop Supplies','Labor','Parts','Line Total'];
const totals=(body)=>{
  let t=body.replace(/<script[\s\S]*?<\/script>/gi,'').replace(/<style[\s\S]*?<\/style>/gi,'');
  t=t.replace(/<[^>]+>/g,' ').replace(/&nbsp;/g,' ').replace(/&amp;/g,'&').replace(/\s+/g,' ');
  const out={};
  for(const l of LABELS){ const m=[...t.matchAll(new RegExp(l+"[^$]{0,40}(\\$-?[\\d,]+\\.\\d{2})","gi"))].map(x=>x[1]);
    if(m.length) out[l]=m.slice(0,3); }
  return {out, doc:(t.match(/\b(?:INV|EST|CM)-[A-Z0-9-]+/g)||[]).slice(0,3), len:body.length,
    caps:/BILL TO|REMIT PAYMENT TO|SUMMARY|ADDRESSES|SCOPE OF WORK/.test(t),
    sentence:/Bill To|Remit payment to|Line Total/.test(t),
    remitTo:/Remit payment to|REMIT PAYMENT TO/.test(t),
    authorizer:/Authorizer|AUTHORIZER/.test(t),
    money:[...new Set((t.match(/\$-?[\d,]+\.\d{2}/g)||[]))].sort()};
};
const stored=async()=>{for(let i=0;i<4;i++){const r=await call('GET','/api/organizations/invoice-settings/view');
  try{const v=r.json.data.documentDesign; if(v) return v;}catch(e){} await page.waitForTimeout(900);} return null;};
const setDesign=async(w)=>{ for(let i=0;i<4;i++){ if((await stored())===w) return w;
  await post('/api/organizations/invoice-settings/change-design',{documentDesign:w}); await page.waitForTimeout(1800);} return await stored(); };

R.build=await page.evaluate(()=>{const m=document.querySelector('meta[name="app-version"]');return m?m.content:null;});
R.found=await stored(); L('build %s | design found %s', R.build, R.found);

// ---- collect concrete documents: invoices and estimates
const wl=await call('GET','/api/work-orders?limit=200');
const wos=rowsOf(wl.json); L('work orders returned: %d (status %d)', wos.length, wl.status);
for(const w of wos){
  if(R.docs.length>=8) break;
  const d=await call('GET',`/api/work-orders/view/${w.id}`);
  let x=(d.json&&(d.json.data||d.json))||{}; if(x.work_order) x=x.work_order;
  if(x.invoice_id) R.docs.push({wo:w.number||x.number, id:w.id, invoiceId:x.invoice_id,
     status:w.status||x.status||null, created:x.created_on||null});
}
L('documents with an invoice id: %s', JSON.stringify(R.docs.map(d=>`${d.wo}(${d.status})`)));
save();
if(!R.docs.length){ L('no documents found - stopping so nothing is guessed'); save(); await browser.close(); process.exit(1); }

for(const want of ['legacy','modern']){
  const now=await setDesign(want); L('=== design set to %s (asked %s)', now, want);
  if(now!==want){ L('   could not set - skipping this half'); continue; }
  R.renders[want]={};
  for(const d of R.docs) for(const [kind,isEst] of [['invoice','0'],['estimate','1']]){
    const before=await stored();
    const r=await html(`/api/invoices/preview?invoice_id=${d.invoiceId}&type=html&isEstimate=${isEst}&includeDeclined=0&historyEvent=`);
    const after=await stored();
    if(before!==after){ R.drift.push({doc:d.wo,kind,before,after}); L('   !! drift on %s %s (%s->%s) - discarded', d.wo, kind, before, after); continue; }
    if(r.status!==200){ R.renders[want][`${d.wo}-${kind}`]={status:r.status}; continue; }
    R.renders[want][`${d.wo}-${kind}`]=totals(r.body);
    fs.writeFileSync(`${EV}/PR8-${want}-${d.wo}-${kind}.html`, r.body);
  }
  L('  captured %d renders under %s', Object.keys(R.renders[want]).length, want);
  save();
}
// ---- compare
R.compare=[];
for(const k of Object.keys(R.renders.legacy||{})){
  const Lg=R.renders.legacy[k], M=(R.renders.modern||{})[k];
  if(!Lg||!M||Lg.status||M.status){ R.compare.push({k, note:'not rendered in both'}); continue; }
  const labels=[...new Set([...Object.keys(Lg.out),...Object.keys(M.out)])];
  const figureDiffs=labels.filter(x=>Lg.out[x]&&M.out[x]&&JSON.stringify(Lg.out[x])!==JSON.stringify(M.out[x]));
  const sl=new Set(Lg.money), sm=new Set(M.money);
  R.compare.push({k, designDiffers: Lg.caps!==M.caps || Lg.len!==M.len,
    legacyCaps:Lg.caps, modernCaps:M.caps, lenL:Lg.len, lenM:M.len,
    figuresThatDisagree:figureDiffs,
    moneyOnlyInLegacy:[...sl].filter(x=>!sm.has(x)), moneyOnlyInModern:[...sm].filter(x=>!sl.has(x)),
    docNumberSame: JSON.stringify(Lg.doc)===JSON.stringify(M.doc),
    remitToL:Lg.remitTo, remitToM:M.remitTo, authorizerL:Lg.authorizer, authorizerM:M.authorizer});
}
for(const c of R.compare) L('%-22s differs:%-5s capsL/M:%s/%s | figures disagreeing:%s | only-legacy money:%s only-modern:%s | doc no same:%s',
  c.k, c.designDiffers, c.legacyCaps, c.modernCaps, JSON.stringify(c.figuresThatDisagree||[]),
  JSON.stringify(c.moneyOnlyInLegacy||[]), JSON.stringify(c.moneyOnlyInModern||[]), c.docNumberSame);
L('drift discards: %d', R.drift.length);
R.designAtEnd=await stored(); L('design left at: %s', R.designAtEnd);
save(); L('done'); await browser.close(); process.exit(0);
