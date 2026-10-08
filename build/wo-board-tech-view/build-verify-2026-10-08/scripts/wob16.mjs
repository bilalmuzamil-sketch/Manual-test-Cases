import {start,mk,log,B,OUT} from '/tmp/cln/woblib.mjs';
const NUM='S10043-17581', WO='/workorders/31a3135b-b8e4-4aec-87f4-229f6ebf13b7';
const {browser,page}=await start('/workorders'); const {dump,ov,tip,go,esc,body}=mk(page);
const toasts=async()=>page.evaluate(()=>[...document.querySelectorAll('.q-notification,.q-dialog,[role=alert],.q-tooltip')].map(e=>e.innerText.replace(/\s+/g,' ').trim()).filter(Boolean).join(' || '));
try{
  await page.getByText('All',{exact:true}).first().click().catch(()=>{}); await page.waitForTimeout(2500);
  const x=page.locator('.q-btn,.q-chip').filter({hasText:/Status:/}).first().locator('i').filter({hasText:/^cancel$/}); if(await x.count()){ await x.click({force:true}); await page.waitForTimeout(2500);} 
  await page.locator('button[aria-label="Board View"]').click(); await page.waitForTimeout(4000);
  // 4th pin attempt (admin has 3 pinned)
  const p4=page.locator('button[aria-label^="Pin "]').first(); log('4th pin btn',await p4.getAttribute('aria-label'),'disabled',await p4.isDisabled().catch(()=>'?')); await p4.hover({force:true}); await page.waitForTimeout(1500); log('4th pin hover:',await toasts());
  await p4.click({force:true}).catch(()=>{}); await page.waitForTimeout(1500); log('4th pin click:',await toasts());
  await page.locator('button[aria-label="Search"]').last().click(); await page.waitForTimeout(800); await page.keyboard.type(NUM,{delay:40}); await page.waitForTimeout(4500);
  await page.locator(`button[aria-label="More actions for ${NUM}"]`).first().click({force:true}); await page.waitForTimeout(1200);
  await page.locator('.q-menu .q-item',{hasText:'Reassign lead technician'}).first().click(); await page.waitForTimeout(2000);
  log('dialog top:',(await toasts()).slice(0,250));
  await page.locator('.q-dialog').getByText('Unassigned',{exact:true}).first().click(); await page.waitForTimeout(800);
  await page.locator('.q-dialog button',{hasText:/^Reassign$/}).click(); await page.waitForTimeout(1800); log('after reassign:',await toasts());
  await page.waitForTimeout(9000); log('~10s later:',await toasts());
  // history tab
  await go(WO+'/history',8000); let t=await body(); const i=t.indexOf('History'); log('history:',t.slice(i,i+900)); await dump('wo-history');
}catch(e){log('ERR',e.message.slice(0,300));}
await browser.close(); log('DONE');
