// Press Order on the catalogue A158 (which carries a core) and watch what actually happens -
// a dialog, a new screen, or the row simply changing state.
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import { openWo } from '../probes/lib3.mjs';
import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const WO='281adfa7-5925-4718-936d-91d12cda3873';
const {browser,page}=await bootProdLogin('/workorders',{settle:13000,viewport:{width:1680,height:1000},deviceScaleFactor:2});
page.setDefaultTimeout(30000);
const R={};
const rows=async()=>await page.evaluate(()=>[...document.querySelectorAll('tr')].filter(t=>t.getBoundingClientRect().height)
  .map(t=>{const b=[...t.querySelectorAll('button,.q-btn')].filter(e=>e.getBoundingClientRect().width)
      .map(e=>{const r=e.getBoundingClientRect();return {t:(e.innerText||'').replace(/\s+/g,' ').trim(),x:Math.round(r.x+r.width/2),y:Math.round(r.y+r.height/2)};})
      .filter(a=>a.t&&!/more_vert|edit|drag_indicator/.test(a.t));
    return {t:(t.innerText||'').replace(/\s+/g,' ').trim().slice(0,90),actions:b};}).filter(r=>r.t));
const look=async(tag)=>{
  const d=await page.evaluate(()=>{const q=[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width>150).pop();
    if(!q)return null;
    return {text:(q.innerText||'').replace(/\s+/g,' ').trim().slice(0,420),
      buttons:[...q.querySelectorAll('button,.q-btn')].filter(e=>e.getBoundingClientRect().width)
        .map(e=>{const r=e.getBoundingClientRect();return {t:(e.innerText||'').replace(/\s+/g,' ').trim(),dis:/disabled/.test(e.className||''),x:Math.round(r.x+r.width/2),y:Math.round(r.y+r.height/2)};}).filter(b=>b.t)};});
  console.log(`[${tag}] url:`,page.url().replace('https://app.shopview.com',''));
  console.log(`[${tag}] dialog:`,d?JSON.stringify(d.text.slice(0,300)):'none',
              d?('| buttons '+JSON.stringify(d.buttons.map(b=>b.t+(b.dis?' [off]':'')))):'');
  return d;};
await openWo(page,WO); await page.waitForTimeout(9000);
const rr=await rows();
const target=rr.find(r=>/\(1237944\) A158/.test(r.t)&&r.actions.some(a=>/^Order$/i.test(a.t)));
if(!target){ console.log('nothing offers Order now. A158 rows:'); rr.filter(r=>/1237944/.test(r.t)).forEach(r=>console.log('  ',r.t,'->',r.actions.map(a=>a.t).join('|'))); await browser.close(); process.exit(0); }
console.log('pressing Order on:',target.t.slice(0,60));
const a=target.actions.find(x=>/^Order$/i.test(x.t));
await page.mouse.click(a.x,a.y);
await page.waitForTimeout(6000); let d=await look('after Order');
if(!d){ await page.waitForTimeout(6000); d=await look('after waiting'); }
await page.screenshot({path:`${EV}/s35-after-order.png`}).catch(()=>{});
// if a dialog is up, press its last enabled button, twice if it re-labels
for(let i=0;i<3&&d;i++){
  const go=await page.evaluate(()=>{const q=[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width>150).pop();
    if(!q)return 'the dialog closed';
    const c=[...q.querySelectorAll('button,.q-btn')].filter(e=>e.getBoundingClientRect().width)
      .map(e=>({e,t:(e.innerText||'').replace(/\s+/g,' ').trim(),dis:/disabled/.test(e.className||'')}))
      .filter(x=>x.t&&!/^(cancel|close|×)$/i.test(x.t));
    if(!c.length)return 'nothing pressable';
    const b=c[c.length-1]; if(b.dis)return 'the button "'+b.t+'" is not pressable yet';
    b.e.click(); return 'pressed "'+b.t+'"';});
  console.log('  ',go);
  if(/closed/.test(go)) break;
  await page.waitForTimeout(5000); d=await look('step '+(i+1));
}
await page.waitForTimeout(4000);
R.toast=await page.evaluate(()=>[...document.querySelectorAll('.q-notification,[role=alert]')].map(e=>(e.innerText||'').trim()).filter(Boolean));
console.log('message:',JSON.stringify(R.toast));
await page.keyboard.press('Escape').catch(()=>{});
await page.goto(`https://app.shopview.com/workorders/${WO}/lines`,{waitUntil:'domcontentloaded'}); await page.waitForTimeout(11000);
R.final=(await rows()).filter(r=>/1237944|Core|Awaiting|Order/i.test(r.t)).map(r=>r.t+' -> '+r.actions.map(x=>x.t).join('|'));
console.log('\nhow the parts stand now:'); R.final.forEach(x=>console.log('  ',x));
fs.writeFileSync(`${EV}/s35-order-it.json`,JSON.stringify(R,null,1));
await browser.close();
