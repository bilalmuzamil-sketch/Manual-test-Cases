// PRODUCTION -- C53568. The screen said "imported successfully". Find the record: check the
// customer's Invoices tab rows (not the whole page text), and the work-order list filtered to all
// statuses. Then render it under both designs.
import fs from 'fs';
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
const DIR='/home/user/Manual-test-Cases/build/invoice-design-selection/production-2026-09-12';
const EV=`${DIR}/evidence`, APP='https://app.shopview.com', APIH='api.shopview.com';
const CUST='01de15df-5651-4704-9450-0b94f4375f6b';
const L=(...a)=>console.log(new Date().toISOString().slice(11,19),a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));
const R={at:new Date().toISOString(), case:'C53568', found:{}, renders:{}, drift:[]};
const save=()=>fs.writeFileSync(`${DIR}/PR68.json`, JSON.stringify(R,null,1));
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
// 1. the customer's invoices tab, ROWS only
await page.goto(`${APP}/customers/${CUST}/invoices`,{waitUntil:'domcontentloaded',timeout:90000}).catch(()=>{});
await page.waitForTimeout(14000);
R.found.customerRows=await page.evaluate(()=>{const ok=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
  return [...document.querySelectorAll('tbody tr')].filter(ok).map((tr,i)=>({i,txt:(tr.textContent||'').replace(/\s+/g,' ').trim().slice(0,130),
    tids:[...tr.querySelectorAll('[data-test-id]')].map(e=>e.getAttribute('data-test-id')).filter(Boolean).slice(0,6)}))
    .filter(r=>/ZZAUTOTEST|IMP-/i.test(r.txt));});
L('customer rows matching: %s', JSON.stringify(R.found.customerRows));
await page.screenshot({path:`${EV}/PR68-customer.png`, fullPage:true});
// 2. the work-order API, every status
const wos=rowsOf((await call('/api/work-orders?limit=400')).j);
R.found.api=wos.filter(w=>/ZZAUTOTEST|IMP-/i.test(JSON.stringify(w))).map(w=>({n:w.number, st:w.status, id:w.id}));
R.found.apiTotal=wos.length;
L('work orders %d | matching: %s', wos.length, JSON.stringify(R.found.api));
save();
const target=R.found.api[0];
if(!target && !R.found.customerRows.length){
  L('the import reported success but the record is not on the customer list or in the work-order list -- reporting exactly that, with the wording the screen used');
  save(); await browser.close(); process.exit(0); }
if(target){
  const d=await call(`/api/work-orders/view/${target.id}`); let x=(d.j&&(d.j.data||d.j))||{}; if(x.work_order) x=x.work_order;
  R.found.record={number:x.number, status:x.status, invoiceId:x.invoice_id||null, historical:x.is_historical||x.historical||null};
  L('record: %s', JSON.stringify(R.found.record));
  if(R.found.record.invoiceId){
    for(const want of ['legacy','modern']){
      const now=await setDesign(want); L('=== %s', now); if(now!==want) continue;
      const b4=await stored();
      const r=await html(`/api/invoices/preview?invoice_id=${R.found.record.invoiceId}&type=html&isEstimate=0&includeDeclined=0&historyEvent=`);
      const af=await stored();
      if(b4!==af){ R.drift.push({want,b4,af}); continue; }
      if(r.s!==200){ R.renders[want]={status:r.s}; L('  HTTP %s', r.s); continue; }
      fs.writeFileSync(`${EV}/PR68-${want}-imported.html`, r.body);
      let z=r.body.replace(/<style[\s\S]*?<\/style>/gi,''); const t=z.replace(/<[^>]+>/g,' ').replace(/\s+/g,' ');
      const legacy=/Remit payment to/i.test(t);
      R.renders[want]={design: legacy?'legacy':(/Work Performed|Work Summary|Addresses/i.test(t)?'modern':'indeterminate'),
        money:[...new Set(t.match(/\$-?[\d,]+\.\d{2}/g)||[])].sort(), settingWhileRead:b4};
      L('  %s -> design %s', want, R.renders[want].design);
      save();
    }
  }
}
save(); await browser.close();
