// PRODUCTION -- C53543 sixth document type. Switch to Trucks Hill 2 through the profile menu's
// location select, open the customer's Invoices tab, click the CM2-4398 row's own print control
// with a network listener attached to learn the route the app calls, then fetch that document
// under BOTH designs and compare. Setting read before and after every capture.
import fs from 'fs';
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
const DIR='/home/user/Manual-test-Cases/build/invoice-design-selection/production-2026-09-12';
const EV=`${DIR}/evidence`, APP='https://app.shopview.com', APIH='api.shopview.com';
const CUST='01de15df-5651-4704-9450-0b94f4375f6b', WANT='4398';
const L=(...a)=>console.log(new Date().toISOString().slice(11,19),a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));
const R={at:new Date().toISOString(), case:'C53543', net:[], drift:[], renders:{}};
const save=()=>fs.writeFileSync(`${DIR}/PR40.json`, JSON.stringify(R,null,1));
const { browser, page } = await bootProdLogin('/');
page.on('request', r=>{const u=r.url(); if(/api\.shopview\.com/.test(u)) R.net.push({m:r.method(),u:u.replace('https://api.shopview.com','')});});
const call=(p)=>page.evaluate(async({a,p})=>{const r=await fetch(`https://${a}${p}`,{credentials:'include',headers:{Accept:'application/json'}});
  const t=await r.text(); let j=null; try{j=JSON.parse(t)}catch(e){} return {s:r.status,j};},{a:APIH,p});
const post=(p,b)=>page.evaluate(async({a,p,b})=>{const r=await fetch(`https://${a}${p}`,{method:'POST',credentials:'include',
  headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify(b)});return {s:r.status};},{a:APIH,p,b});
const stored=async()=>{for(let i=0;i<4;i++){const r=await call('/api/organizations/invoice-settings/view');
  try{const v=r.j.data.documentDesign; if(v) return v;}catch(e){} await page.waitForTimeout(900);} return null;};
const setDesign=async(w)=>{for(let i=0;i<4;i++){ if((await stored())===w) return w;
  await post('/api/organizations/invoice-settings/change-design',{documentDesign:w}); await page.waitForTimeout(1800);} return await stored();};
const locNow=async()=>page.evaluate(()=>{const b=document.querySelector('[data-test-id="profile_menu_button"]');
  return b?(b.textContent||'').replace(/\s+/g,' ').trim().slice(0,22):null;});
R.build=await page.evaluate(()=>{const m=document.querySelector('meta[name="app-version"]');return m?m.content:null;});
// --- switch location
R.locStart=await locNow();
await page.evaluate(()=>{const b=document.querySelector('[data-test-id="profile_menu_button"]'); b&&b.click();});
await page.waitForTimeout(2500);
await page.evaluate(()=>{const s=document.querySelector('[data-test-id="select_location"]'); s&&s.click();});
await page.waitForTimeout(3000);
R.picked=await page.evaluate(()=>{const ok=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
  const it=[...document.querySelectorAll('.q-menu .q-item,[role=option]')].filter(ok)
    .find(e=>/Trucks?\s*Hill\s*2/i.test(e.textContent||''));
  if(!it) return null; it.click(); return (it.textContent||'').trim().slice(0,30);});
await page.waitForTimeout(9000);
await page.keyboard.press('Escape').catch(()=>{});
await page.goto(`${APP}/workorders`,{waitUntil:'domcontentloaded',timeout:90000}).catch(()=>{});
await page.waitForTimeout(9000);
R.locAfter=await locNow();
L('location %s -> %s (picked %s)', R.locStart, R.locAfter, R.picked);
if(!/Trucks Hill 2/i.test(R.locAfter||'')){ L('location did not change -- stop, do not claim anything about the record'); save(); await browser.close(); process.exit(0); }
save();
// --- find the row
await page.goto(`${APP}/customers/${CUST}/invoices`,{waitUntil:'domcontentloaded',timeout:90000}).catch(()=>{});
await page.waitForTimeout(14000);
await page.screenshot({path:`${EV}/PR40-invoices.png`, fullPage:true});
R.screen=await page.evaluate((w)=>{const t=(document.body.innerText||'').replace(/\s+/g,' ');
  return {url:location.href, has:t.includes(w), numbers:[...new Set(t.match(/\b(?:INV|CM|EST)\d?-\d+/g)||[])].slice(0,30)};}, WANT);
L('CM2-4398 present: %s | numbers %s', R.screen.has, JSON.stringify(R.screen.numbers));
save();
if(!R.screen.has){ L('still not listed at this location'); save(); await browser.close(); process.exit(0); }
const rows=await page.evaluate((w)=>{const ok=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
  return [...document.querySelectorAll('tr')].filter(ok).map((tr,i)=>({i,txt:(tr.textContent||'').replace(/\s+/g,' ').trim().slice(0,120)}))
    .filter(r=>r.txt.includes(w));}, WANT);
R.row=rows[0]||null; L('row: %s', JSON.stringify(R.row));
if(!R.row){ save(); await browser.close(); process.exit(0); }
const before=R.net.length;
R.clicked=await page.evaluate((idx)=>{const ok=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
  const tr=[...document.querySelectorAll('tr')].filter(ok)[idx]; if(!tr) return null;
  const b=[...tr.querySelectorAll('button,i,[data-test-id]')].filter(ok)
    .find(e=>/print/i.test(`${e.getAttribute('data-test-id')||''} ${e.textContent||''} ${e.getAttribute('aria-label')||''}`));
  if(!b) return null; b.click(); return (b.getAttribute('data-test-id')||b.textContent||'').trim();}, R.row.i);
L('print clicked: %s', R.clicked);
await page.waitForTimeout(12000);
R.afterPrint=R.net.slice(before).map(n=>`${n.m} ${n.u}`);
L('calls after print: %s', JSON.stringify(R.afterPrint.slice(0,12)));
await page.screenshot({path:`${EV}/PR40-after-print.png`, fullPage:true});
const cc=R.net.slice(before).find(n=>/credit|pdf|preview/i.test(n.u));
R.docRoute=cc?cc.u:null; L('document route: %s', R.docRoute);
save();
if(R.docRoute){
  for(const want of ['legacy','modern']){
    const now=await setDesign(want); L('=== design %s', now);
    if(now!==want){ R.renders[want]={note:'could not reach this design'}; continue; }
    const b4=await stored();
    const g=await page.evaluate(async({a,p})=>{const r=await fetch(`https://${a}${p}`,{credentials:'include'});
      const buf=await r.arrayBuffer(); const u=new Uint8Array(buf); let bin='';
      for(let i=0;i<u.length;i++) bin+=String.fromCharCode(u[i]);
      return {s:r.status, ct:r.headers.get('content-type')||'', n:u.length, b64:btoa(bin)};},{a:APIH,p:R.docRoute});
    const af=await stored();
    if(b4!==af){ R.drift.push({want,b4,af}); L('  !! drift -- discarded'); continue; }
    if(g.s!==200){ R.renders[want]={status:g.s}; L('  HTTP %s', g.s); continue; }
    const ext=/pdf/i.test(g.ct)?'pdf':'html';
    fs.writeFileSync(`${EV}/PR40-${want}-CM2-4398.${ext}`, Buffer.from(g.b64,'base64'));
    R.renders[want]={status:200, contentType:g.ct, bytes:g.n, settingWhileRead:b4, file:`PR40-${want}-CM2-4398.${ext}`};
    L('  captured %s bytes %s -> %s', g.n, g.ct, ext);
    save();
  }
}
save(); await browser.close();
