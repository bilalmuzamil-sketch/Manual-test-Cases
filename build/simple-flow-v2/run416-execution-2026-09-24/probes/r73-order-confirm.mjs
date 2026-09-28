// Two things, carefully.
//  1. Does ordering ask for confirmation first? I checked with ONE snapshot last time, which is the
//     exact mistake I have made repeatedly. Add a part, order it, and POLL for the dialog.
//  2. C53487 - a vendor can be corrected until a part is received, then it is fixed. The new purchase
//     order reads "Vendor missing on 4 parts", so: assign a vendor, receive ONE part, then look at
//     whether the vendor can still be changed.
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import { openWo } from './lib3.mjs';
import fs from 'fs';
const APP='https://app.shopview.com';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const WO='281adfa7-5925-4718-936d-91d12cda3873';
const {browser,page}=await bootProdLogin('/workorders',{settle:13000,viewport:{width:1680,height:1000},deviceScaleFactor:2});
page.setDefaultTimeout(30000);
const R={};
const dlg=async()=>await page.evaluate(()=>{const d=[...document.querySelectorAll('.q-dialog')].filter(x=>{const r=x.getBoundingClientRect();return r.width>150&&r.height>100;}).pop();
  if(!d)return null; return {text:(d.innerText||'').replace(/\s+/g,' ').trim().slice(0,420),
    inputs:[...d.querySelectorAll('input')].filter(i=>i.getBoundingClientRect().width).map((i,ix)=>({ix,label:((i.closest('.q-field')||{}).innerText||'').replace(/\s+/g,' ').trim().slice(0,40),val:i.value})),
    buttons:[...d.querySelectorAll('button,.q-btn')].filter(e=>e.getBoundingClientRect().width)
      .map(e=>({t:(e.innerText||'').replace(/\s+/g,' ').trim(),disabled:/disabled/.test(e.className||'')})).filter(b=>b.t)};});
const poll=async(ms=15000)=>{const t0=Date.now();while(Date.now()-t0<ms){const x=await dlg();if(x)return x;await page.waitForTimeout(700);}return null;};
await openWo(page,WO); await page.waitForTimeout(9000);
// add one orderable part
console.log('adding one more orderable part');
await page.evaluate(()=>{const all=[...document.querySelectorAll('*')].filter(x=>/^\+?\s*Add Part$/i.test((x.textContent||'').trim())&&x.getBoundingClientRect().width)
    .sort((a,b)=>b.getBoundingClientRect().y-a.getBoundingClientRect().y); if(all.length){all[0].scrollIntoView({block:'center'});all[0].click();}});
await page.waitForTimeout(4500);
const put=async(src,val)=>{const ix=await page.evaluate((s)=>{const re=new RegExp(s,'i');
    const i=[...document.querySelectorAll('input')].filter(x=>x.getBoundingClientRect().width);
    return i.findIndex(x=>re.test(((x.closest('.q-field')||{}).innerText||'')+' '+(x.getAttribute('placeholder')||'')));},src);
  if(ix<0)return; const b=page.locator('input:visible').nth(ix);
  await b.click({timeout:9000}).catch(()=>{}); await b.fill('').catch(()=>{}); await b.type(val,{delay:40}); await page.waitForTimeout(2000);};
await put('Part number','ZZAUTOTEST-CONFIRM'); await page.keyboard.press('Escape').catch(()=>{});
await put('Description','ZZAUTOTEST confirm check'); await put('^Qty','1'); await put('Sell price','15');
await page.evaluate(()=>{const b=[...document.querySelectorAll('button,.q-btn')].filter(e=>e.getBoundingClientRect().width&&!/disabled/.test(e.className||''))
  .find(e=>/^(Save|Add)$/i.test((e.innerText||'').trim())); if(b)b.click();});
await page.waitForTimeout(6000); await page.reload({waitUntil:'domcontentloaded'}); await page.waitForTimeout(9000);
// order it from the row, polling for a confirmation
const row=await page.evaluate(()=>{const t=[...document.querySelectorAll('tr')].find(x=>/ZZAUTOTEST-CONFIRM/.test(x.innerText||''));
  if(!t)return null; const b=[...t.querySelectorAll('button,.q-btn')].find(e=>/^Order$/i.test((e.innerText||'').trim())&&e.getBoundingClientRect().width);
  if(!b)return 'no Order on it'; const r=b.getBoundingClientRect(); return {x:Math.round(r.x+r.width/2),y:Math.round(r.y+r.height/2)};});
console.log('the new part\'s Order control:',JSON.stringify(row));
if(row && row.x){ await page.mouse.click(row.x,row.y);
  R.confirm=await poll(15000);
  R.asksFirst=!!R.confirm;
  console.log('\n>>> ordering asks for confirmation first:',R.asksFirst);
  if(R.confirm){ console.log('    it says:',JSON.stringify(R.confirm.text.slice(0,300)));
    console.log('    buttons:',JSON.stringify(R.confirm.buttons.map(b=>b.t+(b.disabled?' [disabled]':''))));
    await page.screenshot({path:`${EV}/r73-confirm.png`}).catch(()=>{});
    await page.evaluate(()=>{const q=[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width>150).pop();
      const b=[...q.querySelectorAll('button,.q-btn')].filter(e=>e.getBoundingClientRect().width&&!/disabled/.test(e.className||''))
        .find(e=>/^(Order|Confirm|Yes|Place Order|Create)$/i.test((e.innerText||'').trim())); if(b)b.click();});
    await page.waitForTimeout(6000); }
  else {
    // positive control - the same poller finds a dialog when one genuinely opens
    const pc=await page.evaluate(()=>{const t=[...document.querySelectorAll('tr[class*="line-row-"]')][0];
      const b=[...t.querySelectorAll('button,.q-btn')].find(e=>/^Complete$/i.test((e.innerText||'').trim())); if(b){b.click();return 'opened something else';} return 'nothing to test with';});
    const got=await poll(9000);
    console.log('    positive control -',pc,'- the poller found a dialog:',!!got);
    if(got) await page.keyboard.press('Escape'); }
}
// --- C53487: assign a vendor, receive one part, then see if the vendor is still changeable ---
await page.goto(`${APP}/parts/orders`,{waitUntil:'domcontentloaded'}); await page.waitForTimeout(9000);
const poRow=await page.evaluate(()=>{const t=[...document.querySelectorAll('tbody tr')].find(x=>/Vendor missing/i.test(x.innerText||''));
  if(!t)return null; const td=[...t.querySelectorAll('td')][1]; const r=td.getBoundingClientRect();
  return {t:(t.innerText||'').replace(/\s+/g,' ').slice(0,90),x:Math.round(r.x+r.width/2),y:Math.round(r.y+r.height/2)};});
console.log('\na purchase order with no vendor:',JSON.stringify(poRow&&poRow.t));
if(poRow){ await page.mouse.click(poRow.x,poRow.y); await page.waitForTimeout(8000);
  R.detailUrl=page.url();
  R.detail=await page.evaluate(()=>{const t=document.body.innerText.replace(/\s+/g,' ');
    return {vendorMissing:/Vendor missing|Assign Vendor/i.test(t),
      fields:[...document.querySelectorAll('.q-field')].filter(e=>e.getBoundingClientRect().width).map(f=>(f.innerText||'').replace(/\s+/g,' ').trim().slice(0,45)),
      buttons:[...document.querySelectorAll('button,.q-btn')].filter(e=>e.getBoundingClientRect().width).map(e=>(e.innerText||'').replace(/\s+/g,' ').trim()).filter(Boolean).slice(0,16)};});
  console.log('   the purchase order page:',R.detailUrl);
  console.log('   fields :',JSON.stringify(R.detail.fields));
  console.log('   buttons:',JSON.stringify(R.detail.buttons));
  console.log('   it is asking for a vendor:',R.detail.vendorMissing);
  await page.screenshot({path:`${EV}/r73-po-detail.png`,fullPage:true}).catch(()=>{}); }
fs.writeFileSync(`${EV}/r73-order-confirm.json`,JSON.stringify(R,null,1));
await browser.close();
