// C53489 points 3-5: receive the deferred part and watch the core - does it resolve in the same
// pass and under the same invoice number, and is an unresolved core still asked for at completion?
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import { openWo } from './lib3.mjs';
import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const WO='281adfa7-5925-4718-936d-91d12cda3873';
const INV='ZZAUTOTEST-INV-1';
const {browser,page}=await bootProdLogin('/workorders',{settle:13000,viewport:{width:1680,height:1000},deviceScaleFactor:2});
page.setDefaultTimeout(30000);
const R={};
const rows=async()=>await page.evaluate(()=>[...document.querySelectorAll('tr')].filter(t=>t.getBoundingClientRect().height)
  .map(t=>{const b=[...t.querySelectorAll('button,.q-btn')].filter(e=>e.getBoundingClientRect().width)
      .map(e=>{const r=e.getBoundingClientRect();return {t:(e.innerText||'').replace(/\s+/g,' ').trim(),x:Math.round(r.x+r.width/2),y:Math.round(r.y+r.height/2)};});
    return {t:(t.innerText||'').replace(/\s+/g,' ').trim().slice(0,96),actions:b};}).filter(r=>r.t));
await openWo(page,WO); await page.waitForTimeout(9000);
let rr=await rows();
const def=rr.find(r=>/\(1237944\)/.test(r.t)&&/Receive Later/i.test(r.t));
console.log('the deferred row:',JSON.stringify(def&&def.t));
console.log('what it offers:',JSON.stringify(def&&def.actions.map(a=>a.t)));
// its own menu - is a receive offered there?
if(def){ const mv=def.actions.find(a=>/more_vert/.test(a.t));
  if(mv){ await page.mouse.click(mv.x,mv.y); await page.waitForTimeout(2200);
    R.menu=await page.evaluate(()=>{const m=[...document.querySelectorAll('.q-menu')].filter(x=>{const q=x.getBoundingClientRect();return q.width>20&&q.height>20;}).pop();
      return m?[...m.querySelectorAll('.q-item')].filter(i=>i.getBoundingClientRect().width)
        .map(i=>({t:(i.innerText||'').trim(),dis:/disabled/.test(i.className),x:Math.round(i.getBoundingClientRect().x+30),y:Math.round(i.getBoundingClientRect().y+i.getBoundingClientRect().height/2)})):[];});
    console.log('its menu:',JSON.stringify((R.menu||[]).map(i=>i.t+(i.dis?' [off]':''))));
    const rec=(R.menu||[]).find(i=>/receive/i.test(i.t)&&!i.dis);
    if(rec){ await page.mouse.click(rec.x,rec.y); console.log('chose',JSON.stringify(rec.t)); await page.waitForTimeout(7000); }
    else { await page.keyboard.press('Escape'); await page.waitForTimeout(1200); } } }
// if no window yet, try the line's tick box and the bar
let win=await page.evaluate(()=>{const q=[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width>200).pop();
  return q?(q.innerText||'').replace(/\s+/g,' ').slice(0,200):null;});
if(!win){
  console.log('\nno window from the row - trying the tick box and the action bar');
  await page.evaluate(()=>{const t=[...document.querySelectorAll('tr')].find(x=>/\(1237944\)/.test(x.innerText||'')&&/Receive Later/i.test(x.innerText||''));
    const cb=t&&t.querySelector('.q-checkbox'); if(cb)cb.click();
    const lr=[...document.querySelectorAll('tr')].find(x=>/^\d+\s+more_vert/.test((x.innerText||'').replace(/\s+/g,' ').trim()));
    if(!cb&&lr){const c=lr.querySelector('.q-checkbox'); if(c)c.click();}});
  await page.waitForTimeout(3000);
  const bar=await page.evaluate(()=>{const b=[...document.querySelectorAll('button,.q-btn')].filter(e=>{const r=e.getBoundingClientRect();return r.width&&r.y>window.innerHeight*0.6;})
    .map(e=>{const r=e.getBoundingClientRect();return {t:(e.innerText||'').replace(/\s+/g,' ').trim(),x:Math.round(r.x+r.width/2),y:Math.round(r.y+r.height/2)};}).filter(x=>x.t);
    return b;});
  console.log('the bar offers:',JSON.stringify(bar.map(b=>b.t)));
  const rb=bar.find(b=>/^Receive/i.test(b.t));
  if(rb){ await page.mouse.click(rb.x,rb.y); console.log('pressed',JSON.stringify(rb.t)); await page.waitForTimeout(7000); }
}
const w=await page.evaluate(()=>{const q=[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width>200).pop();
  if(!q)return null; return {text:(q.innerText||'').replace(/\s+/g,' ').trim().slice(0,600),
    rows:[...q.querySelectorAll('tr')].filter(t=>t.getBoundingClientRect().height).map(t=>(t.innerText||'').replace(/\s+/g,' ').trim().slice(0,80)),
    controls:[...new Set([...q.querySelectorAll('button,.q-btn,.q-item')].filter(e=>e.getBoundingClientRect().width).map(e=>(e.innerText||'').replace(/\s+/g,' ').trim()).filter(t=>t&&t.length<40))]};});
R.window=w;
console.log('\nthe receive window:',JSON.stringify(w&&w.text.slice(0,420)));
console.log('its rows:',JSON.stringify(w&&w.rows));
console.log('does a core appear in it:',JSON.stringify((w&&w.rows||[]).filter(r=>/core/i.test(r))));
await page.screenshot({path:`${EV}/r102-receive-window.png`}).catch(()=>{});
if(w){
  // put an invoice number in, tick everything, receive
  await page.evaluate((inv)=>{const q=[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width>200).pop();
    const f=[...q.querySelectorAll('.q-field')].find(x=>/Vendor Invoice Number/i.test(x.innerText||''));
    const i=f&&f.querySelector('input'); if(i){i.focus(); i.value=inv; i.dispatchEvent(new Event('input',{bubbles:true}));}},INV);
  await page.waitForTimeout(1500);
  console.log(await page.evaluate(()=>{const q=[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width>200).pop();
    const sa=[...q.querySelectorAll('button,.q-btn,a')].find(e=>/Select All/i.test(e.innerText||'')); if(sa){sa.click(); return 'ticked everything';}
    const b=[...q.querySelectorAll('.q-checkbox')].filter(e=>e.getBoundingClientRect().width); if(b.length){b[b.length-1].click(); return 'ticked the part';} return 'nothing to tick';}));
  await page.waitForTimeout(2500);
  for(let i=0;i<3;i++){
    const go=await page.evaluate(()=>{const q=[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width>150).pop();
      if(!q)return 'the window closed';
      const c=[...q.querySelectorAll('button,.q-btn')].filter(e=>e.getBoundingClientRect().width)
        .map(e=>({e,t:(e.innerText||'').replace(/\s+/g,' ').trim(),dis:/disabled/.test(e.className||'')}))
        .filter(x=>/^Receive Parts|confirm|^Yes$|^OK$/i.test(x.t));
      if(!c.length)return 'no receive button';
      const b=c[c.length-1]; if(b.dis)return '"'+b.t+'" is not pressable'; b.e.click(); return 'pressed "'+b.t+'"';});
    console.log(' ',go); if(/closed|no receive/.test(go)) break; await page.waitForTimeout(6000);
  }
}
R.toast=await page.evaluate(()=>[...document.querySelectorAll('.q-notification,[role=alert]')].map(e=>(e.innerText||'').trim()).filter(Boolean));
console.log('message:',JSON.stringify(R.toast));
await page.keyboard.press('Escape').catch(()=>{});
await page.goto(`https://app.shopview.com/workorders/${WO}/lines`,{waitUntil:'domcontentloaded'}); await page.waitForTimeout(11000);
R.after=(await rows()).filter(r=>/1237944|Core|Later|Received/i.test(r.t)).map(r=>r.t+'  ->  '+r.actions.map(a=>a.t).filter(t=>!/drag/.test(t)).join('|'));
console.log('\nafter receiving:'); R.after.forEach(x=>console.log('  ',x));
await page.screenshot({path:`${EV}/r102-after.png`,fullPage:true}).catch(()=>{});
fs.writeFileSync(`${EV}/r102-receive-deferred.json`,JSON.stringify(R,null,1));
await browser.close();
