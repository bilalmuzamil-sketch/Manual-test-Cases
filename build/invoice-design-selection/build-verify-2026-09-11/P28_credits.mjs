// Credit documents on the Lethbridge location, rendered under both designs, guarded.
// Also: the setting read on the second location (C53521).
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/invoice-design-selection/build-verify-2026-09-11';
const APP='https://sv9872.qa.shopview.com', API='sv9872api.qa.shopview.com';
const CUST='f6ed9314-2c93-41d5-bd89-f09d5327e5e9';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));
const R={guardDiscards:[]}; const save=()=>fs.writeFileSync(`${DIR}/evidence/P28.json`, JSON.stringify(R,null,1));
const s=await boot('sv9872','/','admin'); const page=s.page;
await page.setViewportSize({width:1600,height:1100});
const VIS=`(e)=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);
  return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden'&&parseFloat(c.opacity)>0.01;}`;
const net=[]; page.on('request',r=>{const u=r.url(); if(/\/api\//.test(u)) net.push({m:r.method(),u:u.replace(/^https?:\/\/[^/]+/,'')});});
const seen=()=>{const c=net.slice(); net.length=0; return c;};
const api=(p)=>page.evaluate(async({api,p})=>{const r=await fetch(`https://${api}${p}`,{credentials:'include',headers:{Accept:'application/json'}});
  const t=await r.text();let j=null;try{j=JSON.parse(t)}catch(e){}return{status:r.status,json:j,text:t.slice(0,600)};},{api:API,p});
const raw=(p)=>page.evaluate(async({api,p})=>{const r=await fetch(`https://${api}${p}`,{credentials:'include'});
  const t=await r.text(); return {status:r.status,len:t.length,body:t};},{api:API,p});
const rowsOf=(j)=>{const pick=o=>{for(const k of ['collection','data','rows','items','results']){if(Array.isArray(o&&o[k]))return o[k];}
  if(Array.isArray(o))return o; for(const k of Object.keys(o||{})){const v=pick(o[k]); if(v&&v.length)return v;} return [];};return pick(j);};
const stored=async()=>{const r=await api('/api/organizations/invoice-settings/view');
  const d=(r.json&&(r.json.data||r.json))||{}; return d.documentDesign||null;};
const bar=()=>page.evaluate(vis=>{const isVis=eval(vis);const t=e=>(e.innerText||'').replace(/\s+/g,' ').trim();
  return [...document.querySelectorAll('button,.q-btn')].filter(isVis).map(t).find(x=>/Staging .* - \d+/.test(x))||null;},VIS);
const openInvoiceTab=async()=>{await page.goto(`${APP}/administration/settings`,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForTimeout(6000);
  await page.evaluate(vis=>{const isVis=eval(vis);const t=e=>(e.innerText||'').replace(/\s+/g,' ').trim();
    const el=[...document.querySelectorAll('a,div,[role=tab],.q-tab')].filter(isVis).find(e=>t(e)==='Invoice'); if(el)el.click();},VIS);
  await page.waitForTimeout(5000);};
const setDesign=async(want)=>{ if((await stored())===want.toLowerCase()) return want.toLowerCase();
  for(let i=0;i<3;i++){ await openInvoiceTab();
    await page.evaluate(vis=>{const isVis=eval(vis);
      const f=[...document.querySelectorAll('.q-field,.q-select')].filter(isVis).find(x=>/invoice design/i.test(x.innerText||''));
      if(f)(f.querySelector('input')||f).click();},VIS);
    await page.waitForTimeout(2200);
    await page.evaluate(({vis,want})=>{const isVis=eval(vis);
      const o=[...document.querySelectorAll('.q-menu .q-item,[role=option]')].filter(isVis).find(e=>new RegExp(want,'i').test(e.innerText||'')); if(o)o.click();},{vis:VIS,want});
    await page.waitForTimeout(2400);
    await page.evaluate(({vis,want})=>{const isVis=eval(vis);const t=e=>(e.innerText||'').trim();
      const d=[...document.querySelectorAll('.q-dialog')].filter(isVis).pop(); if(!d)return;
      const bs=[...d.querySelectorAll('button')].filter(isVis);
      const b=bs.find(e=>new RegExp('switch to '+want,'i').test(t(e)))||bs.find(e=>/^(Switch|Confirm|Yes)/i.test(t(e))); if(b)b.click();},{vis:VIS,want});
    await page.waitForTimeout(7500);
    const now=await stored(); if(now===want.toLowerCase()) return now;
    log('  setDesign(%s) attempt %d -> %s', want, i+1, now); }
  return await stored();};
const look=(html)=>{const t=html.replace(/<script[\s\S]*?<\/script>/gi,' ').replace(/<style[\s\S]*?<\/style>/gi,' ').replace(/<[^>]+>/g,'\n');
  return {len:html.length, ibs:/IBS#/.test(t), sentence:/Bill To|Remit payment to|Line Total/.test(t),
    caps:/SCOPE OF WORK|BILL TO|REMIT PAYMENT TO|SUMMARY/.test(t),
    docNo:(t.match(/\b(?:INV|EST|CR|CM)-[A-Z0-9-]+/)||[])[0]||null,
    moneySorted:(t.match(/\$-?[\d,]+\.\d{2}/g)||[]).sort(),
    head:t.split('\n').map(x=>x.trim()).filter(Boolean).slice(0,12).join(' | ')};};

await page.waitForTimeout(9000);
R.location=await bar(); R.stored=await stored();
log('location: %s | setting: %s', R.location, R.stored);

// ===== C53521: the setting on the SECOND location =====
await openInvoiceTab();
R.c53521={location:await bar(),
  onScreen:await page.evaluate(vis=>{const isVis=eval(vis);
    const f=[...document.querySelectorAll('.q-field,.q-select')].filter(isVis).find(x=>/invoice design/i.test(x.innerText||''));
    const i=f&&f.querySelector('input'); return i?i.value:null;},VIS),
  copies:await page.evaluate(vis=>{const isVis=eval(vis);
    return [...document.querySelectorAll('.q-field,.q-select,.q-toggle')].filter(isVis)
      .filter(x=>/invoice design|legacy invoice layout/i.test(x.innerText||'')).length;},VIS),
  stored:await stored()};
log('C53521 on %s: reads "%s", %d copy of the control, stored=%s',
  R.c53521.location, R.c53521.onScreen, R.c53521.copies, R.c53521.stored);
await page.screenshot({path:`${DIR}/evidence/P28-setting-lethbridge.png`});
save();

// ===== find the credit documents on this customer =====
seen();
await page.goto(`${APP}/customers/${CUST}/invoices`,{waitUntil:'domcontentloaded',timeout:60000});
await page.waitForTimeout(14000);
R.custPage={url:page.url(), calls:seen().filter(c=>/invoice|credit|memo/i.test(c.u)).map(c=>c.m+' '+c.u).slice(-10),
  rows:await page.evaluate(()=>[...document.querySelectorAll('tbody tr')].map(r=>(r.innerText||'').replace(/\s+/g,' ').slice(0,170))),
  text:await page.evaluate(()=>(document.body.innerText||'').replace(/\s+/g,' ').slice(0,900))};
log('customer invoices: %d rows', R.custPage.rows.length);
for(const r of R.custPage.rows) log('   |', r);
log('calls:', JSON.stringify(R.custPage.calls));
await page.screenshot({path:`${DIR}/evidence/P28-customer-invoices.png`, fullPage:true});
save();

// the API list, scoped to this location now
const inv=rowsOf((await api('/api/invoices/list?limit=300')).json);
R.invoiceNumbers=inv.map(i=>i.invoice_number).slice(0,40);
R.creditish=inv.filter(i=>/^C|CR|CM|credit/i.test(String(i.invoice_number))||/credit/i.test(String(i.status)));
log('invoices at this location: %d | credit-looking: %s', inv.length, JSON.stringify(R.creditish.slice(0,6)).slice(0,600));
save();
log('done'); await s.browser.close(); process.exit(0);
