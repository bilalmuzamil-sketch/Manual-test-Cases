// PRODUCTION -- C53570 final half. The case's Expected says the LEGACY Authorizer column carries the
// IBS APPROVAL CODE (not the contact the Modern design prints). S2-863 has no IBS code, so its Legacy
// column is correctly blank. Look for any work order that DOES carry ibs_approval_code so the column
// can be seen carrying it; if none exists anywhere, say so plainly rather than inferring.
import fs from 'fs';
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
const DIR='/home/user/Manual-test-Cases/build/invoice-design-selection/production-2026-09-12';
const EV=`${DIR}/evidence`, APIH='api.shopview.com';
const L=(...a)=>console.log(new Date().toISOString().slice(11,19),a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));
const R={at:new Date().toISOString(), case:'C53570', withIbs:[], scanned:0, drift:[]};
const save=()=>fs.writeFileSync(`${DIR}/PR49.json`, JSON.stringify(R,null,1));
const { browser, page } = await bootProdLogin('/');
const call=(p)=>page.evaluate(async({a,p})=>{const r=await fetch(`https://${a}${p}`,{credentials:'include',headers:{Accept:'application/json'}});
  const t=await r.text(); let j=null; try{j=JSON.parse(t)}catch(e){} return {s:r.status,j};},{a:APIH,p});
const post=(p,b)=>page.evaluate(async({a,p,b})=>{const r=await fetch(`https://${a}${p}`,{method:'POST',credentials:'include',
  headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify(b)});return {s:r.status};},{a:APIH,p,b});
const html=(p)=>page.evaluate(async({a,p})=>{const r=await fetch(`https://${a}${p}`,{credentials:'include'});
  return {s:r.status, body:await r.text()};},{a:APIH,p});
const rowsOf=(j)=>{const pick=o=>{for(const k of ['collection','data','rows','items','results']){if(Array.isArray(o&&o[k]))return o[k];}
  if(Array.isArray(o))return o; for(const k of Object.keys(o||{})){const v=pick(o[k]); if(v&&v.length)return v;} return [];};return pick(j);};
const stored=async()=>{for(let i=0;i<4;i++){const r=await call('/api/organizations/invoice-settings/view');
  try{const v=r.j.data.documentDesign; if(v) return v;}catch(e){} await page.waitForTimeout(900);} return null;};
const setDesign=async(w)=>{for(let i=0;i<4;i++){ if((await stored())===w) return w;
  await post('/api/organizations/invoice-settings/change-design',{documentDesign:w}); await page.waitForTimeout(1800);} return await stored();};
const wos=rowsOf((await call('/api/work-orders?limit=300')).j);
L('work orders %d', wos.length);
for(const w of wos){
  const d=await call(`/api/work-orders/view/${w.id}`); let x=(d.j&&(d.j.data||d.j))||{}; if(x.work_order) x=x.work_order;
  R.scanned++;
  if(x.ibs_approval_code) R.withIbs.push({n:w.number, id:w.id, code:String(x.ibs_approval_code),
    invoiceId:x.invoice_id||null, status:x.status, authorizer:x.authorizer_full_name});
  if(R.withIbs.length>=3) break;
}
L('scanned %d work orders | carrying an IBS approval code: %d', R.scanned, R.withIbs.length);
L('%s', JSON.stringify(R.withIbs));
save();
const subj=R.withIbs.find(w=>w.invoiceId);
if(!subj){ L('no work order on this account carries an IBS approval code with an invoice -- the Legacy column cannot be seen carrying one here. Reporting that, not inferring it.');
  save(); await browser.close(); process.exit(0); }
for(const want of ['legacy','modern']){
  const now=await setDesign(want); if(now!==want) continue;
  const b4=await stored();
  const r=await html(`/api/invoices/preview?invoice_id=${subj.invoiceId}&type=html&isEstimate=0&includeDeclined=0&historyEvent=`);
  const af=await stored();
  if(b4!==af){ R.drift.push({want,b4,af}); continue; }
  if(r.s!==200){ L('%s HTTP %s', want, r.s); continue; }
  fs.writeFileSync(`${EV}/PR49-${want}-${subj.n}.html`, r.body);
  let z=r.body.replace(/<style[\s\S]*?<\/style>/gi,'');
  const t=z.replace(/<[^>]+>/g,' ').replace(/\s+/g,' ');
  const i=t.indexOf('Authorizer');
  R[want]={codePrinted:t.includes(subj.code), contactPrinted: subj.authorizer? t.includes(subj.authorizer):null,
    context: i>=0? t.slice(Math.max(0,i-120), i+220):null};
  L('%s: IBS code printed=%s contact printed=%s', want, R[want].codePrinted, R[want].contactPrinted);
  save();
}
save(); await browser.close();
