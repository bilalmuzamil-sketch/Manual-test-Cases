import {start,mk,log,B,OUT} from '/tmp/cln/woblib.mjs';
const NUM='S10043-17581';
const {browser,page}=await start('/workorders'); const {dump,ov,tip,go,esc,body}=mk(page);
const toasts=async()=>page.evaluate(()=>[...document.querySelectorAll('.q-notification,.q-dialog,[role=alert]')].map(e=>e.innerText.replace(/\s+/g,' ').trim()).filter(Boolean).join(' || '));
const scrollRight=async()=>{for(let i=0;i<30;i++){await page.evaluate(()=>{[...document.querySelectorAll('*')].filter(e=>e.scrollWidth>e.clientWidth+50&&getComputedStyle(e).overflowX!='visible').forEach(e=>e.scrollLeft+=600);});await page.waitForTimeout(250);}};
try{
  await page.getByText('All',{exact:true}).first().click().catch(()=>{}); await page.waitForTimeout(2500);
  const x=page.locator('.q-btn,.q-chip').filter({hasText:/Status:/}).first().locator('i').filter({hasText:/^cancel$/}); if(await x.count()){ await x.click({force:true}); await page.waitForTimeout(2500);} 
  await page.locator('button[aria-label="Board View"]').click(); await page.waitForTimeout(4000);
  await page.locator('button[aria-label="Search"]').last().click(); await page.waitForTimeout(800); await page.keyboard.type(NUM,{delay:40}); await page.waitForTimeout(4500);
  await scrollRight();
  for(const n of ['ZZAUTOTEST Ana Alpha','ZZAUTOTEST Ben Bravo']){ const p=page.locator(`button[aria-label="Pin ${n}"]`).first(); if(await p.count()){ await p.click({force:true}); await page.waitForTimeout(2500); log('pinned',n,'->',(await toasts()).slice(0,200)); } else log('no pin btn for',n); await scrollRight(); }
  await page.evaluate(()=>{[...document.querySelectorAll('*')].filter(e=>e.scrollWidth>e.clientWidth+50).forEach(e=>e.scrollLeft=0);}); await page.waitForTimeout(1500);
  let t=await body(); log('board start after pins:',t.slice(t.indexOf('Create Work Order'),t.indexOf('Create Work Order')+500));
  await dump('board-pinned');
  const num=page.getByText(NUM,{exact:true}).first(); const ben=page.getByText('ZZAUTOTEST Ben Bravo',{exact:true}).first();
  log('num',await num.count(),'ben',await ben.count());
  const cb=await num.boundingBox(); const bb=await ben.boundingBox(); log('boxes',JSON.stringify(cb),JSON.stringify(bb));
  await page.mouse.move(cb.x+20,cb.y+5); await page.mouse.down(); await page.waitForTimeout(250);
  for(let i=1;i<=20;i++){ await page.mouse.move(cb.x+20+(bb.x+20-(cb.x+20))*i/20, cb.y+5+(bb.y+150-(cb.y+5))*i/20); await page.waitForTimeout(50);} 
  await page.waitForTimeout(600); await page.mouse.up(); await page.waitForTimeout(2000);
  log('after drag:',await toasts()); await dump('after-drag-ana-to-ben');
  const keep=page.locator('.q-dialog button').filter({hasText:/Keep shifts/}).first(); if(await keep.count()){ await keep.click(); await page.waitForTimeout(1500); log('after keep:',await toasts()); }
  await page.waitForTimeout(7000); log('~10s later:',await toasts());
  t=await body(); const i=t.indexOf('ZZAUTOTEST Ben Bravo'); log('Ben column now:',t.slice(i,i+180));
}catch(e){log('ERR',e.message.slice(0,300));}
await browser.close(); log('DONE');
