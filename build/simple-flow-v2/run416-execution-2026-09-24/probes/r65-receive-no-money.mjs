// The work orders offered this person no Receive (those parts are past receiving), but the purchase
// orders page offers 30. Open the receive window from there and check the two things C44587 asks:
// the money fields are ABSENT rather than masked, and receiving still works.
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import fs from 'fs';
const APP='https://app.shopview.com';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const {browser,ctx,page,APIH}=await bootProdLogin('/parts/orders',{settle:14000,viewport:{width:1680,height:1000},deviceScaleFactor:2});
page.setDefaultTimeout(30000);
const R={};
const r=await ctx.request.get(`https://${APIH}/api/auth/me/fe-permissions`,{headers:{Accept:'application/json'},ignoreHTTPSErrors:true});
try{const j=JSON.parse(await r.text()); R.permissions=j.data?.fe_permissions||j.data||j;}catch{}
console.log('this person holds',(R.permissions||[]).length,'permissions:');
console.log(JSON.stringify(R.permissions));
await page.waitForTimeout(6000);
const hit=await page.evaluate(()=>{const b=[...document.querySelectorAll('button,.q-btn')].find(e=>/^Receive$/i.test((e.innerText||'').trim())&&e.getBoundingClientRect().width);
  if(!b)return 'no Receive button'; b.click(); return 'pressed Receive';});
console.log('\n',hit);
// poll rather than take one snapshot - the window is built after a fetch, and a single wait raced it
const urlBefore=page.url();
let modal=null; const t0=Date.now();
while(Date.now()-t0<20000){
  modal=await page.evaluate(()=>{const d=[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width>150).pop(); return d?1:0;});
  if(modal) break; await page.waitForTimeout(1000);
}
R.navigated = page.url()!==urlBefore;
console.log('  a window appeared:',!!modal,'| the page navigated instead:',R.navigated, R.navigated?('-> '+page.url()):'');
if(!modal && R.navigated){
  // it opened the Purchase Order Details page - read THAT for the money fields instead
  await page.waitForTimeout(4000);
  R.detail=await page.evaluate(()=>{const t=document.body.innerText.replace(/\s+/g,' ');
    return {columns:[...document.querySelectorAll('th')].map(e=>(e.innerText||'').replace(/\s+/g,' ').trim()).filter(Boolean),
      dollars:(t.match(/\$[\d,]+\.?\d*/g)||[]).length,
      moneyWords:['Cost','Subtotal','Tax','Total','Sell','Price'].filter(w=>new RegExp('\\b'+w+'\\b','i').test(t)),
      buttons:[...document.querySelectorAll('button,.q-btn')].filter(e=>e.getBoundingClientRect().width).map(e=>(e.innerText||'').trim()).filter(Boolean).slice(0,16)};});
  console.log('  the details page as this person:');
  console.log('    columns    :',JSON.stringify(R.detail.columns));
  console.log('    money words:',JSON.stringify(R.detail.moneyWords),'| $ figures:',R.detail.dollars);
  console.log('    buttons    :',JSON.stringify(R.detail.buttons));
}
R.modal=await page.evaluate(()=>{const d=[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width>150).pop();
  if(!d)return null; const t=(d.innerText||'').replace(/\s+/g,' ').trim(); const vis=e=>{const q=e.getBoundingClientRect();return q.width&&q.height;};
  return {text:t.slice(0,500),
    columns:[...d.querySelectorAll('th')].map(e=>(e.innerText||'').replace(/\s+/g,' ').trim()).filter(Boolean),
    moneyWords:['Cost','Subtotal','Tax','Total','Sell','Price'].filter(w=>new RegExp('\\b'+w+'\\b','i').test(t)),
    dollars:(t.match(/\$[\d,]+\.?\d*/g)||[]).length,
    fields:[...d.querySelectorAll('.q-field')].filter(vis).map(f=>(f.innerText||'').replace(/\s+/g,' ').trim().slice(0,45)),
    buttons:[...d.querySelectorAll('button,.q-btn')].filter(vis).map(e=>({t:(e.innerText||'').replace(/\s+/g,' ').trim(),
      disabled:e.disabled===true||/disabled/.test(e.className||'')})).filter(b=>b.t)};});
if(R.modal){
  console.log('\nTHE RECEIVE WINDOW as a person who cannot see money:');
  console.log('  columns    :',JSON.stringify(R.modal.columns));
  console.log('  fields     :',JSON.stringify(R.modal.fields));
  console.log('  money words:',JSON.stringify(R.modal.moneyWords),'| $ figures:',R.modal.dollars);
  console.log('  buttons    :',JSON.stringify(R.modal.buttons.map(b=>b.t+(b.disabled?' [disabled]':''))));
  console.log('  reads      :',JSON.stringify(R.modal.text.slice(0,300)));
  await page.screenshot({path:`${EV}/r65-receive-no-money.png`}).catch(()=>{});
  // can this person actually receive? fill and try
  const ix=(R.modal.fields||[]).findIndex(f=>/Invoice Number/i.test(f));
  if(ix>=0){ const box=page.locator('.q-dialog input:visible').nth(ix);
    await box.click().catch(()=>{}); await box.type('ZZAUTOTEST-NOMONEY-1',{delay:40}); await page.waitForTimeout(1200); }
  const sel=await page.evaluate(()=>{const d=[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width>150).pop();
    const a=[...d.querySelectorAll('button,.q-btn,a,span')].filter(e=>/^Select All$/i.test((e.innerText||'').trim())&&e.getBoundingClientRect().width);
    if(a.length){a[0].click();return 'pressed Select All';} return 'no Select All';});
  console.log('  ',sel); await page.waitForTimeout(2500);
  R.afterTick=await page.evaluate(()=>{const d=[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width>150).pop();
    return [...d.querySelectorAll('button,.q-btn')].filter(e=>e.getBoundingClientRect().width)
      .map(e=>(e.innerText||'').replace(/\s+/g,' ').trim()+(/disabled/.test(e.className||'')?' [disabled]':'')).filter(Boolean);});
  console.log('  buttons after ticking:',JSON.stringify(R.afterTick));
  R.canReceive=(R.afterTick||[]).some(b=>/^Receive Parts?\s*\(\d+\)$/i.test(b));
  console.log('  >>> receiving is available to this person:',R.canReceive);
  await page.screenshot({path:`${EV}/r65-filled.png`}).catch(()=>{});
} else console.log('no window opened');
fs.writeFileSync(`${EV}/r65-receive-no-money.json`,JSON.stringify(R,null,1));
await browser.close();
