// (a) Prove properly that ordering asks for NO confirmation. A negative needs a positive control with
//     the SAME poller on the SAME page: pressing Complete on a line with outstanding parts does open
//     a window, so if the poller sees that and not an order confirmation, the difference is the
//     product's, not my instrument's.
// (b) C53487 - assign a vendor to the purchase order, receive ONE part, then check whether the vendor
//     can still be changed afterwards.
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import { openWo } from './lib3.mjs';
import fs from 'fs';
const APP='https://app.shopview.com';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const WO='281adfa7-5925-4718-936d-91d12cda3873';
const PO='806dcdca-eb70-4634-acb5-7bcb3ecdd7b8';
const {browser,page}=await bootProdLogin('/workorders',{settle:13000,viewport:{width:1680,height:1000},deviceScaleFactor:2});
page.setDefaultTimeout(30000);
const R={};
const dlg=async()=>await page.evaluate(()=>{const d=[...document.querySelectorAll('.q-dialog')].filter(x=>{const r=x.getBoundingClientRect();return r.width>150&&r.height>100;}).pop();
  if(!d)return null; return {text:(d.innerText||'').replace(/\s+/g,' ').trim().slice(0,320),
    inputs:[...d.querySelectorAll('input')].filter(i=>i.getBoundingClientRect().width).map((i,ix)=>({ix,label:((i.closest('.q-field')||{}).innerText||'').replace(/\s+/g,' ').trim().slice(0,45),val:i.value})),
    buttons:[...d.querySelectorAll('button,.q-btn')].filter(e=>e.getBoundingClientRect().width)
      .map(e=>({t:(e.innerText||'').replace(/\s+/g,' ').trim(),disabled:/disabled/.test(e.className||'')})).filter(b=>b.t)};});
const poll=async(ms=14000)=>{const t0=Date.now();while(Date.now()-t0<ms){const x=await dlg();if(x)return x;await page.waitForTimeout(700);}return null;};

// ---- (a) positive control THEN the order ----
await openWo(page,WO); await page.waitForTimeout(9000);
const ctl=await page.evaluate(()=>{const r=[...document.querySelectorAll('tr[class*="line-row-"]')]
    .find(x=>[...x.querySelectorAll('button,.q-btn')].some(b=>/^Complete$/i.test((b.innerText||'').trim())));
  if(!r)return 'no Complete to test with';
  const b=[...r.querySelectorAll('button,.q-btn')].find(x=>/^Complete$/i.test((x.innerText||'').trim())); b.click(); return 'pressed Complete';});
console.log('positive control:',ctl);
const got=await poll(12000);
R.controlOpened=!!got;
console.log('   the poller sees a window from Complete:',R.controlOpened, got?JSON.stringify(got.text.slice(0,70)):'');
if(got){ await page.keyboard.press('Escape'); await page.waitForTimeout(1800); }
await page.reload({waitUntil:'domcontentloaded'}); await page.waitForTimeout(8000);
// now an order, with the same poller
const ord=await page.evaluate(()=>{const t=[...document.querySelectorAll('tr')].find(x=>/Auth To Order/.test(x.innerText||''));
  if(!t)return 'nothing left to order';
  const b=[...t.querySelectorAll('button,.q-btn')].find(e=>/^Order$/i.test((e.innerText||'').trim())&&e.getBoundingClientRect().width);
  if(!b)return 'no Order control'; b.click(); return 'pressed Order on '+(t.innerText||'').replace(/\s+/g,' ').slice(0,45);});
console.log('\n',ord);
if(/pressed/.test(ord)){
  const c=await poll(14000);
  R.orderConfirms=!!c;
  console.log('   ordering opens a confirmation:',R.orderConfirms, c?JSON.stringify(c.text.slice(0,120)):'');
  if(c) await page.keyboard.press('Escape');
} else R.orderConfirms=null;
console.log('\n>>> same poller, same page: Complete opens a window =',R.controlOpened,'| Order opens one =',R.orderConfirms);

// ---- (b) vendor on the purchase order ----
await page.goto(`${APP}/order/${PO}`,{waitUntil:'domcontentloaded'}); await page.waitForTimeout(9000);
R.poBefore=await page.evaluate(()=>({text:document.body.innerText.replace(/\s+/g,' ').slice(0,260),
  vendorControls:[...document.querySelectorAll('.q-field,.q-select,button,.q-btn')].filter(e=>e.getBoundingClientRect().width&&/vendor/i.test(e.innerText||''))
    .map(e=>{const r=e.getBoundingClientRect();return {t:(e.innerText||'').replace(/\s+/g,' ').trim().slice(0,40),x:Math.round(r.x+r.width/2),y:Math.round(r.y+r.height/2)};})}));
console.log('\nthe purchase order page mentions vendor at:',JSON.stringify(R.poBefore.vendorControls.map(v=>v.t)));
const rec=await page.evaluate(()=>{const b=[...document.querySelectorAll('button,.q-btn')].find(e=>/^Receive$/i.test((e.innerText||'').trim())&&e.getBoundingClientRect().width);
  if(!b)return 'no Receive'; b.click(); return 'pressed Receive';});
console.log(' ',rec); await page.waitForTimeout(8000);
R.receiveView=await page.evaluate(()=>({url:location.href,
  fields:[...document.querySelectorAll('.q-field')].filter(e=>e.getBoundingClientRect().width).map(f=>(f.innerText||'').replace(/\s+/g,' ').trim().slice(0,45)),
  buttons:[...document.querySelectorAll('button,.q-btn')].filter(e=>e.getBoundingClientRect().width).map(e=>(e.innerText||'').replace(/\s+/g,' ').trim()).filter(Boolean).slice(0,18)}));
console.log('   after Receive:',R.receiveView.url);
console.log('   fields :',JSON.stringify(R.receiveView.fields));
console.log('   buttons:',JSON.stringify(R.receiveView.buttons));
await page.screenshot({path:`${EV}/r74-po-receive.png`,fullPage:true}).catch(()=>{});
fs.writeFileSync(`${EV}/r74-confirm-vendor.json`,JSON.stringify(R,null,1));
await browser.close();
