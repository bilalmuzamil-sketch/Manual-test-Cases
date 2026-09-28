// Now drive those parts into the states the checks need:
//   Order the orderable part  -> a purchase order per vendor exists (C44579, C44580, C44586, C53487)
//   Pick a catalogue part     -> its CORE row should appear (C53489, C44570)
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import { openWo } from '../probes/lib3.mjs';
import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const WO='281adfa7-5925-4718-936d-91d12cda3873';
const {browser,page}=await bootProdLogin('/workorders',{settle:13000,viewport:{width:1680,height:1000},deviceScaleFactor:2});
page.setDefaultTimeout(30000);
const R={};
const dlg=async()=>await page.evaluate(()=>{const d=[...document.querySelectorAll('.q-dialog')].filter(x=>{const r=x.getBoundingClientRect();return r.width>150&&r.height>100;}).pop();
  if(!d)return null; const vis=e=>{const r=e.getBoundingClientRect();return r.width&&r.height;};
  return {text:(d.innerText||'').replace(/\s+/g,' ').trim().slice(0,420),
    inputs:[...d.querySelectorAll('input')].filter(vis).map((i,ix)=>({ix,label:((i.closest('.q-field')||{}).innerText||'').replace(/\s+/g,' ').trim().slice(0,40),val:i.value})),
    buttons:[...d.querySelectorAll('button,.q-btn')].filter(vis).map(e=>({t:(e.innerText||'').replace(/\s+/g,' ').trim(),disabled:/disabled/.test(e.className||'')})).filter(b=>b.t)};});
const waitDlg=async(ms=12000)=>{const t0=Date.now();while(Date.now()-t0<ms){const x=await dlg();if(x)return x;await page.waitForTimeout(800);}return null;};
const rows=async()=>await page.evaluate(()=>[...document.querySelectorAll('tr')].filter(t=>/drag_indicator|Core/i.test(t.innerText||''))
  .map(t=>{const b=[...t.querySelectorAll('button,.q-btn')].filter(e=>e.getBoundingClientRect().width);
    return {t:(t.innerText||'').replace(/\s+/g,' ').trim().slice(0,100),
      actions:b.map(e=>{const r=e.getBoundingClientRect();return {t:(e.innerText||'').replace(/\s+/g,' ').trim(),x:Math.round(r.x+r.width/2),y:Math.round(r.y+r.height/2)};}).filter(a=>a.t&&!/more_vert|edit|drag/.test(a.t))};}));

await openWo(page,WO); await page.waitForTimeout(9000);
R.before=(await rows()).map(r=>r.t+' -> '+r.actions.map(a=>a.t).join('|'));
console.log('before:'); R.before.forEach(r=>console.log('   ',r));

// --- ORDER ---
let rr=await rows();
const orderable=rr.find(r=>r.actions.some(a=>/^Order$/i.test(a.t)));
if(orderable){
  const a=orderable.actions.find(x=>/^Order$/i.test(x.t));
  console.log('\nordering:',orderable.t.slice(0,60));
  await page.mouse.click(a.x,a.y); await page.waitForTimeout(3000);
  let d=await waitDlg();
  console.log('   it asks:',JSON.stringify(d&&d.text.slice(0,260)));
  console.log('   buttons:',JSON.stringify((d&&d.buttons||[]).map(b=>b.t+(b.disabled?' [disabled]':''))));
  await page.screenshot({path:`${EV}/s30-order-dialog.png`}).catch(()=>{});
  if(d){
    // a vendor may be required first
    const vIx=(d.inputs||[]).findIndex(i=>/Vendor/i.test(i.label));
    if(vIx>=0 && !d.inputs[vIx].val){
      const box=page.locator('.q-dialog input:visible').nth(vIx);
      await box.click().catch(()=>{}); await page.waitForTimeout(2200);
      const picked=await page.evaluate(()=>{const m=[...document.querySelectorAll('.q-menu .q-item')].filter(e=>e.getBoundingClientRect().width);
        if(!m.length)return 'no vendor list'; m[0].click(); return 'chose '+(m[0].innerText||'').trim().slice(0,30);});
      console.log('   vendor:',picked); await page.waitForTimeout(2000);
    }
    const go=await page.evaluate(()=>{const q=[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width>150).pop();
      const b=[...q.querySelectorAll('button,.q-btn')].filter(e=>e.getBoundingClientRect().width&&!/disabled/.test(e.className||''))
        .find(e=>/^(Order|Confirm|Yes|Place Order|Create)$/i.test((e.innerText||'').replace(/\s+/g,' ').trim()));
      if(!b)return 'no confirm; buttons: '+[...q.querySelectorAll('button,.q-btn')].filter(e=>e.getBoundingClientRect().width).map(e=>(e.innerText||'').trim()).join(' | ');
      b.click(); return 'pressed '+(b.innerText||'').trim();});
    console.log('   ',go); await page.waitForTimeout(7000);
    R.afterOrderToast=await page.evaluate(()=>[...document.querySelectorAll('.q-notification,[role=alert]')].map(e=>(e.innerText||'').trim()).filter(Boolean));
    console.log('   message:',JSON.stringify(R.afterOrderToast));
  }
  await page.keyboard.press('Escape').catch(()=>{}); await page.waitForTimeout(1500);
  await page.reload({waitUntil:'domcontentloaded'}); await page.waitForTimeout(8000);
} else console.log('\nnothing here offers Order');

// --- PICK, which should bring the core out ---
rr=await rows();
const pickable=rr.find(r=>r.actions.some(a=>/^Pick$/i.test(a.t)));
if(pickable){
  const a=pickable.actions.find(x=>/^Pick$/i.test(x.t));
  console.log('\npicking:',pickable.t.slice(0,60));
  await page.mouse.click(a.x,a.y); await page.waitForTimeout(4000);
  const d=await dlg();
  if(d){ console.log('   it asks:',JSON.stringify(d.text.slice(0,200)));
    const go=await page.evaluate(()=>{const q=[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width>150).pop();
      const b=[...q.querySelectorAll('button,.q-btn')].filter(e=>e.getBoundingClientRect().width&&!/disabled/.test(e.className||''))
        .find(e=>/^(Pick|Pick All|Confirm|Yes|OK)$/i.test((e.innerText||'').trim())); if(!b)return 'no confirm'; b.click(); return 'pressed '+(b.innerText||'').trim();});
    console.log('   ',go); await page.waitForTimeout(6000); }
  await page.reload({waitUntil:'domcontentloaded'}); await page.waitForTimeout(9000);
}
R.after=(await rows()).map(r=>r.t+' -> '+r.actions.map(a=>a.t).join('|'));
console.log('\nafter:'); R.after.forEach(r=>console.log('   ',r));
R.cores=R.after.filter(r=>/Core/i.test(r)).length;
console.log('\ncore rows now:',R.cores);
await page.screenshot({path:`${EV}/s30-after.png`,fullPage:true}).catch(()=>{});
fs.writeFileSync(`${EV}/s30-order-pick.json`,JSON.stringify(R,null,1));
await browser.close();
