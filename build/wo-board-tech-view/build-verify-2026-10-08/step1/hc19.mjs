import {start,mk} from './woblib.mjs'; import fs from 'fs';
const L='/tmp/cln/hc19.log'; fs.writeFileSync(L,''); const log=(...a)=>fs.appendFileSync(L,a.join(' ')+'\n');
const b=await start('/workorders','admin'); const {page}=b; const {dump,ov,go,esc,body}=mk(page); page.setDefaultTimeout(15000);
const T=async(n,f)=>{try{await f();}catch(e){log('ERR',n,e.message.slice(0,200));}};
const openWO=async(num)=>{ await page.locator('button[aria-label="Search"]').last().click(); await page.waitForTimeout(800); await page.keyboard.type(num,{delay:30}); await page.waitForTimeout(4500); await page.locator('tbody tr').filter({hasText:num}).first().locator('td').nth(3).click(); await page.waitForTimeout(6000); };
await T('open',()=>openWO('S10043-17594'));
for(const n of [1,2]) await T('addpart'+n,async()=>{
  await page.locator('text=Add Part').first().click(); await page.waitForTimeout(3000); if(n==1){ log('ADDPART DLG',(await ov()).slice(0,700)); await dump('hc-wo-addpart'); log('INPUTS',JSON.stringify(await page.evaluate(()=>[...document.querySelectorAll('.q-dialog input')].filter(e=>e.offsetParent).map(e=>e.getAttribute('aria-label')))));}
  const d=page.locator('.q-dialog').last();
  await d.getByLabel('Description').fill('ZZAUTOTEST Brake Pads '+n).catch(e=>log('desc',e.message.slice(0,60)));
  await d.getByLabel(/Quantity/).fill('1').catch(e=>log('qty',e.message.slice(0,60)));
  const cat=d.getByLabel(/Category/).first(); await cat.click().catch(()=>{}); await page.waitForTimeout(1200); const ci=page.locator('.q-menu .q-item').filter({hasText:/Uncategorized/}).first(); if(await ci.count()) await ci.click(); await page.waitForTimeout(600);
  const ven=d.getByLabel(/^Vendor/).first(); await ven.click().catch(()=>{}); await page.waitForTimeout(1500); log('VENDOR OPTS',(await ov()).split('||').pop().slice(0,200)); await page.locator('.q-menu .q-item').first().click().catch(()=>{}); await page.waitForTimeout(800);
  await d.getByLabel(/^Cost/).fill('100').catch(e=>log('cost',e.message.slice(0,60)));
  await d.getByLabel(/Sell Price/).fill('150').catch(e=>log('sell',e.message.slice(0,60)));
  log('BEFORE SAVE',(await ov()).slice(0,500));
  await d.locator('button:has-text("Save & Close")').click(); await page.waitForTimeout(4000); log('AFTER SAVE',await ov());
});
await T('partsrow',async()=>{ await page.reload(); await page.waitForTimeout(6000); const t=await body(); const i=t.indexOf('Parts ('); log('PARTS AREA',t.slice(t.indexOf('Lines ('),t.indexOf('Lines (')+1400)); await dump('hc-wo-after-parts'); });
await b.browser.close();
