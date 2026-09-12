// PRODUCTION -- switch to Trucks Hill 2 THROUGH THE MENU (never POST /api/iam/change-location: it
// returns 200 and leaves the session with no customers and a null location bar), then finish C53527
// by creating an invoice immediately after a design switch.
import fs from 'fs';
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
const DIR='/home/user/Manual-test-Cases/build/invoice-design-selection/production-2026-09-12';
const EV=`${DIR}/evidence`;
const APP='https://app.shopview.com', APIH='api.shopview.com';
const L=(...a)=>console.log(new Date().toISOString().slice(11,19),a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));
const R={at:new Date().toISOString()};
const save=()=>fs.writeFileSync(`${DIR}/PR24.json`, JSON.stringify(R,null,1));
const { browser, page } = await bootProdLogin('/');
const call=(p)=>page.evaluate(async({a,p})=>{const r=await fetch(`https://${a}${p}`,{credentials:'include',headers:{Accept:'application/json'}});
  const t=await r.text(); let j=null; try{j=JSON.parse(t)}catch(e){} return {s:r.status,j};},{a:APIH,p});
const html=(p)=>page.evaluate(async({a,p})=>{const r=await fetch(`https://${a}${p}`,{credentials:'include'});
  return {s:r.status, body:await r.text()};},{a:APIH,p});
const post=(p,b)=>page.evaluate(async({a,p,b})=>{const r=await fetch(`https://${a}${p}`,{method:'POST',credentials:'include',
  headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify(b)});return {s:r.status};},{a:APIH,p,b});
const rowsOf=(j)=>{const pick=o=>{for(const k of ['collection','data','rows','items','results']){if(Array.isArray(o&&o[k]))return o[k];}
  if(Array.isArray(o))return o; for(const k of Object.keys(o||{})){const v=pick(o[k]); if(v&&v.length)return v;} return [];};return pick(j);};
const stored=async()=>{for(let i=0;i<4;i++){const r=await call('/api/organizations/invoice-settings/view');
  try{const v=r.j.data.documentDesign; if(v) return v;}catch(e){} await page.waitForTimeout(900);} return null;};
const setDesign=async(w)=>{for(let i=0;i<4;i++){ if((await stored())===w) return w;
  await post('/api/organizations/invoice-settings/change-design',{documentDesign:w}); await page.waitForTimeout(1800);} return await stored();};
const bar=()=>page.evaluate(()=>{const ok=e=>{const r=e.getBoundingClientRect();return r.width>0&&r.height>0;};
  const t=e=>(e.innerText||'').replace(/\s+/g,' ').trim();
  return [...document.querySelectorAll('button,.q-btn')].filter(ok).map(t).find(x=>/Hrs Today/.test(x))||null;});
const marks=(b)=>{let t=b.replace(/<script[\s\S]*?<\/script>/gi,'').replace(/<style[\s\S]*?<\/style>/gi,'')
  .replace(/<[^>]+>/g,' ').replace(/&nbsp;/g,' ').replace(/\s+/g,' ');
  return {legacy:/Remit payment to/.test(t)&&/Line Total/.test(t),
          modern:/\bAddresses\b/.test(t)||/Work Performed/.test(t)||/Work Summary/.test(t),
          len:b.length, docs:[...new Set(t.match(/\b(?:INV|EST)-[A-Z0-9-]+/g)||[])].sort(),
          location:(t.match(/Trucks? Hill \d/)||[])[0]||null};};
R.build=await page.evaluate(()=>{const m=document.querySelector('meta[name="app-version"]');return m?m.content:null;});
R.barBefore=await bar(); L('location: %s', R.barBefore);
// --- an estimate at this location that can be invoiced
const wos=rowsOf((await call('/api/work-orders?limit=200')).j);
R.statuses=[...new Set(wos.map(w=>w.status))];
const ests=wos.filter(w=>/estimate/i.test(String(w.status||'')));
L('work orders visible here: %d | estimates: %d | statuses %s', wos.length, ests.length, JSON.stringify(R.statuses));
const subject={n:'S1-852', id:(wos.find(w=>w.number==='S1-852')||{}).id, st:'complete'};  // the only scanned job whose Create Invoice is ENABLED: a work order must be Complete first
R.subject=subject; L('estimate chosen: %s', JSON.stringify(subject));
save();
if(!subject){ L('no invoiceable estimate at this location'); save(); await browser.close(); process.exit(1); }
// --- put the shop on MODERN, switch to LEGACY, then create the invoice immediately
await setDesign('modern'); L('shop on %s', await stored());
R.switchedTo=await setDesign('legacy'); L('switched to %s, now creating the invoice', R.switchedTo);
await page.goto(`${APP}/workorders/${subject.id}/finance`,{waitUntil:'domcontentloaded',timeout:90000}).catch(()=>{});
await page.waitForTimeout(16000);
// assert we are on the right page before touching anything (learning L0069)
R.onRightPage=await page.evaluate((num)=>((document.body.innerText||'').includes(num)), subject.n);
L('on the right work order page: %s', R.onRightPage);
if(!R.onRightPage){ L('landed elsewhere - stopping rather than blaming a control'); save(); await browser.close(); process.exit(2); }
const btn=await page.evaluate(()=>{const ok=e=>{const r=e.getBoundingClientRect();return r.width>0&&r.height>0;};
  const b=[...document.querySelectorAll('button')].filter(ok).find(e=>/Create Invoice/i.test((e.innerText||'').trim()));
  if(!b) return {present:false};
  const st={present:true, disabled:b.disabled, aria:b.getAttribute('aria-disabled'), cls:String(b.className||'').slice(0,80)};
  if(!b.disabled) b.click();
  return st;});
R.createButton=btn; L('Create Invoice button: %s', JSON.stringify(btn));
await page.waitForTimeout(8000);
R.dialog=await page.evaluate(()=>{const ok=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
  const d=[...document.querySelectorAll('.q-dialog')].filter(ok).pop();
  return d?{text:(d.innerText||'').replace(/\s+/g,' ').slice(0,200),
    buttons:[...d.querySelectorAll('button')].filter(ok).map(e=>(e.innerText||'').replace(/\s+/g,' ').trim()).filter(Boolean)}:null;});
L('dialog: %s', JSON.stringify(R.dialog));
if(R.dialog&&R.dialog.buttons.length){
  const go=R.dialog.buttons.find(b=>/create|confirm|yes/i.test(b)&&!/cancel/i.test(b));
  if(go){ await page.evaluate((lab)=>{const ok=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
    const d=[...document.querySelectorAll('.q-dialog')].filter(ok).pop();
    const b=[...d.querySelectorAll('button')].filter(ok).find(x=>(x.innerText||'').replace(/\s+/g,' ').trim()===lab); if(b) b.click();}, go);
    L('confirmed with "%s"', go); await page.waitForTimeout(14000); }
}
await page.screenshot({path:`${EV}/PR24-after-create.png`, fullPage:true});
const v2=await call(`/api/work-orders/view/${subject.id}`);
let y=(v2.j&&(v2.j.data||v2.j))||{}; if(y.work_order) y=y.work_order;
R.newInvoiceId=y.invoice_id||null; R.newStatus=y.status||null;
L('after: invoice id %s | status %s', R.newInvoiceId, R.newStatus);
if(R.newInvoiceId){
  const designNow=await stored();
  const r=await html(`/api/invoices/preview?invoice_id=${R.newInvoiceId}&type=html&isEstimate=0&includeDeclined=0&historyEvent=`);
  if(r.s===200){ R.newDoc={...marks(r.body), designWhenRead:designNow};
    fs.writeFileSync(`${EV}/PR24-new-invoice-legacy.html`, r.body);
    L('BRAND NEW invoice, shop on %s: legacy=%s modern=%s docs=%s location=%s',
      designNow, R.newDoc.legacy, R.newDoc.modern, JSON.stringify(R.newDoc.docs), R.newDoc.location); }
  await setDesign('modern');
  const r2=await html(`/api/invoices/preview?invoice_id=${R.newInvoiceId}&type=html&isEstimate=0&includeDeclined=0&historyEvent=`);
  if(r2.s===200){ R.newDocModern=marks(r2.body); fs.writeFileSync(`${EV}/PR24-new-invoice-modern.html`, r2.body);
    L('the same new invoice on modern: legacy=%s modern=%s', R.newDocModern.legacy, R.newDocModern.modern); }
}
L('design left at %s', await stored()); save(); L('done'); await browser.close(); process.exit(0);
