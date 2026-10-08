import {start,mk,log,B,OUT} from '/tmp/cln/woblib.mjs';
const NUM='S10043-17581';
const {browser,page}=await start('/workorders'); const {dump,ov,tip,go,esc,body}=mk(page);
const toasts=async()=>page.evaluate(()=>[...document.querySelectorAll('.q-notification,.q-dialog,[role=alert],[role=status]')].map(e=>e.innerText.replace(/\s+/g,' ').trim()).filter(Boolean).join(' || '));
try{
  await page.getByText('All',{exact:true}).first().click().catch(()=>{}); await page.waitForTimeout(2500);
  const chip=page.locator('.q-chip, .q-btn').filter({hasText:/Status:/}).first(); const x=chip.locator('i').filter({hasText:/^cancel$/}); if(await x.count()){ await x.click({force:true}); await page.waitForTimeout(2500); log('status filter cleared'); }
  await page.locator('button[aria-label="Board View"]').click(); await page.waitForTimeout(4000);
  await page.locator('button[aria-label="Search"]').last().click(); await page.waitForTimeout(800); await page.keyboard.type('4 Star Truck',{delay:40}); await page.waitForTimeout(4500);
  let t=await body(); log('board:',t.slice(t.indexOf('Create Work Order'),t.indexOf('Create Work Order')+600));
  t=await body(); const ia=t.indexOf('ZZAUTOTEST Ana'); log('Ana column text:',t.slice(ia-5,ia+350)); const num=page.getByText(NUM,{exact:true}).first(); log('num count',await num.count()); const card=num.locator('xpath=ancestor::*[@draggable="true" or contains(@class,"card")][1]'); log('card html class:',await card.evaluate(e=>e.className).catch(()=>'none')); log('card count',await card.count());
  const ben=page.getByText('ZZAUTOTEST Ben Bravo',{exact:true}).first(); log('Ben header count',await ben.count());
  if(!(await ben.count())){ await page.locator('i').filter({hasText:/^search$/}).first().click().catch(()=>{}); }
  await dump('board-before-drag');
  if(await card.count() && await ben.count()){
    const cb=await card.boundingBox(); const bb=await ben.boundingBox(); log('boxes',JSON.stringify(cb),JSON.stringify(bb));
    await page.mouse.move(cb.x+cb.width/2,cb.y+20); await page.mouse.down(); await page.waitForTimeout(300);
    for(let i=1;i<=15;i++){ await page.mouse.move(cb.x+cb.width/2+(bb.x+40-(cb.x+cb.width/2))*i/15, cb.y+20+(bb.y+120-(cb.y+20))*i/15); await page.waitForTimeout(60);} 
    await page.waitForTimeout(500); await page.mouse.up(); await page.waitForTimeout(2500);
    log('after drag:',await toasts()); await dump('after-drag-ana-to-ben');
    const keep=page.locator('.q-dialog button').filter({hasText:/Keep shifts/}).first(); if(await keep.count()){ await keep.click(); await page.waitForTimeout(2000); log('after keep:',await toasts()); }
    await page.waitForTimeout(6000); log('10s later:',await toasts());
    t=await body(); const i=t.indexOf('ZZAUTOTEST Ben Bravo'); log('Ben column:',t.slice(i,i+200));
  }
}catch(e){log('ERR',e.message.slice(0,300));}
await browser.close(); log('DONE');
