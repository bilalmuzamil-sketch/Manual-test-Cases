// C44564 - the clock-out window offers two complete buttons and the old "line completed" tick box is
//          hidden. C44563 - completing a line from that window is one of the defined paths.
// Both were parked as needing somebody clocked in. Clock in, then stop, and read what appears.
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import { openWo } from './lib3.mjs';
import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const {browser,ctx,page,APIH}=await bootProdLogin('/workorders',{settle:13000,viewport:{width:1680,height:1000},deviceScaleFactor:2});
page.setDefaultTimeout(30000);
const R={};
const dlg=async()=>await page.evaluate(()=>{const d=[...document.querySelectorAll('.q-dialog')].filter(x=>{const r=x.getBoundingClientRect();return r.width>150&&r.height>100;}).pop();
  if(!d)return null; const vis=e=>{const r=e.getBoundingClientRect();return r.width&&r.height;};
  return {text:(d.innerText||'').replace(/\s+/g,' ').trim().slice(0,420),
    ticks:[...d.querySelectorAll('.q-checkbox,[type=checkbox]')].filter(vis).length,
    tickLabels:[...d.querySelectorAll('.q-checkbox')].filter(vis).map(c=>{let p=c.parentElement,t='';
      for(let i=0;i<4&&p;i++){t=(p.innerText||'').replace(/\s+/g,' ').trim(); if(t&&t.length<70)break; p=p.parentElement;} return t.slice(0,50);}),
    buttons:[...d.querySelectorAll('button,.q-btn')].filter(vis).map(e=>({t:(e.innerText||'').replace(/\s+/g,' ').trim(),disabled:/disabled/.test(e.className||'')})).filter(b=>b.t)};});
const poll=async(ms=12000)=>{const t0=Date.now();while(Date.now()-t0<ms){const x=await dlg();if(x)return x;await page.waitForTimeout(700);}return null;};
// find a work order with a line still open, then start the timer on it
const call=async p=>{const q=await ctx.request.get(`https://${APIH}${p}`,{headers:{Accept:'application/json'},ignoreHTTPSErrors:true});
  const t=await q.text();let j=null;try{j=JSON.parse(t);}catch{}return j;};
const wos=(await call('/api/work-orders?pagination%5BrowsPerPage%5D=40&pagination%5Bpage%5D=1&search=&showMyWorkOrders=0'))?.data?.work_orders||[];
let target=null;
for(const w of wos.slice(0,12)){
  await openWo(page,w.id); await page.waitForTimeout(6500);
  const hasStart=await page.evaluate(()=>{const onWO=!!([...document.querySelectorAll('tr')].find(t=>/Name\/Description/.test(t.innerText||'')));
    if(!onWO)return false; return [...document.querySelectorAll('button,.q-btn')].some(e=>/^Start$/i.test((e.innerText||'').trim())&&e.getBoundingClientRect().width);});
  if(hasStart){ target=w; break; }
}
console.log('a work order offering Start:',target?target.work_order_number||target.id.slice(0,8):'none found');
if(!target){
  // the labour row's Start may only show on hover - look again with every line hovered
  console.log('looking again with the rows hovered');
  for(const w of wos.slice(0,6)){
    await openWo(page,w.id); await page.waitForTimeout(6500);
    const ids=await page.evaluate(()=>[...new Set([...document.querySelectorAll('tr[class*="line-row-"]')].map(t=>(t.className.match(/line-row-([0-9a-f-]+)/)||[])[1]))].filter(Boolean));
    for(const id of ids.slice(0,3)){ const tr=page.locator('tr.line-row-'+id).first();
      await tr.hover().catch(()=>{}); await page.waitForTimeout(900); }
    const has=await page.evaluate(()=>[...document.querySelectorAll('button,.q-btn')].some(e=>/^Start$/i.test((e.innerText||'').trim())&&e.getBoundingClientRect().width));
    if(has){ target=w; console.log('   found one on',w.work_order_number); break; } }
}
if(!target){ console.log('nothing offers Start - cannot clock in from a line'); fs.writeFileSync(`${EV}/r81-clockout.json`,JSON.stringify(R,null,1)); await browser.close(); process.exit(0); }
const started=await page.evaluate(()=>{const b=[...document.querySelectorAll('button,.q-btn')].find(e=>/^Start$/i.test((e.innerText||'').trim())&&e.getBoundingClientRect().width);
  if(!b)return 'no Start'; b.click(); return 'pressed Start';});
console.log('\n',started); await page.waitForTimeout(6000);
R.afterStart=await page.evaluate(()=>({stopOffered:[...document.querySelectorAll('button,.q-btn')].some(e=>/^Stop$/i.test((e.innerText||'').trim())&&e.getBoundingClientRect().width),
  clockText:(document.body.innerText.match(/\d+:\d+:\d+/)||[])[0]||null}));
console.log('   Stop is now offered:',R.afterStart.stopOffered,'| a running clock reads:',R.afterStart.clockText);
await page.screenshot({path:`${EV}/r81-started.png`,fullPage:true}).catch(()=>{});
if(R.afterStart.stopOffered){
  const stopped=await page.evaluate(()=>{const b=[...document.querySelectorAll('button,.q-btn')].find(e=>/^Stop$/i.test((e.innerText||'').trim())&&e.getBoundingClientRect().width);
    b.click(); return 'pressed Stop';});
  console.log('  ',stopped);
  R.modal=await poll(14000);
  console.log('\nthe clock-out window:');
  console.log('   reads  :',JSON.stringify(R.modal&&R.modal.text.slice(0,320)));
  console.log('   buttons:',JSON.stringify((R.modal&&R.modal.buttons||[]).map(b=>b.t+(b.disabled?' [disabled]':''))));
  console.log('   tick boxes in it:',R.modal&&R.modal.ticks,JSON.stringify(R.modal&&R.modal.tickLabels));
  await page.screenshot({path:`${EV}/r81-clockout.png`}).catch(()=>{});
  if(R.modal){
    R.completeButtons=(R.modal.buttons||[]).filter(b=>/complete/i.test(b.t)).map(b=>b.t);
    R.lineCompletedTick=(R.modal.tickLabels||[]).some(t=>/line completed/i.test(t));
    console.log('\n   >>> buttons mentioning complete:',JSON.stringify(R.completeButtons));
    console.log('   >>> an old "line completed" tick box is present:',R.lineCompletedTick);
  }
}
fs.writeFileSync(`${EV}/r81-clockout.json`,JSON.stringify(R,null,1));
await browser.close();
