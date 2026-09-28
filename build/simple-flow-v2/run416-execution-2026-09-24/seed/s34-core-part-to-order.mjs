// C53489 needs a part that CARRIES A CORE and is ON ORDER, so that deferring it can be watched to
// see whether its core follows it or is asked about separately.
// A158 (1237944) carries a core - it shows a "Core for A158" row wherever it sits. Put it on the
// open line as a catalogue part (so it must be ordered rather than taken from stock), then order it.
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import { openWo } from '../probes/lib3.mjs';
import { addPart } from './lib-seed.mjs';
import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const WO='281adfa7-5925-4718-936d-91d12cda3873';
const LINE='e1988527-1828-4703-9358-5f2a3fa5dad1';   // ZZAUTOTEST parts line - Authorized, editable
const {browser,page}=await bootProdLogin('/workorders',{settle:13000,viewport:{width:1680,height:1000},deviceScaleFactor:2});
page.setDefaultTimeout(30000);
const R={};
const rows=async()=>await page.evaluate(()=>[...document.querySelectorAll('tr')].filter(t=>t.getBoundingClientRect().height)
  .map(t=>{const txt=(t.innerText||'').replace(/\s+/g,' ').trim();
    const b=[...t.querySelectorAll('button,.q-btn')].filter(e=>e.getBoundingClientRect().width)
      .map(e=>{const r=e.getBoundingClientRect();return {t:(e.innerText||'').replace(/\s+/g,' ').trim(),x:Math.round(r.x+r.width/2),y:Math.round(r.y+r.height/2)};})
      .filter(a=>a.t&&!/more_vert|edit|drag_indicator/.test(a.t));
    return {t:txt.slice(0,86),actions:b};}).filter(r=>r.t));
await openWo(page,WO); await page.waitForTimeout(9000);
try{
  const out=await addPart(page,LINE,{number:'1237944',description:'A158',qty:1,source:'catalog'});
  console.log('added:',out);
}catch(e){ console.log('adding the part failed:',e.message.slice(0,220)); }
await page.reload({waitUntil:'domcontentloaded'}); await page.waitForTimeout(10000);
let rr=await rows();
R.afterAdd=rr.filter(r=>/A158|Core/i.test(r.t)).map(r=>r.t+' -> '+r.actions.map(a=>a.t).join('|'));
console.log('\nA158 and core rows now:'); R.afterAdd.forEach(x=>console.log('  ',x));
// order anything that offers Order
const orderable=rr.filter(r=>r.actions.some(a=>/^Order$/i.test(a.t)));
console.log('\nrows offering Order:',JSON.stringify(orderable.map(r=>r.t.slice(0,50))));
if(orderable.length){
  const r0=orderable[orderable.length-1]; const a=r0.actions.find(x=>/^Order$/i.test(x.t));
  console.log('ordering:',r0.t.slice(0,56));
  await page.mouse.click(a.x,a.y); await page.waitForTimeout(4000);
  const d=await page.evaluate(()=>{const q=[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width>150).pop();
    if(!q)return null; return {text:(q.innerText||'').replace(/\s+/g,' ').slice(0,300),
      buttons:[...q.querySelectorAll('button,.q-btn')].filter(e=>e.getBoundingClientRect().width).map(e=>(e.innerText||'').trim()).filter(Boolean)};});
  console.log('   it asks:',JSON.stringify(d&&d.text));
  console.log('   buttons:',JSON.stringify(d&&d.buttons));
  await page.screenshot({path:`${EV}/s34-order-dialog.png`}).catch(()=>{});
  // fill a vendor if it wants one, then confirm - pressing twice in case it asks to confirm
  const vend=await page.evaluate(()=>{const q=[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width>150).pop();
    const f=[...q.querySelectorAll('.q-field')].find(x=>/Vendor/i.test(x.innerText||'')&&!x.querySelector('input')?.value);
    if(!f)return 'no empty vendor field'; const i=f.querySelector('input'); if(!i)return 'vendor field has no input'; i.click(); return 'opened vendor list';});
  console.log('   vendor:',vend);
  if(/opened/.test(vend)){ await page.waitForTimeout(2500);
    console.log('   ',await page.evaluate(()=>{const m=[...document.querySelectorAll('.q-menu .q-item')].filter(e=>e.getBoundingClientRect().width);
      if(!m.length)return 'no vendor list appeared'; m[0].click(); return 'chose vendor '+(m[0].innerText||'').trim().slice(0,30);}));
    await page.waitForTimeout(2500); }
  for(let i=0;i<2;i++){
    const go=await page.evaluate(()=>{const q=[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width>150).pop();
      if(!q)return 'the dialog closed';
      const c=[...q.querySelectorAll('button,.q-btn')].filter(e=>e.getBoundingClientRect().width)
        .map(e=>({e,t:(e.innerText||'').replace(/\s+/g,' ').trim(),dis:/disabled/.test(e.className||'')}))
        .filter(x=>x.t&&!/^(cancel|close|×)$/i.test(x.t));
      if(!c.length)return 'nothing pressable';
      const b=c[c.length-1]; if(b.dis)return 'the button "'+b.t+'" is not pressable';
      b.e.click(); return 'pressed "'+b.t+'"';});
    console.log('   ',go); if(/closed/.test(go)) break; await page.waitForTimeout(5000);
  }
  await page.waitForTimeout(6000);
  R.toast=await page.evaluate(()=>[...document.querySelectorAll('.q-notification,[role=alert]')].map(e=>(e.innerText||'').trim()).filter(Boolean));
  console.log('   message:',JSON.stringify(R.toast));
}
await page.keyboard.press('Escape').catch(()=>{});
await page.reload({waitUntil:'domcontentloaded'}); await page.waitForTimeout(11000);
rr=await rows();
R.final=rr.filter(r=>/A158|Core|Awaiting|Receive/i.test(r.t)).map(r=>r.t+' -> '+r.actions.map(a=>a.t).join('|'));
console.log('\nhow it stands now:'); R.final.forEach(x=>console.log('  ',x));
await page.screenshot({path:`${EV}/s34-final.png`,fullPage:true}).catch(()=>{});
fs.writeFileSync(`${EV}/s34-core-part-to-order.json`,JSON.stringify(R,null,1));
await browser.close();
