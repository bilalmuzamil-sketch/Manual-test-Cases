import {start,mk,log,B,OUT} from '/tmp/cln/woblib.mjs';
const WO='/workorders/31a3135b-b8e4-4aec-87f4-229f6ebf13b7/lines', NUM='S10043-17581';
const {browser,page}=await start(WO); const {dump,ov,tip,go,esc,body}=mk(page);
const opts=async()=>page.evaluate(()=>[...document.querySelectorAll('[role=option],.q-menu .q-item')].map(e=>e.innerText.replace(/\s+/g,' ').trim()).join(' | '));
try{
  await go(WO,9000); const c=page.locator('.q-dialog button[aria-label="Close"], .q-dialog i:text("close")').first(); if(await c.count()) await c.click({force:true}).catch(()=>{}); await page.waitForTimeout(800);
  await page.locator('[data-test-id="select_lead_technician"]').click({force:true}); await page.waitForTimeout(1500);
  log('lead opts:',(await opts()).slice(0,500));
  const o=page.getByRole('option').filter({hasText:'ZZAUTOTEST Ana'}).first(); log('Ana option',await o.count());
  if(await o.count()){ await o.click(); await page.waitForTimeout(3500); log('after pick overlay:',(await ov()).slice(0,500)); await dump('lead-pick-result'); }
  let t=await body(); log('lead now:',t.slice(t.indexOf('Lead Technician'),t.indexOf('Lead Technician')+60));
  // Board: find card
  await go('/workorders',7000); await page.getByText('All',{exact:true}).first().click().catch(()=>{}); await page.waitForTimeout(2500);
  await page.locator('button[aria-label="Board View"]').click(); await page.waitForTimeout(4000);
  const sb=page.locator('button[aria-label="Search"]').last(); await sb.click().catch(()=>{}); await page.waitForTimeout(1000);
  const inp=page.locator('input[type="search"], input[placeholder*="earch"]').filter({hasNot:page.locator('xx')}); log('search inputs',await inp.count());
  await page.keyboard.type(NUM,{delay:40}); await page.waitForTimeout(4000);
  t=await body(); log('board after search:',t.slice(t.indexOf('Create Work Order'),t.indexOf('Create Work Order')+700)); await dump('board-search');
}catch(e){log('ERR',e.message.slice(0,300));}
await browser.close(); log('DONE');
