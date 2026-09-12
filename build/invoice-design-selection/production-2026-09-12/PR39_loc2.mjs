// PRODUCTION -- C53543, second attempt at the location switch. "Change Location" is a SELECT
// ([data-test-id="select_location"]), not a menu item; clicking the label did nothing. Open the
// select itself and read the options it offers.
import fs from 'fs';
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
const DIR='/home/user/Manual-test-Cases/build/invoice-design-selection/production-2026-09-12';
const EV=`${DIR}/evidence`, APP='https://app.shopview.com';
const L=(...a)=>console.log(new Date().toISOString().slice(11,19),a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));
const R={at:new Date().toISOString(), case:'C53543'};
const save=()=>fs.writeFileSync(`${DIR}/PR39.json`, JSON.stringify(R,null,1));
const { browser, page } = await bootProdLogin('/');
const locNow=async()=>page.evaluate(()=>{const b=document.querySelector('[data-test-id="profile_menu_button"]');
  return b?(b.textContent||'').replace(/\s+/g,' ').trim().slice(0,26):null;});
R.locationStart=await locNow(); L('location %s', R.locationStart);
await page.evaluate(()=>{const b=document.querySelector('[data-test-id="profile_menu_button"]'); b&&b.click();});
await page.waitForTimeout(2500);
// open the select itself
const opened=await page.evaluate(()=>{const s=document.querySelector('[data-test-id="select_location"]');
  if(!s) return false; s.click(); return true;});
L('select_location clicked: %s', opened);
await page.waitForTimeout(3000);
await page.screenshot({path:`${EV}/PR39-select-open.png`, fullPage:true});
R.options=await page.evaluate(()=>{const ok=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
  return [...document.querySelectorAll('.q-menu .q-item, [role=option], .q-virtual-scroll__content .q-item')].filter(ok)
    .map(e=>(e.textContent||'').replace(/\s+/g,' ').trim()).filter(Boolean).slice(0,25);});
L('options: %s', JSON.stringify(R.options));
save();
const picked=await page.evaluate(()=>{const ok=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
  const it=[...document.querySelectorAll('.q-menu .q-item,[role=option]')].filter(ok)
    .find(e=>/Trucks?\s*Hill\s*2/i.test(e.textContent||''));
  if(!it) return null; it.click(); return (it.textContent||'').replace(/\s+/g,' ').trim().slice(0,40);});
L('picked: %s', picked);
R.picked=picked;
await page.waitForTimeout(6000);
await page.screenshot({path:`${EV}/PR39-after-pick.png`, fullPage:true});
// a confirm button may follow
R.dialog=await page.evaluate(()=>{const ok=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
  const d=[...document.querySelectorAll('.q-dialog,.q-menu')].filter(ok).pop(); if(!d) return null;
  return {text:(d.innerText||'').replace(/\s+/g,' ').slice(0,200),
    buttons:[...d.querySelectorAll('button')].filter(ok).map(b=>(b.innerText||'').replace(/\s+/g,' ').trim()).filter(Boolean)};});
L('dialog: %s', JSON.stringify(R.dialog));
if(R.dialog&&R.dialog.buttons.length){
  const go=R.dialog.buttons.find(b=>/save|confirm|change|apply|ok|yes/i.test(b)&&!/cancel/i.test(b));
  if(go){ await page.evaluate((lab)=>{const ok=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
    const d=[...document.querySelectorAll('.q-dialog,.q-menu')].filter(ok).pop();
    const b=[...d.querySelectorAll('button')].filter(ok).find(x=>(x.innerText||'').replace(/\s+/g,' ').trim()===lab);
    if(b) b.click();}, go); L('confirmed with "%s"', go); await page.waitForTimeout(12000); } }
await page.goto(`${APP}/workorders`,{waitUntil:'domcontentloaded',timeout:90000}).catch(()=>{});
await page.waitForTimeout(10000);
R.locationAfter=await locNow(); L('location now: %s', R.locationAfter);
await page.screenshot({path:`${EV}/PR39-final.png`, fullPage:true});
save(); await browser.close();
