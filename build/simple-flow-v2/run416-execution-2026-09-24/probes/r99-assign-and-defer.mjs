// C53489 continued. The ordered A158 shows "Vendor missing", and Receive later is offered per vendor
// group - so assign a vendor first, then defer the part and watch its core.
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import { openWo } from './lib3.mjs';
import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const WO='281adfa7-5925-4718-936d-91d12cda3873';
const {browser,page}=await bootProdLogin('/workorders',{settle:13000,viewport:{width:1680,height:1000},deviceScaleFactor:2});
page.setDefaultTimeout(30000);
const R={};
const rows=async()=>await page.evaluate(()=>[...document.querySelectorAll('tr')].filter(t=>t.getBoundingClientRect().height)
  .map(t=>{const b=[...t.querySelectorAll('button,.q-btn')].filter(e=>e.getBoundingClientRect().width)
      .map(e=>{const r=e.getBoundingClientRect();return {t:(e.innerText||'').replace(/\s+/g,' ').trim(),x:Math.round(r.x+r.width/2),y:Math.round(r.y+r.height/2)};})
      .filter(a=>a.t&&!/drag_indicator/.test(a.t));
    return {t:(t.innerText||'').replace(/\s+/g,' ').trim().slice(0,96),actions:b};}).filter(r=>r.t));
const offers=async()=>await page.evaluate(()=>{const q=[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width>200).pop();
  if(!q)return null; const all=[...q.querySelectorAll('button,.q-btn,.q-item,a')].filter(e=>e.getBoundingClientRect().width);
  return {text:(q.innerText||'').replace(/\s+/g,' ').trim().slice(0,520),
    controls:[...new Set(all.map(e=>(e.innerText||'').replace(/\s+/g,' ').trim()).filter(t=>t&&t.length<44))],
    rows:[...q.querySelectorAll('tr')].filter(t=>t.getBoundingClientRect().height).map(t=>(t.innerText||'').replace(/\s+/g,' ').trim().slice(0,80))};});
await openWo(page,WO); await page.waitForTimeout(9000);
const rr=await rows();
const t=rr.find(r=>/\(1237944\)/.test(r.t)&&/Awaiting Receive/i.test(r.t));
const rec=t&&t.actions.find(a=>/^Receive$/i.test(a.t));
if(!rec){ console.log('A158 is not awaiting receipt now'); await browser.close(); process.exit(0); }
await page.mouse.click(rec.x,rec.y); await page.waitForTimeout(7000);
// assign a vendor
const opened=await page.evaluate(()=>{const q=[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width>200).pop();
  const f=[...q.querySelectorAll('.q-field,.q-select')].find(x=>/Assign Vendor|Vendor/i.test(x.innerText||''));
  if(!f)return 'no vendor field'; f.click(); return 'opened the vendor list';});
console.log(opened); await page.waitForTimeout(3000);
const chose=await page.evaluate(()=>{const m=[...document.querySelectorAll('.q-menu .q-item')].filter(e=>e.getBoundingClientRect().width);
  if(!m.length)return 'no vendor list appeared';
  const names=m.map(e=>(e.innerText||'').replace(/\s+/g,' ').trim().slice(0,28));
  m[0].click(); return 'chose "'+names[0]+'" out of '+m.length+': '+names.slice(0,6).join(', ');});
console.log(chose); await page.waitForTimeout(4000);
let o=await offers();
console.log('\nthe window now says:',JSON.stringify(o&&o.text.slice(0,330)));
console.log('what it offers:',JSON.stringify(o&&o.controls));
await page.screenshot({path:`${EV}/r99-vendor-assigned.png`}).catch(()=>{});
R.afterVendor=o;
// tick the part
console.log('\n',await page.evaluate(()=>{const q=[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width>200).pop();
  const boxes=[...q.querySelectorAll('.q-checkbox')].filter(e=>e.getBoundingClientRect().width);
  if(!boxes.length)return 'no tick boxes'; boxes[boxes.length-1].click(); return 'ticked the part';}));
await page.waitForTimeout(2500);
o=await offers(); R.afterTick=o;
console.log('now it offers:',JSON.stringify(o&&o.controls));
const later=await page.evaluate(()=>{const q=[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width>200).pop();
  const all=[...q.querySelectorAll('button,.q-btn,.q-item,a')].filter(e=>e.getBoundingClientRect().width);
  const b=all.find(e=>/receive\s*later|received\s*later/i.test((e.innerText||'').replace(/\s+/g,' ').trim()));
  if(!b)return 'Receive later is still not offered';
  if(/disabled/.test(b.className||''))return 'Receive later is there but not pressable';
  b.click(); return 'pressed Receive later';});
console.log(' ',later); await page.waitForTimeout(6000);
for(let i=0;i<2;i++){ const d=await offers(); if(!d){console.log('  the window closed');break;}
  console.log('  still up:',JSON.stringify(d.text.slice(0,180)));
  const go=await page.evaluate(()=>{const q=[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width>150).pop();
    const c=[...q.querySelectorAll('button,.q-btn')].filter(e=>e.getBoundingClientRect().width)
      .map(e=>({e,t:(e.innerText||'').replace(/\s+/g,' ').trim(),dis:/disabled/.test(e.className||'')}))
      .filter(x=>/confirm|yes|ok$|receive later|save/i.test(x.t));
    if(!c.length)return 'no confirm offered'; const b=c[c.length-1];
    if(b.dis)return '"'+b.t+'" is not pressable'; b.e.click(); return 'pressed "'+b.t+'"';});
  console.log('  ',go); if(/no confirm/.test(go))break; await page.waitForTimeout(5000); }
R.toast=await page.evaluate(()=>[...document.querySelectorAll('.q-notification,[role=alert]')].map(e=>(e.innerText||'').trim()).filter(Boolean));
console.log('message:',JSON.stringify(R.toast));
await page.keyboard.press('Escape').catch(()=>{});
await page.goto(`https://app.shopview.com/workorders/${WO}/lines`,{waitUntil:'domcontentloaded'}); await page.waitForTimeout(11000);
R.after=(await rows()).filter(r=>/1237944|Core|later/i.test(r.t)).map(r=>r.t+'  ->  '+r.actions.map(a=>a.t).join('|'));
console.log('\nafter:'); R.after.forEach(x=>console.log('  ',x));
await page.screenshot({path:`${EV}/r99-after.png`,fullPage:true}).catch(()=>{});
fs.writeFileSync(`${EV}/r99-assign-and-defer.json`,JSON.stringify(R,null,1));
await browser.close();
