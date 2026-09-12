// PRODUCTION -- READ ONLY inventory. Nothing created, changed or deleted.
// (a) prove the Invoice Design control is really on the screen, not just in an API reply
// (b) name the organisation and its locations
// (c) find, for every kind of paperwork the suite checks, a record that already exists
import fs from 'fs';
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
const DIR='/home/user/Manual-test-Cases/build/invoice-design-selection/production-2026-09-12';
const APIH='api.shopview.com', APP='https://app.shopview.com';
const L=(...a)=>console.log(new Date().toISOString().slice(11,19),a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));
const R={readOnly:true, at:new Date().toISOString()};
const save=()=>fs.writeFileSync(`${DIR}/PR2.json`, JSON.stringify(R,null,1));
const { browser, page } = await bootProdLogin('/');
const api=(m,p,b)=>page.evaluate(async({a,m,p,b})=>{const r=await fetch(`https://${a}${p}`,{method:m,credentials:'include',
  headers:{'Content-Type':'application/json',Accept:'application/json'},body:b?JSON.stringify(b):undefined});
  return {s:r.status,t:(await r.text()).slice(0,20000)};},{a:APIH,m,p,b:b||null});
const J=r=>{try{return JSON.parse(r.t);}catch(e){return null;}};
R.build=await page.evaluate(()=>{const m=document.querySelector('meta[name="app-version"]');return m?m.content:null;});
L('build %s', R.build);

// (a) THE CONTROL, ON THE SCREEN
await page.goto(`${APP}/administration/settings`,{waitUntil:'domcontentloaded',timeout:90000}).catch(()=>{});
await page.waitForTimeout(13000);
R.settingsTabs=await page.evaluate(()=>{const ok=e=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden';};
  return [...document.querySelectorAll('a,[role=tab],.q-tab,div')].filter(ok)
    .map(e=>(e.innerText||'').replace(/\s+/g,' ').trim()).filter(t=>t&&t.length<22).slice(0,40);});
await page.evaluate(()=>{const ok=e=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden';};const t=e=>(e.innerText||'').replace(/\s+/g,' ').trim();
  const el=[...document.querySelectorAll('a,div,[role=tab],.q-tab')].filter(ok).find(e=>t(e)==='Invoice'); if(el)el.click();});
await page.waitForTimeout(9000);
R.invoiceTab=await page.evaluate(()=>{const ok=e=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden';};const t=e=>(e.innerText||'').replace(/\s+/g,' ').trim();
  const body=(document.body.innerText||'').replace(/\s+/g,' ');
  return {hasDesignWords:/Design|Legacy|Modern/i.test(body),
    controls:[...document.querySelectorAll('.q-field,.q-select,.q-toggle,select,[role=radiogroup]')].filter(ok)
      .map(e=>t(e).slice(0,70)).filter(Boolean).slice(0,20),
    bodyExtract:(body.match(/.{0,90}(Design|Legacy|Modern).{0,90}/i)||[])[0]||null};});
L('Settings tabs seen: %s', JSON.stringify(R.settingsTabs).slice(0,260));
L('Invoice tab -> design words on screen: %s', R.invoiceTab.hasDesignWords);
L('   extract: %s', R.invoiceTab.bodyExtract);
L('   controls: %s', JSON.stringify(R.invoiceTab.controls).slice(0,320));
await page.screenshot({path:`${DIR}/PR2-settings-invoice.png`, fullPage:true});
const st=J(await api('GET','/api/organizations/invoice-settings/view'));
R.designFound = st && st.data ? st.data.documentDesign : null;
L('stored documentDesign (THE VALUE TO RESTORE AT THE END): %s', R.designFound);
save();

// (b) WHO WE ARE
const od=J(await api('GET','/api/organization/organization-details/view'));
R.org = od && (od.data||od) ? {name:(od.data||od).name, id:(od.data||od).id, tax:(od.data||od).tax_code} : null;
L('organisation: %s', JSON.stringify(R.org));
R.topBar=await page.evaluate(()=>{const ok=e=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden';};const t=e=>(e.innerText||'').replace(/\s+/g,' ').trim();
  return [...document.querySelectorAll('button,.q-btn')].filter(ok).map(t).find(x=>/ - \d+|Location/.test(x))||null;});
L('location shown in the top bar: %s', R.topBar);

// (c) WHAT PAPERWORK ALREADY EXISTS -- walk the work-order list screens the app itself uses
const counts={};
for (const s of ['estimate','open','paid','invoiced','completed']){
  await page.goto(`${APP}/workorders?status=${s}`,{waitUntil:'domcontentloaded',timeout:90000}).catch(()=>{});
  await page.waitForTimeout(11000);
  const rows=await page.evaluate(()=>{const ok=e=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden';};
    return [...document.querySelectorAll('tr,[role=row]')].filter(ok)
      .map(r=>(r.innerText||'').replace(/\s+/g,' ').trim())
      .filter(t=>/S\d?-\d+/.test(t)).slice(0,4);});
  counts[s]={shown:rows.length, samples:rows.map(t=>t.slice(0,70))};
  L('work orders [%s]: %d row(s) | %s', s, rows.length, JSON.stringify(rows[0]||'').slice(0,90));
}
R.workOrders=counts;
await page.screenshot({path:`${DIR}/PR2-workorders.png`, fullPage:true});
save();
L('done'); await browser.close(); process.exit(0);
