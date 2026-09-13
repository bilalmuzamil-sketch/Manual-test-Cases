// PRODUCTION -- C53568. Before writing "no batch or imported invoice exists here" into a report,
// prove it: walk the invoice-bearing screens and look for any batch/import feature or any document
// labelled as one. A negative claim needs a positive control -- the same walk must find the ordinary
// invoices it is supposed to find.
import fs from 'fs';
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
const DIR='/home/user/Manual-test-Cases/build/invoice-design-selection/production-2026-09-12';
const EV=`${DIR}/evidence`, APP='https://app.shopview.com', APIH='api.shopview.com';
const CUST='01de15df-5651-4704-9450-0b94f4375f6b';
const L=(...a)=>console.log(new Date().toISOString().slice(11,19),a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));
const R={at:new Date().toISOString(), case:'C53568', screens:{}, api:{}};
const save=()=>fs.writeFileSync(`${DIR}/PR60.json`, JSON.stringify(R,null,1));
const { browser, page } = await bootProdLogin('/');
const call=(p)=>page.evaluate(async({a,p})=>{const r=await fetch(`https://${a}${p}`,{credentials:'include',headers:{Accept:'application/json'}});
  const t=await r.text(); let j=null; try{j=JSON.parse(t)}catch(e){} return {s:r.status,j,t:t.slice(0,150)};},{a:APIH,p});
const rowsOf=(j)=>{const pick=o=>{for(const k of ['collection','data','rows','items','results']){if(Array.isArray(o&&o[k]))return o[k];}
  if(Array.isArray(o))return o; for(const k of Object.keys(o||{})){const v=pick(o[k]); if(v&&v.length)return v;} return [];};return pick(j);};
const walk=async(url,tag)=>{ await page.goto(url,{waitUntil:'domcontentloaded',timeout:90000}).catch(()=>{});
  await page.waitForTimeout(12000);
  const d=await page.evaluate(()=>{const ok=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
    const t=(document.body.innerText||'').replace(/\s+/g,' ');
    return {url:location.href, len:t.length,
      mentionsBatch:/batch/i.test(t), mentionsImport:/import/i.test(t),
      invoiceRows:[...document.querySelectorAll('tr')].filter(ok).filter(tr=>/invoice/i.test(tr.textContent||'')).length,
      controls:[...document.querySelectorAll('button,[data-test-id],a')].filter(ok)
        .map(e=>({tid:e.getAttribute('data-test-id')||null, txt:(e.textContent||'').replace(/\s+/g,' ').trim().slice(0,30)}))
        .filter(x=>/batch|import|upload|bulk/i.test(`${x.tid} ${x.txt}`)).slice(0,15),
      head:t.slice(0,180)};});
  await page.screenshot({path:`${EV}/PR60-${tag}.png`, fullPage:true});
  R.screens[tag]=d;
  L('%-14s rows-with-invoice=%d batch=%s import=%s | batch/import controls: %s',
    tag, d.invoiceRows, d.mentionsBatch, d.mentionsImport, JSON.stringify(d.controls));
  save(); return d; };
R.build=await page.evaluate(()=>{const m=document.querySelector('meta[name="app-version"]');return m?m.content:null;});
L('build %s', R.build);
// POSITIVE CONTROL first: the customer's invoices list must show invoices
await walk(`${APP}/customers/${CUST}/invoices`,'customer-invoices');
await walk(`${APP}/workorders`,'workorders');
await walk(`${APP}/reports`,'reports');
await walk(`${APP}/administration/settings`,'settings');
await walk(`${APP}/parts/part-sales`,'part-sales');
// the app's own top navigation -- is there any invoicing/batch area at all?
R.nav=await page.evaluate(()=>{const ok=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
  return [...document.querySelectorAll('[data-test-id="button_desktop_nav_link"],nav a,header a')].filter(ok)
    .map(e=>(e.textContent||'').replace(/\s+/g,' ').trim()).filter(Boolean).slice(0,15);});
L('top navigation: %s', JSON.stringify(R.nav));
// API: does anything describe an invoice as batch or imported?
for(const p of ['/api/invoices?limit=50','/api/invoices/batch','/api/invoice-batches','/api/invoices/imported']){
  const r=await call(p); R.api[p]={s:r.s, n:r.s===200?rowsOf(r.j).length:0, t:r.s!==200?r.t:null};
  L('%-28s -> %s (%s rows)', p, r.s, R.api[p].n);
}
const inv=await call('/api/invoices?limit=100');
if(inv.s===200){ const rows=rowsOf(inv.j);
  R.invoiceFlags=[...new Set(rows.flatMap(x=>Object.keys(x).filter(k=>/batch|import|source|origin|type/i.test(k))))];
  R.invoiceFlagValues=R.invoiceFlags.map(k=>({k, values:[...new Set(rows.map(x=>String(x[k])))].slice(0,6)}));
  L('invoice fields that could mark a batch/imported document: %s', JSON.stringify(R.invoiceFlagValues)); }
save(); await browser.close();
