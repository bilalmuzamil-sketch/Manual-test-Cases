import {start,mk,log,B,OUT} from '/tmp/cln/woblib.mjs';
const WO='/workorders/31a3135b-b8e4-4aec-87f4-229f6ebf13b7/lines';
const {browser,page}=await start(WO); const {dump,ov,tip,go,esc,body}=mk(page);
try{
  await go(WO,9000);
  let dlg=await ov(); if(!/New Line/.test(dlg)){ await page.locator('button',{hasText:/^New Line$/}).first().click(); await page.waitForTimeout(2500);} 
  const f0=page.locator('.q-dialog .q-field').nth(0); await f0.click(); await page.waitForTimeout(1500);
  log('what opts on open:',(await page.evaluate(()=>[...document.querySelectorAll('[role=option],.q-menu .q-item')].map(e=>e.innerText.replace(/\s+/g,' ').trim()).slice(0,12).join(' | '))));
  await page.keyboard.type('Brake',{delay:60}); await page.waitForTimeout(2500);
  log('what opts "Brake":',(await page.evaluate(()=>[...document.querySelectorAll('[role=option],.q-menu .q-item')].map(e=>e.innerText.replace(/\s+/g,' ').trim()).slice(0,8).join(' | '))));
  await page.screenshot({path:OUT+'new-line-what.png'});
  const o=page.locator('[role=option]').first(); if(await o.count()){ await o.click(); await page.waitForTimeout(1500);} 
  log('dialog now:',(await ov()).slice(0,600));
  log('buttons:',await page.evaluate(()=>[...document.querySelectorAll('.q-dialog button')].map(b=>(b.getAttribute('aria-label')||b.innerText).replace(/\s+/g,' ')+(b.disabled?'[DIS]':'')).join(' | ')));
  log('toggles:',await page.evaluate(()=>[...document.querySelectorAll('.q-dialog .q-toggle, .q-dialog [role=switch], .q-dialog .q-checkbox')].map(t=>t.innerText.replace(/\s+/g,' ')+':'+t.getAttribute('aria-checked')).join(' | ')));
  await page.screenshot({path:OUT+'new-line-filled.png'});
  await page.locator('.q-dialog').getByText('Line Approved',{exact:true}).first().click({force:true}); await page.waitForTimeout(600);
  await page.locator('.q-dialog button[aria-label="Save and close"]').first().click(); await page.waitForTimeout(6000);
  log('after save overlay:',(await ov()).slice(0,300));
  let t=await body(); const i=t.indexOf('S10043-17581'); log('header:',t.slice(i,i+120)); log('lines:',t.slice(t.indexOf('Name/Description'),t.indexOf('Name/Description')+250));
  log('lead readonly:',await page.evaluate(()=>!!document.querySelector('[data-test-id="lead_technician_readonly"]')));
  const lab=page.getByText('Lead technician',{exact:true}).first(); log('lead html:',(await lab.locator('xpath=../..').evaluate(e=>e.outerHTML)).replace(/\s+/g,' ').slice(0,700));
  await dump('wo-approved');
}catch(e){log('ERR',e.message.slice(0,300));}
await browser.close(); log('DONE');
