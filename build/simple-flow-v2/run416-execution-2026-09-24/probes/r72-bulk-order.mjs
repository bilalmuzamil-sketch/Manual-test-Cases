// C44579 - bulk Order raises a purchase order per vendor and asks for confirmation first
// C44580 - bulk Order skips parts already ordered and parts not sourced from a vendor, and the count
//          says how many it will act on
// Three parts now sit at Auth To Order, one part is already ordered and awaiting receipt, and several
// came from stock - exactly the mixed selection the second check describes.
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import { openWo } from './lib3.mjs';
import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const WO='281adfa7-5925-4718-936d-91d12cda3873';
const {browser,page}=await bootProdLogin('/workorders',{settle:13000,viewport:{width:1680,height:1000},deviceScaleFactor:2});
page.setDefaultTimeout(30000);
const R={};
const dlg=async()=>await page.evaluate(()=>{const d=[...document.querySelectorAll('.q-dialog')].filter(x=>{const r=x.getBoundingClientRect();return r.width>150&&r.height>100;}).pop();
  if(!d)return null; return {text:(d.innerText||'').replace(/\s+/g,' ').trim().slice(0,420),
    buttons:[...d.querySelectorAll('button,.q-btn')].filter(e=>e.getBoundingClientRect().width)
      .map(e=>({t:(e.innerText||'').replace(/\s+/g,' ').trim(),disabled:/disabled/.test(e.className||'')})).filter(b=>b.t)};});
const parts=async()=>await page.evaluate(()=>[...document.querySelectorAll('tr')].filter(t=>/drag_indicator|Core/i.test(t.innerText||''))
  .map(t=>(t.innerText||'').replace(/\s+/g,' ').trim().slice(0,105)));
await openWo(page,WO); await page.waitForTimeout(9000);
R.before=await parts();
console.log('parts before:'); R.before.forEach(p=>console.log('   ',p));
R.orderableBefore=R.before.filter(p=>/Auth To Order/.test(p)).length;
R.awaitingBefore=R.before.filter(p=>/Awaiting/.test(p)).length;
console.log('\nto order:',R.orderableBefore,'| already ordered and awaiting:',R.awaitingBefore);

// select every line so the bar counts parts across them
const ids=await page.evaluate(()=>[...new Set([...document.querySelectorAll('tr[class*="line-row-"]')].map(t=>(t.className.match(/line-row-([0-9a-f-]+)/)||[])[1]))].filter(Boolean));
for(const id of ids){const tr=page.locator('tr.line-row-'+id).first();
  await tr.scrollIntoViewIfNeeded().catch(()=>{}); await tr.hover().catch(()=>{}); await page.waitForTimeout(700);
  const cb=page.locator(`[data-test-id="line_checkbox_${id}"]`);
  if(await cb.count()){await cb.first().click({timeout:8000}).catch(()=>{}); await page.waitForTimeout(1200);} }
await page.waitForTimeout(2500);
R.bar=await page.evaluate(()=>{const b=document.querySelector('.bulk-action-bar'); return b?(b.innerText||'').replace(/\s+/g,' ').trim():null;});
console.log('\nthe bar reads:',JSON.stringify(R.bar));
await page.screenshot({path:`${EV}/r72-bar.png`,clip:{x:290,y:50,width:1390,height:200}}).catch(()=>{});
const orderBtn=await page.evaluate(()=>{const b=document.querySelector('.bulk-action-bar'); if(!b)return null;
  const o=[...b.querySelectorAll('button,.q-btn')].find(e=>/^Order/i.test((e.innerText||'').trim()));
  if(!o)return null; const r=o.getBoundingClientRect();
  return {label:(o.innerText||'').replace(/\s+/g,' ').trim(),x:Math.round(r.x+r.width/2),y:Math.round(r.y+r.height/2)};});
console.log('the bar\'s Order control:',JSON.stringify(orderBtn));
R.orderLabel=orderBtn&&orderBtn.label;
if(!orderBtn){ console.log('no Order in the bar'); fs.writeFileSync(`${EV}/r72-bulk-order.json`,JSON.stringify(R,null,1)); await browser.close(); process.exit(0); }
await page.mouse.click(orderBtn.x,orderBtn.y); await page.waitForTimeout(4000);
R.confirm=await dlg();
console.log('\nit asks first:',JSON.stringify(R.confirm&&R.confirm.text.slice(0,320)));
console.log('   buttons:',JSON.stringify((R.confirm&&R.confirm.buttons||[]).map(b=>b.t+(b.disabled?' [disabled]':''))));
await page.screenshot({path:`${EV}/r72-confirm.png`}).catch(()=>{});
R.asksFirst=!!R.confirm;
if(R.confirm){
  const go=await page.evaluate(()=>{const q=[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width>150).pop();
    const b=[...q.querySelectorAll('button,.q-btn')].filter(e=>e.getBoundingClientRect().width&&!/disabled/.test(e.className||''))
      .find(e=>/^(Order|Confirm|Yes|Place Order|Create)$/i.test((e.innerText||'').replace(/\s+/g,' ').trim()));
    if(!b)return 'no confirm button'; b.click(); return 'pressed '+(b.innerText||'').trim();});
  console.log('   ',go); await page.waitForTimeout(8000);
  R.toast=await page.evaluate(()=>[...document.querySelectorAll('.q-notification,[role=alert]')].map(e=>(e.innerText||'').trim()).filter(Boolean));
  console.log('   message afterwards:',JSON.stringify(R.toast));
}
await page.keyboard.press('Escape').catch(()=>{}); await page.waitForTimeout(1500);
await page.reload({waitUntil:'domcontentloaded'}); await page.waitForTimeout(9000);
R.after=await parts();
console.log('\nparts after:'); R.after.forEach(p=>console.log('   ',p));
// what purchase orders exist now
await page.goto('https://app.shopview.com/parts/orders',{waitUntil:'domcontentloaded'}); await page.waitForTimeout(9000);
R.pos=await page.evaluate(()=>[...document.querySelectorAll('tbody tr')].filter(t=>t.getBoundingClientRect().height)
  .map(t=>(t.innerText||'').replace(/\s+/g,' ').trim().slice(0,110)).slice(0,10));
console.log('\npurchase orders (newest first):'); R.pos.forEach(p=>console.log('   ',p));
await page.screenshot({path:`${EV}/r72-pos.png`,fullPage:true}).catch(()=>{});
fs.writeFileSync(`${EV}/r72-bulk-order.json`,JSON.stringify(R,null,1));
await browser.close();
