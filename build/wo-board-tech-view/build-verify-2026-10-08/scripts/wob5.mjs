import {start,mk,log,B} from '/tmp/cln/woblib.mjs';
import fs from 'fs';
const {browser,page}=await start('/administration/staff'); const {dump,ov,tip,go,esc,body}=mk(page);
const opts=async()=>page.evaluate(()=>[...document.querySelectorAll('[role=option],.q-menu .q-item')].map(e=>e.innerText.replace(/\s+/g,' ').trim()).join(' | '));
try{
  const sb=page.locator('input').first(); await sb.fill('ZZAUTOTEST').catch(()=>{}); await page.waitForTimeout(3000);
  log('staff search rows:',await page.evaluate(()=>[...document.querySelectorAll('tbody tr')].map(r=>r.innerText.replace(/\s+/g,' ').slice(0,120)).join(' // ')));
  // new work order
  await go('/workorders',7000);
  await page.locator('button',{hasText:'Create Work Order'}).first().click(); await page.waitForTimeout(2500);
  const cf=page.locator('.q-dialog .q-field').nth(0); await cf.click(); await page.keyboard.type('4 Star Truck',{delay:60}); await page.waitForTimeout(2500); log('customer opts:',(await opts()).slice(0,200));
  await page.getByRole('option').filter({hasText:'4 Star Truck Repair'}).first().click(); await page.waitForTimeout(1500);
  const af=page.locator('.q-dialog .q-field').nth(1); await af.click(); await page.waitForTimeout(2000); log('asset opts:',(await opts()).slice(0,300));
  await page.locator('[role=option]').first().click().catch(()=>{}); await page.waitForTimeout(1000);
  log('NWO dialog filled:',(await ov()).slice(0,400));
  await page.locator('.q-dialog button',{hasText:/^Save$/}).first().click(); await page.waitForTimeout(8000);
  log('after save url',page.url()); const wo=(await body()).match(/S2-\d+/); log('WO number',wo&&wo[0]);
  fs.writeFileSync('/tmp/cln/wob-wo1.json',JSON.stringify({url:page.url(),num:wo&&wo[0]}));
  await dump('wo-page-new');
  const t=await body(); const i=t.indexOf('Lead technician'); log('header:',t.slice(Math.max(0,i-400),i+300));
  // set lead technician
  const lt=page.locator('.q-field').filter({hasText:/Lead technician/i}).first(); log('lead field count',await lt.count());
  if(await lt.count()){ await lt.click(); await page.waitForTimeout(800); await page.keyboard.type('ZZAUTOTEST Ana',{delay:50}); await page.waitForTimeout(2500); log('lead opts:',(await opts()).slice(0,300)); const o=page.getByRole('option').filter({hasText:'ZZAUTOTEST Ana'}).first(); if(await o.count()){ await o.click(); await page.waitForTimeout(3000); log('after pick overlay:',(await ov()).slice(0,300)); } }
  const t2=await body(); const j=t2.indexOf('Lead technician'); log('header after:',t2.slice(j,j+120));
  log('tabs/buttons:',await page.evaluate(()=>[...document.querySelectorAll('.q-tab,button')].map(b=>b.innerText.replace(/\s+/g,' ').trim()).filter(x=>x&&x.length<30).slice(0,40).join(' | ')));
}catch(e){log('ERR',e.message.slice(0,300));}
await browser.close(); log('DONE');
