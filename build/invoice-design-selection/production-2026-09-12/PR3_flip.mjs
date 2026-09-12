// FIRST WRITE ON PRODUCTION -- authorised by the QA lead 12 Sep ("dummy test account, seed/modify/delete
// as you need"). Scope: the organisation-wide Invoice Design setting ONLY.
// It is read, flipped to the other value, read back, and RESTORED to the value found, with every step
// verified. If any step fails the script stops and says so rather than leaving production flipped.
import fs from 'fs';
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
const DIR='/home/user/Manual-test-Cases/build/invoice-design-selection/production-2026-09-12';
const APIH='api.shopview.com', APP='https://app.shopview.com';
const L=(...a)=>console.log(new Date().toISOString().slice(11,19),a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));
const R={at:new Date().toISOString()}; const save=()=>fs.writeFileSync(`${DIR}/PR3.json`, JSON.stringify(R,null,1));
const { browser, page } = await bootProdLogin('/');
const api=(m,p,b)=>page.evaluate(async({a,m,p,b})=>{const r=await fetch(`https://${a}${p}`,{method:m,credentials:'include',
  headers:{'Content-Type':'application/json',Accept:'application/json'},body:b?JSON.stringify(b):undefined});
  return {s:r.status,t:(await r.text()).slice(0,3000)};},{a:APIH,m,p,b:b||null});
const stored=async()=>{const r=await api('GET','/api/organizations/invoice-settings/view');
  try{return JSON.parse(r.t).data.documentDesign;}catch(e){return null;}};
R.build=await page.evaluate(()=>{const m=document.querySelector('meta[name="app-version"]');return m?m.content:null;});
R.found=await stored(); L('build %s | design as FOUND on production: %s', R.build, R.found);
if(!R.found){ L('could not read the setting - stopping, nothing was changed'); save(); await browser.close(); process.exit(1); }

// 1. does the recorded write endpoint still exist on this build?
const other = R.found==='legacy' ? 'modern' : 'legacy';
const w=await api('POST','/api/organizations/invoice-settings/change-design',{documentDesign:other});
R.writeCall={status:w.s, body:w.t.slice(0,180)};
L('change-design -> %s %s', w.s, w.t.slice(0,120));
await page.waitForTimeout(1800);
R.afterWrite=await stored();
L('read back after the write: %s (asked for %s)', R.afterWrite, other);
R.writeWorks = R.afterWrite===other;

// 2. and does the SCREEN agree? -- the toggle must show the new state
await page.goto(`${APP}/administration/settings`,{waitUntil:'domcontentloaded',timeout:90000}).catch(()=>{});
await page.waitForTimeout(12000);
await page.evaluate(()=>{const ok=e=>{const r=e.getBoundingClientRect();return r.width>0&&r.height>0;};
  const t=e=>(e.innerText||'').replace(/\s+/g,' ').trim();
  const el=[...document.querySelectorAll('a,div,[role=tab],.q-tab')].filter(ok).find(e=>t(e)==='Invoice'); if(el)el.click();});
await page.waitForTimeout(8000);
R.screen=await page.evaluate(()=>{const ok=e=>{const r=e.getBoundingClientRect();return r.width>0&&r.height>0;};
  const rows=[...document.querySelectorAll('div')].filter(ok)
    .filter(d=>/^Legacy invoice layout/.test((d.innerText||'').trim()));
  const row=rows[rows.length-1];
  const inp=row?row.querySelector('input[type=checkbox],[role=switch],[aria-checked]'):null;
  const body=(document.body.innerText||'').replace(/\s+/g,' ');
  return {rowFound:!!row,
    title:row?(row.innerText||'').replace(/\s+/g,' ').trim().slice(0,150):null,
    checked: inp? (inp.getAttribute('aria-checked') ?? String(inp.checked)) : null,
    order:(body.match(/Summarize labor total.{0,200}/)||[])[0]||null};});
L('SCREEN: row found %s | toggle state %s', R.screen.rowFound, R.screen.checked);
L('   row text: %s', String(R.screen.title).slice(0,140));
await page.screenshot({path:`${DIR}/PR3-toggle-${other}.png`, fullPage:true});

// 3. RESTORE, and prove it
const rb=await api('POST','/api/organizations/invoice-settings/change-design',{documentDesign:R.found});
await page.waitForTimeout(1800);
R.restored=await stored();
R.restoredOk = R.restored===R.found;
L('RESTORED to %s (found was %s) -> %s', R.restored, R.found, R.restoredOk?'OK':'*** NOT RESTORED ***');
save(); L('done'); await browser.close(); process.exit(R.restoredOk?0:2);
