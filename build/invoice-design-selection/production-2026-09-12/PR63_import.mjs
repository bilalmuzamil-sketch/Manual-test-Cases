// PRODUCTION -- C53568. Seed an IMPORTED invoice through the app's own Invoices Import screen using
// its own template, then render it under both designs. Rows are tagged ZZAUTOTEST.
import fs from 'fs';
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
const DIR='/home/user/Manual-test-Cases/build/invoice-design-selection/production-2026-09-12';
const EV=`${DIR}/evidence`, APP='https://app.shopview.com', APIH='api.shopview.com';
const CSV='/tmp/claude-0/zzautotest-invoice-import.csv';
const CUST='01de15df-5651-4704-9450-0b94f4375f6b';
const L=(...a)=>console.log(new Date().toISOString().slice(11,19),a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));
const R={at:new Date().toISOString(), case:'C53568', net:[], steps:{}, renders:{}, drift:[]};
const save=()=>fs.writeFileSync(`${DIR}/PR63.json`, JSON.stringify(R,null,1));
const { browser, page } = await bootProdLogin('/');
page.on('request', r=>{const u=r.url(); if(/api\.shopview\.com/.test(u)&&r.method()!=='GET') R.net.push(`${r.method()} ${u.replace('https://api.shopview.com','')}`);});
const call=(p)=>page.evaluate(async({a,p})=>{const r=await fetch(`https://${a}${p}`,{credentials:'include',headers:{Accept:'application/json'}});
  const t=await r.text(); let j=null; try{j=JSON.parse(t)}catch(e){} return {s:r.status,j};},{a:APIH,p});
const post=(p,b)=>page.evaluate(async({a,p,b})=>{const r=await fetch(`https://${a}${p}`,{method:'POST',credentials:'include',
  headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify(b)});return {s:r.status};},{a:APIH,p,b});
const stored=async()=>{for(let i=0;i<4;i++){const r=await call('/api/organizations/invoice-settings/view');
  try{const v=r.j.data.documentDesign; if(v) return v;}catch(e){} await page.waitForTimeout(900);} return null;};
const setDesign=async(w)=>{for(let i=0;i<4;i++){ if((await stored())===w) return w;
  await post('/api/organizations/invoice-settings/change-design',{documentDesign:w}); await page.waitForTimeout(1800);} return await stored();};
await page.goto(`${APP}/administration/invoices-import`,{waitUntil:'domcontentloaded',timeout:90000}).catch(()=>{});
await page.waitForTimeout(12000);
// attach the file to the screen's own file input
const input=await page.$('[data-test-id="file_upload"]');
R.steps.fileInput=!!input;
if(!input){ L('no file input on the screen -- stop'); save(); await browser.close(); process.exit(0); }
await input.setInputFiles(CSV);
L('file attached');
await page.waitForTimeout(9000);
await page.screenshot({path:`${EV}/PR63-attached.png`, fullPage:true});
R.steps.preview=await page.evaluate(()=>{const ok=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
  const t=(document.body.innerText||'').replace(/\s+/g,' ');
  return {hasTag:t.includes('ZZAUTOTEST'), error:(t.match(/(error|invalid|required|missing|failed)[^.]{0,110}/i)||[])[0]||null,
    rows:[...document.querySelectorAll('tr')].filter(ok).map(tr=>(tr.textContent||'').replace(/\s+/g,' ').trim().slice(0,90)).slice(0,8),
    buttons:[...document.querySelectorAll('button')].filter(ok).map(b=>({txt:(b.innerText||'').replace(/\s+/g,' ').trim().slice(0,26), dis:b.disabled}))
      .filter(b=>/import|preview|upload/i.test(b.txt))};});
L('preview: tagged rows visible=%s | error=%s', R.steps.preview.hasTag, R.steps.preview.error);
L('  rows: %s', JSON.stringify(R.steps.preview.rows));
L('  buttons: %s', JSON.stringify(R.steps.preview.buttons));
save();
const go=await page.evaluate(()=>{const ok=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
  const b=[...document.querySelectorAll('button')].filter(ok).find(x=>/^import invoices$/i.test((x.innerText||'').trim()));
  if(!b) return {missing:true}; if(b.disabled) return {disabled:true}; b.click(); return {clicked:true};});
L('Import Invoices -> %s', JSON.stringify(go)); R.steps.importClick=go;
await page.waitForTimeout(16000);
await page.screenshot({path:`${EV}/PR63-after-import.png`, fullPage:true});
R.steps.afterImport=await page.evaluate(()=>{const t=(document.body.innerText||'').replace(/\s+/g,' ');
  return {msg:(t.match(/(imported|success|error|invalid|failed|created)[^.]{0,130}/i)||[])[0]||null, tag:t.includes('ZZAUTOTEST')};});
R.steps.writes=R.net;
L('after import: %s | writes: %s', JSON.stringify(R.steps.afterImport), JSON.stringify(R.net));
save();
// find the imported invoice on the customer
await page.goto(`${APP}/customers/${CUST}/invoices`,{waitUntil:'domcontentloaded',timeout:90000}).catch(()=>{});
await page.waitForTimeout(14000);
R.steps.found=await page.evaluate(()=>{const ok=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
  const rows=[...document.querySelectorAll('tr')].filter(ok).map((tr,i)=>({i,txt:(tr.textContent||'').replace(/\s+/g,' ').trim().slice(0,120),
    tids:[...tr.querySelectorAll('[data-test-id]')].map(e=>e.getAttribute('data-test-id')).filter(Boolean).slice(0,6)}));
  return rows.filter(r=>/ZZAUTOTEST|IMP-001/i.test(r.txt)).slice(0,4);});
L('imported invoice rows: %s', JSON.stringify(R.steps.found));
await page.screenshot({path:`${EV}/PR63-customer-invoices.png`, fullPage:true});
save(); await browser.close();
