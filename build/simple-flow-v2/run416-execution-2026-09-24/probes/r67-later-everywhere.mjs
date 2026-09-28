// The person now holds woReceivedLater and the part row's Receive is still a plain button. The
// requirement names THREE places it should appear: the part row, the bulk action bar, and the
// wizard's receive step. Check all three before saying it is absent (Rule 104 - and the last three
// times I called something absent on this screen it was my own reading).
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
  const ok=await page.evaluate(()=>{const onWO=!!([...document.querySelectorAll('tr')].find(t=>/Name\/Description/.test(t.innerText||'')));
    if(!onWO)return false; return [...document.querySelectorAll('button,.q-btn')].some(e=>/^Receive$/i.test((e.innerText||'').trim())&&e.getBoundingClientRect().width);});
  if(ok){ target=w; break; }
}
if(!target){ console.log('nothing left to receive anywhere'); await browser.close(); process.exit(0); }
R.wo=target.work_order_number;
console.log('using work order',R.wo);
const laterAnywhere=async(where)=>await page.evaluate((w)=>{
  const t=document.body.innerText;
  return {where:w, later:/Receive[d]? later/i.test(t),
    matches:(t.match(/Receive[d]? later[^\n]{0,40}/gi)||[]).slice(0,4)};},where);

// 1. the part row's own three-dot
const dots=await page.evaluate(()=>{const row=[...document.querySelectorAll('tr')].find(t=>/drag_indicator/.test(t.innerText||'')&&/Awaiting/.test(t.innerText||''));
  if(!row)return null; const b=[...row.querySelectorAll('button,.q-btn,i')].find(e=>/more_vert/.test((e.innerText||e.textContent||'').trim())&&e.getBoundingClientRect().width);
  if(!b)return null; const r=b.getBoundingClientRect(); return {x:Math.round(r.x+r.width/2),y:Math.round(r.y+r.height/2)};});
if(dots){ await page.mouse.click(dots.x,dots.y); await page.waitForTimeout(2200);
  R.partMenu=await page.evaluate(()=>{const m=[...document.querySelectorAll('.q-menu')].filter(x=>{const q=x.getBoundingClientRect();return q.width>20&&q.height>20;}).pop();
    return m?[...m.querySelectorAll('.q-item')].filter(i=>i.getBoundingClientRect().width).map(i=>(i.innerText||'').trim()):null;});
  console.log('\n1. the part row three-dot holds:',JSON.stringify(R.partMenu));
  await page.keyboard.press('Escape'); await page.waitForTimeout(900); }

// 2. the receive window
const rec=await page.evaluate(()=>{const b=[...document.querySelectorAll('button,.q-btn')].find(e=>/^Receive$/i.test((e.innerText||'').trim())&&e.getBoundingClientRect().width);
  if(!b)return 'no Receive'; b.click(); return 'pressed Receive';});
console.log('\n2.',rec);
let got=null; const t0=Date.now();
while(Date.now()-t0<18000){ got=await page.evaluate(()=>{const d=[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width>150).pop(); return d?1:0;});
  if(got)break; await page.waitForTimeout(900); }
R.navigatedForReceive = !got;
if(got){
  R.receiveWindow=await page.evaluate(()=>{const d=[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width>150).pop();
    const t=(d.innerText||'').replace(/\s+/g,' ');
    return {later:/Receive[d]? later/i.test(t),
      buttons:[...d.querySelectorAll('button,.q-btn')].filter(e=>e.getBoundingClientRect().width).map(e=>(e.innerText||'').replace(/\s+/g,' ').trim()).filter(Boolean),
      text:t.slice(0,300)};});
  console.log('   the receive window - does it mention receiving later:',R.receiveWindow.later);
  console.log('   its buttons:',JSON.stringify(R.receiveWindow.buttons));
  await page.screenshot({path:`${EV}/r67-receive-window.png`}).catch(()=>{});
  await page.keyboard.press('Escape'); await page.waitForTimeout(1500);
} else {
  await page.waitForTimeout(5000);
  R.receivePage=await laterAnywhere('the receive page it navigated to');
  R.receivePageButtons=await page.evaluate(()=>[...document.querySelectorAll('button,.q-btn')].filter(e=>e.getBoundingClientRect().width)
    .map(e=>(e.innerText||'').replace(/\s+/g,' ').trim()).filter(Boolean).slice(0,18));
  console.log('   it navigated to the receive page instead. Does it mention receiving later:',R.receivePage.later);
  console.log('   its buttons:',JSON.stringify(R.receivePageButtons));
  await page.screenshot({path:`${EV}/r67-receive-page.png`,fullPage:true}).catch(()=>{});
  await page.goBack({waitUntil:'domcontentloaded'}).catch(()=>{}); await page.waitForTimeout(7000);
}
// 3. the bulk bar
await openWo(page,target.id); await page.waitForTimeout(7000);
const ids=await page.evaluate(()=>[...new Set([...document.querySelectorAll('tr[class*="line-row-"]')].map(t=>(t.className.match(/line-row-([0-9a-f-]+)/)||[])[1]))].filter(Boolean));
for(const id of ids.slice(0,2)){const tr=page.locator('tr.line-row-'+id).first();
  await tr.hover().catch(()=>{}); await page.waitForTimeout(800);
  const cb=page.locator(`[data-test-id="line_checkbox_${id}"]`);
  if(await cb.count()){await cb.first().click({timeout:8000}).catch(()=>{}); await page.waitForTimeout(1500);} }
await page.waitForTimeout(2500);
R.bar=await page.evaluate(()=>{const b=document.querySelector('.bulk-action-bar'); return b?(b.innerText||'').replace(/\s+/g,' ').trim():null;});
console.log('\n3. the bulk bar reads:',JSON.stringify(R.bar));
const more=await page.evaluate(()=>{const b=document.querySelector('.bulk-action-bar'); if(!b)return 'no bar';
  const m=[...b.querySelectorAll('button,.q-btn')].find(e=>/^More/.test((e.innerText||'').trim())); if(!m)return 'no More'; m.click(); return 'opened More';});
if(more==='opened More'){ await page.waitForTimeout(2200);
  R.barMore=await page.evaluate(()=>{const m=[...document.querySelectorAll('.q-menu')].filter(x=>{const q=x.getBoundingClientRect();return q.width>20&&q.height>20;}).pop();
    return m?[...m.querySelectorAll('.q-item')].filter(i=>i.getBoundingClientRect().width).map(i=>(i.innerText||'').trim()):null;});
  console.log('   More holds:',JSON.stringify(R.barMore)); }
else console.log('  ',more);
// is a Receive in the bar a split button?
R.barReceive=await page.evaluate(()=>{const b=document.querySelector('.bulk-action-bar'); if(!b)return null;
  const r=[...b.querySelectorAll('button,.q-btn')].find(e=>/^Receive/i.test((e.innerText||'').trim()));
  return r?{label:(r.innerText||'').replace(/\s+/g,' ').trim(),icons:[...r.querySelectorAll('.q-icon,i')].map(i=>(i.textContent||'').trim())}:null;});
console.log('   a Receive in the bar:',JSON.stringify(R.barReceive));
R.anyLater=await laterAnywhere('the work order page');
console.log('\nanywhere on this work order, the words "receive later":',R.anyLater.later, JSON.stringify(R.anyLater.matches));
fs.writeFileSync(`${EV}/r67-later.json`,JSON.stringify(R,null,1));
await browser.close();
