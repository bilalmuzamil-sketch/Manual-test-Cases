// C53489: defer a part that carries a core, and watch the core.
// The catalogue A158 (1237944) is on order and awaiting receipt; A158 carries a core.
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
await openWo(page,WO); await page.waitForTimeout(9000);
let rr=await rows();
R.before=rr.filter(r=>/1237944|Core/i.test(r.t)).map(r=>r.t+'  ->  '+r.actions.map(a=>a.t).join('|'));
console.log('before deferring - every A158 and core row:'); R.before.forEach(x=>console.log('  ',x));
// the plain part is ALSO awaiting receipt - pick the A158 row, the one that carries a core
const target=rr.find(r=>/\(1237944\)/.test(r.t)&&/Awaiting Receive/i.test(r.t)&&r.actions.some(a=>/^Receive$/i.test(a.t)));
if(!target){ console.log('nothing is awaiting receipt'); await browser.close(); process.exit(0); }
console.log('\nopening Receive on:',target.t.slice(0,64));
await page.mouse.click(target.actions.find(a=>/^Receive$/i.test(a.t)).x,target.actions.find(a=>/^Receive$/i.test(a.t)).y);
await page.waitForTimeout(7000);
const modal=await page.evaluate(()=>{const q=[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width>200).pop();
  if(!q)return null;
  return {text:(q.innerText||'').replace(/\s+/g,' ').trim().slice(0,700),
    rows:[...q.querySelectorAll('tr')].filter(t=>t.getBoundingClientRect().height).map(t=>(t.innerText||'').replace(/\s+/g,' ').trim().slice(0,86)),
    buttons:[...q.querySelectorAll('button,.q-btn')].filter(e=>e.getBoundingClientRect().width)
      .map(e=>{const r=e.getBoundingClientRect();return {t:(e.innerText||'').replace(/\s+/g,' ').trim(),dis:/disabled/.test(e.className||''),x:Math.round(r.x+r.width/2),y:Math.round(r.y+r.height/2)};}).filter(b=>b.t)};});
R.modal=modal;
console.log('\nthe receive window says:',JSON.stringify(modal&&modal.text.slice(0,420)));
console.log('its rows:',JSON.stringify(modal&&modal.rows));
console.log('its buttons:',JSON.stringify(modal&&modal.buttons.map(b=>b.t+(b.dis?' [off]':''))));
await page.screenshot({path:`${EV}/r98-receive-modal.png`}).catch(()=>{});
// does the core appear in here as its own line, with its own choice?
R.coreInModal=(modal&&modal.rows||[]).filter(r=>/core/i.test(r));
console.log('core rows inside the receive window:',JSON.stringify(R.coreInModal));
// tick the part, then choose Receive later
const ticked=await page.evaluate(()=>{const q=[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width>200).pop();
  const boxes=[...q.querySelectorAll('.q-checkbox')].filter(e=>e.getBoundingClientRect().width);
  if(!boxes.length)return 'no tick boxes';
  boxes[boxes.length-1].click(); return 'ticked the last of '+boxes.length+' boxes';});
console.log('\n',ticked); await page.waitForTimeout(2500);
const later=await page.evaluate(()=>{const q=[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width>200).pop();
  const all=[...q.querySelectorAll('button,.q-btn,.q-item,a,span')].filter(e=>e.getBoundingClientRect().width);
  const b=all.find(e=>/receive\s*later|received\s*later/i.test((e.innerText||'').replace(/\s+/g,' ').trim()));
  if(!b)return 'no Receive later anywhere in the window. What it does offer: '+
    [...new Set(all.map(e=>(e.innerText||'').replace(/\s+/g,' ').trim()).filter(t=>t&&t.length<40))].slice(0,22).join(' | '); if(/disabled/.test(b.className||''))return 'Receive later is not pressable';
  b.click(); return 'pressed Receive later';});
console.log(' ',later); await page.waitForTimeout(6000);
// it may ask to confirm
for(let i=0;i<2;i++){
  const d=await page.evaluate(()=>{const q=[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width>150).pop();
    if(!q)return null; return (q.innerText||'').replace(/\s+/g,' ').trim().slice(0,260);});
  if(!d){ console.log('  the window closed'); break; }
  console.log('  still showing:',JSON.stringify(d.slice(0,200)));
  const go=await page.evaluate(()=>{const q=[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width>150).pop();
    const c=[...q.querySelectorAll('button,.q-btn')].filter(e=>e.getBoundingClientRect().width)
      .map(e=>({e,t:(e.innerText||'').replace(/\s+/g,' ').trim(),dis:/disabled/.test(e.className||'')}))
      .filter(x=>x.t&&/confirm|yes|ok|receive later|save/i.test(x.t));
    if(!c.length)return 'no confirm offered';
    const b=c[c.length-1]; if(b.dis)return '"'+b.t+'" is not pressable'; b.e.click(); return 'pressed "'+b.t+'"';});
  console.log('  ',go); if(/no confirm/.test(go)) break; await page.waitForTimeout(5000);
}
R.toast=await page.evaluate(()=>[...document.querySelectorAll('.q-notification,[role=alert]')].map(e=>(e.innerText||'').trim()).filter(Boolean));
console.log('message:',JSON.stringify(R.toast));
await page.keyboard.press('Escape').catch(()=>{});
await page.goto(`https://app.shopview.com/workorders/${WO}/lines`,{waitUntil:'domcontentloaded'}); await page.waitForTimeout(11000);
rr=await rows();
R.after=rr.filter(r=>/1237944|Core|later/i.test(r.t)).map(r=>r.t+'  ->  '+r.actions.map(a=>a.t).join('|'));
console.log('\nafter deferring:'); R.after.forEach(x=>console.log('  ',x));
await page.screenshot({path:`${EV}/r98-after-defer.png`,fullPage:true}).catch(()=>{});
fs.writeFileSync(`${EV}/r98-defer-core.json`,JSON.stringify(R,null,1));
await browser.close();
