// It exists after all. The bulk bar shows "Receive (4) arrow_drop_down" - a split button - and the
// receive window carries a "Receive Later" button. Open the caret, use it, and read the result:
//   C44592 - the split button offers Received later, chosen per part
//   C53489 - a deferred part's CORE follows its parent rather than being chosen separately
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import { openWo } from './lib3.mjs';
import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const {browser,ctx,page,APIH}=await bootProdLogin('/workorders',{settle:13000,viewport:{width:1680,height:1000},deviceScaleFactor:2});
page.setDefaultTimeout(30000);
const R={};
const call=async p=>{const q=await ctx.request.get(`https://${APIH}${p}`,{headers:{Accept:'application/json'},ignoreHTTPSErrors:true});
  const t=await q.text();let j=null;try{j=JSON.parse(t);}catch{}return j;};
const wos=(await call('/api/work-orders?pagination%5BrowsPerPage%5D=60&pagination%5Bpage%5D=1&search=&showMyWorkOrders=0'))?.data?.work_orders||[];
let target=null;
for(const w of wos.slice(0,14)){
  await openWo(page,w.id); await page.waitForTimeout(6500);
  const ok=await page.evaluate(()=>[...document.querySelectorAll('button,.q-btn')].some(e=>/^Receive$/i.test((e.innerText||'').trim())&&e.getBoundingClientRect().width));
  if(ok){target=w;break;}
}
if(!target){console.log('nothing left to receive'); await browser.close(); process.exit(0);}
console.log('work order:',target.work_order_number);
R.partsBefore=await page.evaluate(()=>[...document.querySelectorAll('tr')].filter(t=>/drag_indicator|Core/i.test(t.innerText||''))
  .map(t=>(t.innerText||'').replace(/\s+/g,' ').trim().slice(0,100)));
console.log('parts before:'); R.partsBefore.forEach(p=>console.log('   ',p));

// --- the bulk bar's split Receive ---
const ids=await page.evaluate(()=>[...new Set([...document.querySelectorAll('tr[class*="line-row-"]')].map(t=>(t.className.match(/line-row-([0-9a-f-]+)/)||[])[1]))].filter(Boolean));
for(const id of ids.slice(0,2)){const tr=page.locator('tr.line-row-'+id).first();
  await tr.hover().catch(()=>{}); await page.waitForTimeout(800);
  const cb=page.locator(`[data-test-id="line_checkbox_${id}"]`);
  if(await cb.count()){await cb.first().click({timeout:8000}).catch(()=>{}); await page.waitForTimeout(1400);} }
await page.waitForTimeout(2500);
const caret=await page.evaluate(()=>{const b=document.querySelector('.bulk-action-bar'); if(!b)return null;
  const r=[...b.querySelectorAll('button,.q-btn')].find(e=>/^Receive/i.test((e.innerText||'').trim()));
  if(!r)return null; const q=r.getBoundingClientRect();
  return {label:(r.innerText||'').replace(/\s+/g,' ').trim(),x:Math.round(q.x+q.width-10),y:Math.round(q.y+q.height/2)};});
console.log('\nthe bar\'s Receive control:',JSON.stringify(caret));
if(caret){ await page.mouse.click(caret.x,caret.y); await page.waitForTimeout(2500);
  R.caretMenu=await page.evaluate(()=>{const m=[...document.querySelectorAll('.q-menu')].filter(x=>{const q=x.getBoundingClientRect();return q.width>20&&q.height>20;}).pop();
    return m?[...m.querySelectorAll('.q-item')].filter(i=>i.getBoundingClientRect().width)
      .map(i=>{const q=i.getBoundingClientRect();return {t:(i.innerText||'').trim(),x:Math.round(q.x+30),y:Math.round(q.y+q.height/2)};}):null;});
  console.log('its caret offers:',JSON.stringify((R.caretMenu||[]).map(i=>i.t)));
  await page.screenshot({path:`${EV}/r68-bar-caret.png`}).catch(()=>{});
  R.splitOffersLater=(R.caretMenu||[]).some(i=>/later/i.test(i.t));
  console.log('>>> the split button offers receiving later:',R.splitOffersLater);
  await page.keyboard.press('Escape'); await page.waitForTimeout(1000); }

// --- use Receive Later in the receive window, on ONE part, and see what the core does ---
await page.keyboard.press('Escape'); await page.waitForTimeout(800);
const rec=await page.evaluate(()=>{const b=[...document.querySelectorAll('button,.q-btn')].find(e=>/^Receive$/i.test((e.innerText||'').trim())&&e.getBoundingClientRect().width);
  if(!b)return 'no Receive'; b.click(); return 'pressed Receive';});
console.log('\n',rec);
let seen=0; const t0=Date.now();
while(Date.now()-t0<18000){ seen=await page.evaluate(()=>{const d=[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width>150).pop(); return d?1:0;}); if(seen)break; await page.waitForTimeout(900);}
if(seen){
  R.window=await page.evaluate(()=>{const d=[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width>150).pop();
    return {buttons:[...d.querySelectorAll('button,.q-btn')].filter(e=>e.getBoundingClientRect().width)
      .map(e=>({t:(e.innerText||'').replace(/\s+/g,' ').trim(),disabled:/disabled/.test(e.className||'')})).filter(b=>b.t),
      ticks:[...d.querySelectorAll('.q-checkbox')].filter(e=>e.getBoundingClientRect().width).length};});
  console.log('   window buttons:',JSON.stringify(R.window.buttons.map(b=>b.t+(b.disabled?' [disabled]':''))),'| tick boxes:',R.window.ticks);
  // tick ONE part, then press Receive Later - the check says the choice is per part
  const one=await page.evaluate(()=>{const d=[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width>150).pop();
    const cb=[...d.querySelectorAll('.q-checkbox')].filter(e=>e.getBoundingClientRect().width);
    if(cb.length<2)return 'only '+cb.length+' tick box'; cb[1].click(); return 'ticked one part';});
  console.log('   ',one); await page.waitForTimeout(2200);
  R.afterTick=await page.evaluate(()=>{const d=[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width>150).pop();
    return [...d.querySelectorAll('button,.q-btn')].filter(e=>e.getBoundingClientRect().width)
      .map(e=>(e.innerText||'').replace(/\s+/g,' ').trim()+(/disabled/.test(e.className||'')?' [disabled]':'')).filter(Boolean);});
  console.log('   buttons now:',JSON.stringify(R.afterTick));
  await page.screenshot({path:`${EV}/r68-window.png`}).catch(()=>{});
  const later=await page.evaluate(()=>{const d=[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width>150).pop();
    const b=[...d.querySelectorAll('button,.q-btn')].filter(e=>e.getBoundingClientRect().width&&!/disabled/.test(e.className||''))
      .find(e=>/^Receive Later$/i.test((e.innerText||'').replace(/\s+/g,' ').trim()));
    if(!b)return 'Receive Later is not pressable'; b.click(); return 'pressed Receive Later';});
  console.log('   ',later); await page.waitForTimeout(6000);
  R.toast=await page.evaluate(()=>[...document.querySelectorAll('.q-notification,[role=alert]')].map(e=>(e.innerText||'').trim()).filter(Boolean));
  console.log('   message:',JSON.stringify(R.toast));
  await page.keyboard.press('Escape'); await page.waitForTimeout(1500);
}
await page.reload({waitUntil:'domcontentloaded'}); await page.waitForTimeout(9000);
R.partsAfter=await page.evaluate(()=>[...document.querySelectorAll('tr')].filter(t=>/drag_indicator|Core/i.test(t.innerText||''))
  .map(t=>(t.innerText||'').replace(/\s+/g,' ').trim().slice(0,100)));
console.log('\nparts after:'); R.partsAfter.forEach(p=>console.log('   ',p));
R.laterOnPage=await page.evaluate(()=>/Received later|Receive later/i.test(document.body.innerText));
console.log('the page now mentions receiving later:',R.laterOnPage);
await page.screenshot({path:`${EV}/r68-after.png`,fullPage:true}).catch(()=>{});
fs.writeFileSync(`${EV}/r68-later-use.json`,JSON.stringify(R,null,1));
await browser.close();
