// PRODUCTION -- C53537: a Credit Invoice raised against SEVERAL invoices at once renders in the
// current setting; there is no single source invoice whose design it could follow. Use the
// customer's New payment flow to apply the $9,000 unapplied credit CM2-4397 across two unpaid
// invoices, then render the remaining credit under both designs.
import fs from 'fs';
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
const DIR='/home/user/Manual-test-Cases/build/invoice-design-selection/production-2026-09-12';
const EV=`${DIR}/evidence`, APP='https://app.shopview.com', APIH='api.shopview.com';
const CUST='01de15df-5651-4704-9450-0b94f4375f6b';
const CREDIT={n:'CM2-4397', id:'cdb97793-ceeb-4aa3-99fc-ca3c538fab75'};
const L=(...a)=>console.log(new Date().toISOString().slice(11,19),a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));
const R={at:new Date().toISOString(), case:'C53537', net:[], steps:{}, renders:{}, drift:[]};
const save=()=>fs.writeFileSync(`${DIR}/PR51.json`, JSON.stringify(R,null,1));
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
const openInvoices=async()=>{ await page.goto(`${APP}/customers/${CUST}/invoices`,{waitUntil:'domcontentloaded',timeout:90000}).catch(()=>{});
  await page.waitForTimeout(14000); };
R.build=await page.evaluate(()=>{const m=document.querySelector('meta[name="app-version"]');return m?m.content:null;});
R.steps.designStart=await stored(); L('build %s design %s', R.build, R.steps.designStart);
await openInvoices();
await page.screenshot({path:`${EV}/PR51-before.png`, fullPage:true});
// what unpaid invoices are on the list, and where are the row checkboxes?
R.steps.unpaid=await page.evaluate(()=>{const ok=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
  return [...document.querySelectorAll('tr')].filter(ok).map((tr,i)=>({i,
    txt:(tr.textContent||'').replace(/\s+/g,' ').trim().slice(0,110),
    cb:!!tr.querySelector('input[type=checkbox],.q-checkbox')}))
    .filter(r=>/invoice|INV-/i.test(r.txt)&&r.cb).slice(0,12);});
L('checkable invoice rows: %s', JSON.stringify(R.steps.unpaid.slice(0,6)));
R.steps.creditRow=await page.evaluate((n)=>{const ok=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
  const rows=[...document.querySelectorAll('tr')].filter(ok);
  const i=rows.findIndex(tr=>(tr.textContent||'').includes(n));
  return i>=0?{i, cb:!!rows[i].querySelector('input[type=checkbox],.q-checkbox')}:null;}, CREDIT.n);
L('credit row: %s', JSON.stringify(R.steps.creditRow));
save();
if(!R.steps.creditRow || !R.steps.creditRow.cb || R.steps.unpaid.length<2){
  L('the screen does not offer the credit and two invoices as tickable rows -- reporting what it offers, not forcing it');
  save(); await browser.close(); process.exit(0); }
// tick the credit, then two invoices
const tick=async(idx,label)=>{ const r=await page.evaluate((i)=>{const ok=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
    const tr=[...document.querySelectorAll('tr')].filter(ok)[i]; if(!tr) return null;
    const c=tr.querySelector('.q-checkbox')||tr.querySelector('input[type=checkbox]'); if(!c) return null;
    c.click(); return true;}, idx); await page.waitForTimeout(2200); L('  ticked %s -> %s', label, r); return r; };
await tick(R.steps.creditRow.i, CREDIT.n);
await tick(R.steps.unpaid[0].i, R.steps.unpaid[0].txt.slice(0,26));
await tick(R.steps.unpaid[1].i, R.steps.unpaid[1].txt.slice(0,26));
await page.screenshot({path:`${EV}/PR51-ticked.png`, fullPage:true});
R.steps.newPayment=await page.evaluate(()=>{const ok=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
  const b=[...document.querySelectorAll('button,[data-test-id]')].filter(ok)
    .find(e=>e.getAttribute('data-test-id')==='button_new_payment'||/^new payment$/i.test((e.textContent||'').trim()));
  if(!b) return null; b.click(); return true;});
L('New payment clicked: %s', R.steps.newPayment);
await page.waitForTimeout(7000);
await page.screenshot({path:`${EV}/PR51-payment-dialog.png`, fullPage:true});
R.steps.dialog=await page.evaluate(()=>{const ok=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
  const d=[...document.querySelectorAll('.q-dialog')].filter(ok).pop(); if(!d) return null;
  return {text:(d.innerText||'').replace(/\s+/g,' ').slice(0,420),
    buttons:[...d.querySelectorAll('button')].filter(ok).map(b=>(b.innerText||'').replace(/\s+/g,' ').trim()).filter(Boolean)};});
L('payment dialog: %s', JSON.stringify(R.steps.dialog));
save();
if(R.steps.dialog){
  const go=(R.steps.dialog.buttons||[]).find(b=>/^(make payment|new payment|create credit|apply|save|submit)$/i.test(b));
  if(go){ await page.evaluate((lab)=>{const ok=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
    const d=[...document.querySelectorAll('.q-dialog')].filter(ok).pop();
    const b=[...d.querySelectorAll('button')].filter(ok).find(x=>(x.innerText||'').replace(/\s+/g,' ').trim()===lab); if(b) b.click();}, go);
    L('confirmed with "%s"', go); await page.waitForTimeout(16000); } else L('no confirm button matched: %s', JSON.stringify(R.steps.dialog.buttons));
}
await page.screenshot({path:`${EV}/PR51-after-payment.png`, fullPage:true});
R.steps.writes=R.net; L('writes: %s', JSON.stringify(R.net));
await openInvoices();
R.steps.after=await page.evaluate((n)=>{const ok=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
  const rows=[...document.querySelectorAll('tr')].filter(ok).map(tr=>(tr.textContent||'').replace(/\s+/g,' ').trim());
  return {creditRow:rows.find(t=>t.includes(n))||null, rowCount:rows.length};}, CREDIT.n);
L('credit row after: %s', JSON.stringify(R.steps.after));
save();
// render the credit under both designs
for(const want of ['legacy','modern']){
  const now=await setDesign(want); L('=== %s', now); if(now!==want) continue;
  const b4=await stored();
  const g=await page.evaluate(async({a,id})=>{const r=await fetch(`https://${a}/api/credit-memos/${id}/pdf`,{credentials:'include'});
    const buf=await r.arrayBuffer(); const u=new Uint8Array(buf); let bin='';
    for(let i=0;i<u.length;i++) bin+=String.fromCharCode(u[i]);
    return {s:r.status, n:u.length, b64:btoa(bin)};},{a:APIH,id:CREDIT.id});
  const af=await stored();
  if(b4!==af){ R.drift.push({want,b4,af}); L('  drift -- discarded'); continue; }
  if(g.s!==200){ R.renders[want]={status:g.s}; L('  HTTP %s', g.s); continue; }
  fs.writeFileSync(`${EV}/PR51-${want}-credit.pdf`, Buffer.from(g.b64,'base64'));
  R.renders[want]={status:200, bytes:g.n, settingWhileRead:b4}; L('  captured %s bytes', g.n);
  save();
}
save(); await browser.close();
