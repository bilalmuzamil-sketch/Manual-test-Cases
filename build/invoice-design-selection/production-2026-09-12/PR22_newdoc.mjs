// PRODUCTION -- C53527: a document CREATED right after a switch uses the new look.
// The estimate S2-847 is turned into an invoice while the shop is on Legacy, and the brand-new
// invoice is read immediately. Creating an invoice is ordinary shop data and the QA lead has
// authorised seeding on this account.
import fs from 'fs';
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
const DIR='/home/user/Manual-test-Cases/build/invoice-design-selection/production-2026-09-12';
const EV=`${DIR}/evidence`;
const APP='https://app.shopview.com', APIH='api.shopview.com';
const L=(...a)=>console.log(new Date().toISOString().slice(11,19),a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));
const R={at:new Date().toISOString()};
const save=()=>fs.writeFileSync(`${DIR}/PR22.json`, JSON.stringify(R,null,1));
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
const marks=(b)=>{let t=b.replace(/<script[\s\S]*?<\/script>/gi,'').replace(/<style[\s\S]*?<\/style>/gi,'')
  .replace(/<[^>]+>/g,' ').replace(/&nbsp;/g,' ').replace(/\s+/g,' ');
  return {legacy:/Remit payment to/.test(t)&&/Line Total/.test(t),
          modern:/\bAddresses\b/.test(t)||/Work Performed/.test(t)||/Work Summary/.test(t),
          len:b.length, docs:[...new Set(t.match(/\b(?:INV|EST)-[A-Z0-9-]+/g)||[])].sort()};};
R.build=await page.evaluate(()=>{const m=document.querySelector('meta[name="app-version"]');return m?m.content:null;});
// 1. put the shop on MODERN first, so the switch to Legacy is the thing under test
await setDesign('modern'); L('shop set to modern; stored=%s', await stored());
// 2. an estimate that has never been invoiced
const wos=rowsOf((await call('/api/work-orders?limit=200')).j);
const est={number:'S2-847', id:'f3094a96-24f4-42b6-85bf-678168d23e65', status:'estimate'};  // renders cleanly; S1-860 errors on its own account
R.estimate={n:est.number,id:est.id,st:est.status}; L('estimate to invoice: %s', JSON.stringify(R.estimate));
// 3. SWITCH to legacy, then immediately create the invoice
R.switchedTo=await setDesign('legacy'); L('switched to %s', R.switchedTo);
await page.goto(`${APP}/workorders/${est.id}/finance`,{waitUntil:'domcontentloaded',timeout:90000}).catch(()=>{});
await page.waitForTimeout(15000);
const created=await page.evaluate(()=>{const ok=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
  const b=[...document.querySelectorAll('button')].filter(ok).find(e=>/^Create Invoice$/i.test((e.innerText||'').trim()));
  if(b){b.click(); return true;} return false;});
L('Create Invoice clicked: %s', created);
await page.waitForTimeout(6000);
// a confirmation dialog may appear
R.createDialog=await page.evaluate(()=>{const ok=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
  const d=[...document.querySelectorAll('.q-dialog')].filter(ok).pop();
  if(!d) return null;
  const btns=[...d.querySelectorAll('button')].filter(ok).map(e=>(e.innerText||'').replace(/\s+/g,' ').trim()).filter(Boolean);
  return {text:(d.innerText||'').replace(/\s+/g,' ').slice(0,220), buttons:btns};});
L('dialog after Create Invoice: %s', JSON.stringify(R.createDialog));
if(R.createDialog && R.createDialog.buttons.length){
  const go=R.createDialog.buttons.find(b=>/create|confirm|yes|invoice/i.test(b)&&!/cancel/i.test(b));
  if(go){ await page.evaluate((lab)=>{const ok=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
    const d=[...document.querySelectorAll('.q-dialog')].filter(ok).pop();
    const b=[...d.querySelectorAll('button')].filter(ok).find(x=>(x.innerText||'').replace(/\s+/g,' ').trim()===lab);
    if(b) b.click();}, go); L('confirmed with "%s"', go); await page.waitForTimeout(12000); }
}
await page.screenshot({path:`${EV}/PR22-after-create.png`, fullPage:true});
// 4. read the brand-new invoice
const d2=await call(`/api/work-orders/view/${est.id}`);
let x=(d2.j&&(d2.j.data||d2.j))||{}; if(x.work_order) x=x.work_order;
R.newInvoiceId=x.invoice_id||null; R.newStatus=x.status||null;
L('after creating: invoice id %s | work order status %s', R.newInvoiceId, R.newStatus);
if(R.newInvoiceId){
  const b4=await stored();
  const r=await html(`/api/invoices/preview?invoice_id=${R.newInvoiceId}&type=html&isEstimate=0&includeDeclined=0&historyEvent=`);
  const af=await stored();
  R.designWhenRead={before:b4, after:af};
  if(r.s===200){ R.newDoc=marks(r.body); fs.writeFileSync(`${EV}/PR22-new-invoice-legacy.html`, r.body);
    L('BRAND NEW invoice read while the shop is on %s: legacy=%s modern=%s docs=%s',
      b4, R.newDoc.legacy, R.newDoc.modern, JSON.stringify(R.newDoc.docs)); }
  else L('preview %s', r.s);
  // and now flip to modern and read the same brand-new document again
  await setDesign('modern');
  const r2=await html(`/api/invoices/preview?invoice_id=${R.newInvoiceId}&type=html&isEstimate=0&includeDeclined=0&historyEvent=`);
  if(r2.s===200){ R.newDocModern=marks(r2.body); fs.writeFileSync(`${EV}/PR22-new-invoice-modern.html`, r2.body);
    L('the same new invoice on modern: legacy=%s modern=%s docs=%s',
      R.newDocModern.legacy, R.newDocModern.modern, JSON.stringify(R.newDocModern.docs)); }
}
L('design left at %s', await stored()); save(); L('done'); await browser.close(); process.exit(0);
