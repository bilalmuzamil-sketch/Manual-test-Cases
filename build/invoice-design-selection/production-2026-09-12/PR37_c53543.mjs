// PRODUCTION -- C53543, sixth document type: the Part Sale Credit CM2-4398 the QA lead created.
// Reach its DOCUMENT by clicking the row's own print control with a network listener attached
// (the proven technique -- the app calls a credit route; guessing routes 404s), then render it
// under both designs. If the record is not reachable from this location, switch location through
// the profile menu (Rule 107) rather than declaring a blocker.
import fs from 'fs';
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
const DIR='/home/user/Manual-test-Cases/build/invoice-design-selection/production-2026-09-12';
const EV=`${DIR}/evidence`, APP='https://app.shopview.com', APIH='api.shopview.com';
const CUST='01de15df-5651-4704-9450-0b94f4375f6b', WANT='4398';
const L=(...a)=>console.log(new Date().toISOString().slice(11,19),a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));
const R={at:new Date().toISOString(), case:'C53543', net:[], drift:[], renders:{}};
const save=()=>fs.writeFileSync(`${DIR}/PR37.json`, JSON.stringify(R,null,1));
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
R.build=await page.evaluate(()=>{const m=document.querySelector('meta[name="app-version"]');return m?m.content:null;});
R.location=await page.evaluate(()=>{const b=document.querySelector('[data-test-id="profile_menu_button"]');
  return b?(b.textContent||'').replace(/\s+/g,' ').trim().slice(0,40):null;});
L('build %s | %s', R.build, R.location);
// 1. open the customer's Invoices tab
await page.goto(`${APP}/customers/${CUST}/invoices`,{waitUntil:'domcontentloaded',timeout:90000}).catch(()=>{});
await page.waitForTimeout(14000);
await page.screenshot({path:`${EV}/PR37-invoices.png`, fullPage:true});
R.screen=await page.evaluate((w)=>{const t=(document.body.innerText||'').replace(/\s+/g,' ');
  return {url:location.href, hasWanted:t.includes(w), len:t.length,
    numbers:[...new Set(t.match(/\b(?:INV|CM)\d?-\d+|\bCM\d?-\d+/g)||[])].slice(0,25), head:t.slice(0,200)};}, WANT);
L('invoices tab: url=%s hasCM2-4398=%s numbers=%s', R.screen.url, R.screen.hasWanted, JSON.stringify(R.screen.numbers));
save();
if(!R.screen.hasWanted){ L('CM2-4398 is not listed from this location -- will report, not guess'); }
// 2. find the row and its print control; listen for the route the app calls
const rows=await page.evaluate((w)=>{const ok=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
  return [...document.querySelectorAll('tr')].filter(ok).map((tr,i)=>({i,
    txt:(tr.textContent||'').replace(/\s+/g,' ').trim().slice(0,110),
    controls:[...tr.querySelectorAll('button,[data-test-id],i')].map(e=>(e.getAttribute('data-test-id')||e.textContent||'').trim().slice(0,28)).filter(Boolean)}))
    .filter(r=>r.txt);}, WANT);
R.rows=rows.slice(0,20); L('rows %d', rows.length);
const target=rows.find(r=>r.txt.includes(WANT));
R.targetRow=target||null; L('target row: %s', JSON.stringify(target));
save();
if(target){
  const before=R.net.length;
  const clicked=await page.evaluate((idx)=>{const ok=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
    const tr=[...document.querySelectorAll('tr')].filter(ok)[idx]; if(!tr) return null;
    const b=[...tr.querySelectorAll('button,i,[data-test-id]')].filter(ok)
      .find(e=>/print/i.test(`${e.getAttribute('data-test-id')||''} ${e.textContent||''} ${e.getAttribute('aria-label')||''}`));
    if(!b) return null; b.click(); return (b.getAttribute('data-test-id')||b.textContent||'').trim();}, target.i);
  L('print control clicked: %s', clicked);
  await page.waitForTimeout(11000);
  R.afterPrint=R.net.slice(before);
  L('calls after print: %s', JSON.stringify(R.afterPrint.map(n=>`${n.m} ${n.u}`).slice(0,15)));
  await page.screenshot({path:`${EV}/PR37-after-print.png`, fullPage:true});
  const credCall=R.afterPrint.find(n=>/credit/i.test(n.u));
  R.creditRoute=credCall?credCall.u:null; L('credit route: %s', R.creditRoute);
  save();
  if(R.creditRoute){
    for(const want of ['legacy','modern']){
      const now=await setDesign(want); L('=== design %s', now);
      if(now!==want){ R.renders[want]={note:'could not reach this design'}; continue; }
      const b4=await stored();
      const g=await page.evaluate(async({a,p})=>{const r=await fetch(`https://${a}${p}`,{credentials:'include'});
        const buf=await r.arrayBuffer(); let bin=''; const u=new Uint8Array(buf);
        for(let i=0;i<u.length;i++) bin+=String.fromCharCode(u[i]);
        return {s:r.status, ct:r.headers.get('content-type'), b64:btoa(bin).slice(0,4000000), n:u.length};},{a:APIH,p:R.creditRoute});
      const af=await stored();
      if(b4!==af){ R.drift.push({want,b4,af}); L('  !! drift -- discarded'); continue; }
      if(g.s!==200){ R.renders[want]={status:g.s}; L('  HTTP %s', g.s); continue; }
      fs.writeFileSync(`${EV}/PR37-${want}-CM2-4398.bin`, Buffer.from(g.b64,'base64'));
      R.renders[want]={status:200, contentType:g.ct, bytes:g.n, settingWhileRead:b4};
      L('  captured %s bytes, %s', g.n, g.ct);
      save();
    }
  }
}
save(); await browser.close();
