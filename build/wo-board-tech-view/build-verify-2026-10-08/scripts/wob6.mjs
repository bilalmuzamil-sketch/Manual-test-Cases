import {start,mk,log,B} from '/tmp/cln/woblib.mjs';
const WO='/workorders/31a3135b-b8e4-4aec-87f4-229f6ebf13b7/lines', NUM='S10043-17581';
const {browser,page}=await start(WO); const {dump,ov,tip,go,esc,body}=mk(page);
const opts=async()=>page.evaluate(()=>[...document.querySelectorAll('[role=option],.q-menu .q-item')].map(e=>e.innerText.replace(/\s+/g,' ').trim()).join(' | '));
try{
  await go(WO,9000);
  log('overlay on open:',(await ov()).slice(0,200));
  // add a line in the auto-open dialog if present
  const dlg=page.locator('.q-dialog').last();
  if(await dlg.count()){ log('line dialog fields:',await page.evaluate(()=>[...document.querySelectorAll('.q-dialog .q-field')].map((f,i)=>i+':'+((f.querySelector('.q-field__label')||{}).innerText||'?')).join(' | ')));
    await page.locator('.q-dialog .q-field').nth(0).locator('input,textarea').first().fill('ZZAUTOTEST Brake inspection').catch(e=>log('line name',e.message.slice(0,50)));
    await dump('new-line-dialog');
    await page.locator('.q-dialog button',{hasText:'Save & Close'}).first().click().catch(()=>{}); await page.waitForTimeout(4000); log('after line save:',(await ov()).slice(0,300)); }
  let t=await body(); log('lines area:',t.slice(t.indexOf('New Line'),t.indexOf('New Line')+500));
  // lead technician click
  const lead=page.getByText('Lead technician',{exact:true}).first(); const box=lead.locator('xpath=..'); log('lead box text:',(await box.innerText()).replace(/\s+/g,' '));
  await box.getByText('Unassigned').first().click({force:true}).catch(e=>log('ua',e.message.slice(0,50))); await page.waitForTimeout(2500); log('lead click overlay:',(await ov()).slice(0,600)); await dump('lead-tech-picker');
  const o=page.locator('.q-dialog, .q-menu').getByText('ZZAUTOTEST Ana Alpha').first(); log('Ana present in picker',await o.count());
  if(await o.count()){ await o.click(); await page.waitForTimeout(1500); log('after pick:',(await ov()).slice(0,500)); const conf=page.locator('.q-dialog button').filter({hasText:/^(Reassign|Save|Confirm|Assign|OK|Keep shifts)$/}).first(); if(await conf.count()){ log('confirm with',await conf.innerText()); await conf.click(); await page.waitForTimeout(4000); log('after confirm:',(await ov()).slice(0,400)); } }
  t=await body(); log('lead now:',t.slice(t.indexOf('Lead technician'),t.indexOf('Lead technician')+60));
}catch(e){log('ERR',e.message.slice(0,300));}
await browser.close(); log('DONE');
