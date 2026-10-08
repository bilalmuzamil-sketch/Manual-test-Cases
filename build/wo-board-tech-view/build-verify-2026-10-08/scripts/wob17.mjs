import {start,mk,log,B,OUT} from '/tmp/cln/woblib.mjs';
const NUM='S10043-17581', WO='/workorders/31a3135b-b8e4-4aec-87f4-229f6ebf13b7/lines';
const {browser,page}=await start(WO); const {dump,ov,tip,go,esc,body}=mk(page);
try{
  await go(WO,8000); const c=page.locator('.q-dialog i:text("close")').first(); if(await c.count()) await c.click({force:true}).catch(()=>{});
  await page.keyboard.press('Escape'); await page.waitForTimeout(800); await page.evaluate(()=>{const e=[...document.querySelectorAll('.q-tab')].find(t=>/^History/.test(t.innerText.trim())); if(e) e.click();}); await page.waitForTimeout(4000); log('history url',page.url()); let t=await body(); const i=t.indexOf('Event'); log('history:',t.slice(Math.max(0,i-100),i+800)); await dump('wo-history');
  // tech view empty group text + status filter options
  await go('/workorders',7000); await page.getByText('All',{exact:true}).first().click().catch(()=>{}); await page.waitForTimeout(2000);
  const x=page.locator('.q-btn,.q-chip').filter({hasText:/Status:/}).first().locator('i').filter({hasText:/^cancel$/}); if(await x.count()){ await x.click({force:true}); await page.waitForTimeout(2500);} 
  await page.locator('button[aria-label="Tech View"]').click(); await page.waitForTimeout(4000);
  await page.locator('button[aria-label="Search"]').last().click(); await page.waitForTimeout(800); await page.keyboard.type(NUM,{delay:40}); await page.waitForTimeout(4500);
  t=await body(); log('tech view searched:',t.slice(t.indexOf('Created On'),t.indexOf('Created On')+500));
  const st=page.locator('.q-btn,.q-chip,button').filter({hasText:/^Status/}).first(); await st.click({force:true}).catch(()=>{}); await page.waitForTimeout(1500); log('status menu (tech):',(await ov()).slice(0,500)); await dump('status-menu-tech'); await esc();
  await page.locator('button[aria-label="List"]').click(); await page.waitForTimeout(3000); await st.click({force:true}).catch(()=>{}); await page.waitForTimeout(1500); log('status menu (list):',(await ov()).slice(0,500)); await esc();
  // narrow window
  await page.setViewportSize({width:900,height:900}); await page.waitForTimeout(3000);
  log('narrow toolbar aria:',await page.evaluate(()=>[...document.querySelectorAll('button')].map(b=>b.getAttribute('aria-label')).filter(a=>/List|Tech View|Board View|Density|Fields|Column/.test(a||'')).join(' | ')));
  await page.screenshot({path:OUT+'narrow-900.png'});
}catch(e){log('ERR',e.message.slice(0,300));}
await browser.close(); log('DONE');
