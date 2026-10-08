import {start,mk,log,B} from '/tmp/cln/woblib.mjs';
const WO='/workorders/31a3135b-b8e4-4aec-87f4-229f6ebf13b7/lines';
const {browser,page}=await start(WO); const {dump,ov,tip,go,esc,body}=mk(page);
const opts=async()=>page.evaluate(()=>[...document.querySelectorAll('[role=option],.q-menu .q-item')].map(e=>e.innerText.replace(/\s+/g,' ').trim()).join(' | '));
try{
  await go(WO,9000);
  let dlg=await ov(); if(!/New Line/.test(dlg)){ await page.locator('button',{hasText:/^New Line$/}).first().click(); await page.waitForTimeout(2500);} 
  const f0=page.locator('.q-dialog .q-field').nth(0); await f0.click(); await page.keyboard.type('ZZAUTOTEST Brake inspection',{delay:30}); await page.waitForTimeout(1500); log('what opts:',(await opts()).slice(0,300)); await page.keyboard.press('Enter'); await page.waitForTimeout(1000);
  const est=page.locator('.q-dialog .q-field').nth(4).locator('input'); await est.fill('2').catch(()=>{});
  const tg=page.locator('.q-dialog .q-toggle').filter({hasText:'Line Approved'}).first(); log('Line Approved toggle',await tg.count(),await tg.getAttribute('aria-checked').catch(()=>null)); if(await tg.count() && await tg.getAttribute('aria-checked')!=='true') await tg.click();
  await dump('new-line-filled');
  await page.locator('.q-dialog button',{hasText:'Save & Close'}).first().click(); await page.waitForTimeout(5000); log('after save overlay:',(await ov()).slice(0,300));
  let t=await body(); log('status/lines:',t.slice(t.indexOf('S10043-17581'),t.indexOf('S10043-17581')+40),'||',t.slice(t.indexOf('Name/Description'),t.indexOf('Name/Description')+300));
  const info=await page.evaluate(()=>!!document.querySelector('[data-test-id="lead_technician_readonly"]')); log('lead readonly now:',info);
  await dump('wo-after-line');
  // set lead
  const lab=page.getByText('Lead technician',{exact:true}).first(); const box=lab.locator('xpath=ancestor::*[contains(@class,"assignee-field") or contains(@class,"q-field")][1]');
  log('lead area html:',(await box.evaluate(e=>e.outerHTML).catch(()=>'none')).replace(/\s+/g,' ').slice(0,500));
  await box.click({force:true}).catch(()=>{}); await page.waitForTimeout(1500); await page.keyboard.type('ZZAUTOTEST Ana',{delay:50}); await page.waitForTimeout(2500); log('lead opts:',(await opts()).slice(0,300));
  const o=page.getByRole('option').filter({hasText:'ZZAUTOTEST Ana'}).first(); if(await o.count()){ await o.click(); await page.waitForTimeout(3000); log('after pick overlay:',(await ov()).slice(0,500)); await dump('lead-set-prompt'); const k=page.locator('.q-dialog button').filter({hasText:/Keep shifts|Save|Confirm|OK|Reassign/}).first(); if(await k.count()){ log('clicking',await k.innerText()); await k.click(); await page.waitForTimeout(3500); log('after:',(await ov()).slice(0,300)); } }
  t=await body(); log('lead now:',t.slice(t.indexOf('Lead technician'),t.indexOf('Lead technician')+60));
}catch(e){log('ERR',e.message.slice(0,300));}
await browser.close(); log('DONE');
