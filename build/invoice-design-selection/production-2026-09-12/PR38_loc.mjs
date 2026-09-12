// PRODUCTION -- C53543. CM2-4398 is not listed from Truck Hill 1; CM1-3561 is. Two things here:
// (1) identify what CM1-3561 actually is (a work-order Credit Invoice or a Part Sale Credit --
//     they are different document types in this case and must not be conflated), and
// (2) switch location through the profile menu's own Change Location control (the QA lead pointed
//     at it directly) and reach CM2-4398 there.
import fs from 'fs';
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
const DIR='/home/user/Manual-test-Cases/build/invoice-design-selection/production-2026-09-12';
const EV=`${DIR}/evidence`, APP='https://app.shopview.com', APIH='api.shopview.com';
const CUST='01de15df-5651-4704-9450-0b94f4375f6b';
const L=(...a)=>console.log(new Date().toISOString().slice(11,19),a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));
const R={at:new Date().toISOString(), case:'C53543', net:[], steps:{}};
const save=()=>fs.writeFileSync(`${DIR}/PR38.json`, JSON.stringify(R,null,1));
const { browser, page } = await bootProdLogin('/');
page.on('request', r=>{const u=r.url(); if(/api\.shopview\.com/.test(u)) R.net.push({m:r.method(),u:u.replace('https://api.shopview.com','')});});
const call=(p)=>page.evaluate(async({a,p})=>{const r=await fetch(`https://${a}${p}`,{credentials:'include',headers:{Accept:'application/json'}});
  const t=await r.text(); let j=null; try{j=JSON.parse(t)}catch(e){} return {s:r.status,j,t:t.slice(0,200)};},{a:APIH,p});
const locNow=async()=>page.evaluate(()=>{const b=document.querySelector('[data-test-id="profile_menu_button"]');
  return b?(b.textContent||'').replace(/\s+/g,' ').trim().slice(0,30):null;});
R.build=await page.evaluate(()=>{const m=document.querySelector('meta[name="app-version"]');return m?m.content:null;});
R.locationStart=await locNow(); L('build %s location %s', R.build, R.locationStart);
// --- (1) what is CM1-3561?
await page.goto(`${APP}/customers/${CUST}/invoices`,{waitUntil:'domcontentloaded',timeout:90000}).catch(()=>{});
await page.waitForTimeout(13000);
R.steps.creditRows=await page.evaluate(()=>{const ok=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
  return [...document.querySelectorAll('tr')].filter(ok).map(tr=>(tr.textContent||'').replace(/\s+/g,' ').trim())
    .filter(t=>/CM\d?-/.test(t)).slice(0,10);});
L('credit rows here: %s', JSON.stringify(R.steps.creditRows));
const cm=await call('/api/credit-memos?limit=100');
R.steps.creditMemosApi={s:cm.s, sample:(()=>{try{const rows=cm.j.data||cm.j.collection||cm.j;
  return (Array.isArray(rows)?rows:[]).slice(0,12).map(x=>({id:x.id,n:x.number||x.credit_number,
    wo:x.work_order_id||null, ps:x.part_sale_id||null, shop:x.shop_id||x.shopId||null}));}catch(e){return cm.t;}})()};
L('credit-memos API: %s', JSON.stringify(R.steps.creditMemosApi).slice(0,500));
save();
// --- (2) switch location through the profile menu
await page.evaluate(()=>{const b=document.querySelector('[data-test-id="profile_menu_button"]'); b&&b.click();});
await page.waitForTimeout(2500);
await page.screenshot({path:`${EV}/PR38-profile-menu.png`, fullPage:true});
R.steps.menuItems=await page.evaluate(()=>{const ok=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
  return [...document.querySelectorAll('.q-menu .q-item,[role=menuitem],.q-menu button,.q-menu div')].filter(ok)
    .map(e=>({txt:(e.textContent||'').replace(/\s+/g,' ').trim().slice(0,45), tid:e.getAttribute('data-test-id')||null}))
    .filter(x=>/location|hill|change/i.test(x.txt)||/location/i.test(x.tid||'')).slice(0,12);});
L('location controls: %s', JSON.stringify(R.steps.menuItems));
const opened=await page.evaluate(()=>{const ok=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
  const it=[...document.querySelectorAll('.q-menu .q-item,[role=menuitem],.q-menu div,.q-menu button')].filter(ok)
    .find(e=>/Change Location/i.test((e.textContent||'')));
  if(!it) return false; it.click(); return true;});
L('Change Location clicked: %s', opened);
await page.waitForTimeout(3500);
await page.screenshot({path:`${EV}/PR38-location-picker.png`, fullPage:true});
R.steps.options=await page.evaluate(()=>{const ok=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
  return [...document.querySelectorAll('.q-menu .q-item,[role=option],.q-dialog .q-item,.q-dialog button,.q-list .q-item')].filter(ok)
    .map(e=>(e.textContent||'').replace(/\s+/g,' ').trim().slice(0,45)).filter(Boolean).slice(0,20);});
L('location options offered: %s', JSON.stringify(R.steps.options));
save();
const picked=await page.evaluate(()=>{const ok=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
  const it=[...document.querySelectorAll('.q-menu .q-item,[role=option],.q-dialog .q-item,.q-list .q-item')].filter(ok)
    .find(e=>/Trucks Hill 2/i.test((e.textContent||'')));
  if(!it) return null; it.click(); return (it.textContent||'').replace(/\s+/g,' ').trim().slice(0,40);});
L('picked: %s', picked);
await page.waitForTimeout(12000);
await page.screenshot({path:`${EV}/PR38-after-switch.png`, fullPage:true});
R.steps.locationAfter=await locNow();
L('location now: %s', R.steps.locationAfter);
save();
// --- look for CM2-4398 again
await page.goto(`${APP}/customers/${CUST}/invoices`,{waitUntil:'domcontentloaded',timeout:90000}).catch(()=>{});
await page.waitForTimeout(13000);
await page.screenshot({path:`${EV}/PR38-invoices-loc2.png`, fullPage:true});
R.steps.after=await page.evaluate(()=>{const t=(document.body.innerText||'').replace(/\s+/g,' ');
  return {has4398:t.includes('4398'), numbers:[...new Set(t.match(/\b(?:INV|CM|EST)\d?-\d+/g)||[])].slice(0,30)};});
L('after switch: CM2-4398 present=%s numbers=%s', R.steps.after.has4398, JSON.stringify(R.steps.after.numbers));
save(); await browser.close();
