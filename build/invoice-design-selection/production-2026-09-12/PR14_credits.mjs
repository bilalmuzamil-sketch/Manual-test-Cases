// PRODUCTION -- credit documents. The QA lead seeded a part sale credit (CM2-4398) on the customer
// below; this walks that customer's Invoices tab, finds the credit documents, and renders each under
// both designs. Guarded before and after every reading.
import fs from 'fs';
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
const DIR='/home/user/Manual-test-Cases/build/invoice-design-selection/production-2026-09-12';
const EV=`${DIR}/evidence`; fs.mkdirSync(EV,{recursive:true});
const APP='https://app.shopview.com', APIH='api.shopview.com';
const CUST='01de15df-5651-4704-9450-0b94f4375f6b';
const L=(...a)=>console.log(new Date().toISOString().slice(11,19),a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));
const R={at:new Date().toISOString(), rows:[], cap:{}, drift:[]};
const save=()=>fs.writeFileSync(`${DIR}/PR14.json`, JSON.stringify(R,null,1));
const { browser, ctx, page } = await bootProdLogin('/');
const call=(p)=>page.evaluate(async({a,p})=>{const r=await fetch(`https://${a}${p}`,{credentials:'include',headers:{Accept:'application/json'}});
  const t=await r.text(); let j=null; try{j=JSON.parse(t)}catch(e){} return {s:r.status,j};},{a:APIH,p});
const post=(p,b)=>page.evaluate(async({a,p,b})=>{const r=await fetch(`https://${a}${p}`,{method:'POST',credentials:'include',
  headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify(b)});return {s:r.status};},{a:APIH,p,b});
const stored=async()=>{for(let i=0;i<4;i++){const r=await call('/api/organizations/invoice-settings/view');
  try{const v=r.j.data.documentDesign; if(v) return v;}catch(e){} await page.waitForTimeout(900);} return null;};
const setDesign=async(w)=>{for(let i=0;i<4;i++){ if((await stored())===w) return w;
  await post('/api/organizations/invoice-settings/change-design',{documentDesign:w}); await page.waitForTimeout(1800);} return await stored();};
R.build=await page.evaluate(()=>{const m=document.querySelector('meta[name="app-version"]');return m?m.content:null;});
R.found=await stored(); L('build %s | design %s', R.build, R.found);
// walk the customer's Invoices tab
await page.goto(`${APP}/customers/${CUST}/invoices`,{waitUntil:'domcontentloaded',timeout:90000}).catch(()=>{});
await page.waitForTimeout(16000);
R.rows=await page.evaluate(()=>{const ok=e=>{const r=e.getBoundingClientRect();return r.width>0&&r.height>0;};
  return [...document.querySelectorAll('tr,[role=row]')].filter(ok)
    .map(r=>(r.innerText||'').replace(/\s+/g,' ').trim()).filter(t=>t.length>6).slice(0,25);});
L('rows on the customer Invoices tab: %d', R.rows.length);
R.rows.slice(0,12).forEach(r=>L('   %s', r.slice(0,95)));
await page.screenshot({path:`${EV}/PR14-customer-invoices.png`, fullPage:true});
save();
// open the seeded credit by its number
const target='CM2-4398';
const opened=await page.evaluate((num)=>{const ok=e=>{const r=e.getBoundingClientRect();return r.width>0&&r.height>0;};
  const tr=[...document.querySelectorAll('tr,[role=row]')].filter(ok).find(r=>(r.innerText||'').includes(num));
  if(!tr) return null; const c=tr.querySelector('td:nth-child(2)')||tr.querySelector('td')||tr; c.click();
  return (tr.innerText||'').replace(/\s+/g,' ').slice(0,90);}, target);
L('clicked the row for %s: %s', target, opened);
await page.waitForTimeout(12000);
R.afterClick={url:page.url(), text:await page.evaluate(()=>(document.body.innerText||'').replace(/\s+/g,' ').slice(0,300))};
L('url after click: %s', R.afterClick.url.slice(0,110));
L('page: %s', R.afterClick.text.slice(0,220));
await page.screenshot({path:`${EV}/PR14-credit-open.png`, fullPage:true});
save();
L('done'); await browser.close(); process.exit(0);
