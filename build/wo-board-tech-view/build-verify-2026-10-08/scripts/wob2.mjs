import {start,mk,log,B} from '/tmp/cln/woblib.mjs';
const {browser,page}=await start('/workorders'); const {dump,ov,tip,go,esc,body}=mk(page);
const clickIcon=async(nm)=>{const ic=page.locator('i').filter({hasText:new RegExp('^'+nm+'$')}).first(); await ic.click({force:true}).catch(e=>log('noclick',nm)); await page.waitForTimeout(3500);};
const items=async()=>page.evaluate(()=>[...document.querySelectorAll('.q-menu .q-item,[role=menuitem],[role=option]')].map(e=>e.innerText.replace(/\s+/g,' ').trim()).filter(Boolean).join(' | '));
try{
  await page.getByText('All',{exact:true}).first().click().catch(()=>{}); await page.waitForTimeout(3000);
  for(const v of [['view_list','List'],['person','Tech View'],['view_kanban','Board View']]){
    await clickIcon(v[0]);
    const bar=await page.evaluate(()=>[...document.querySelectorAll('button')].map(b=>b.getAttribute('aria-label')).filter(Boolean).join(' | ')); log(v[1],'toolbar buttons (aria):',bar.slice(0,400));
    const fb=page.locator('button[aria-label="Fields to display"], button[aria-label="Columns"]').first(); log(v[1],'chooser count',await fb.count(), 'aria', await fb.getAttribute('aria-label').catch(()=>null));
    if(await fb.count()){ await fb.click({force:true}); await page.waitForTimeout(1500); log(v[1],'chooser menu:',await ov()); await dump('chooser-'+v[1].replace(/ /g,'')); await esc(); }
    const dn=page.locator('button[aria-label="Density"]').first(); log(v[1],'density present',await dn.count());
  }
  // Tech View header controls
  await clickIcon('person');
  for(const nm of ['drag_indicator','expand_more','push_pin']){ const ic=page.locator('i').filter({hasText:new RegExp('^'+nm+'$')}).nth(1); log('TV header',nm,'tooltip:',await tip(ic)); }
  const av=page.locator('text=/^BS$/').first(); log('avatar tooltip:',await tip(av));
  const rm=page.locator('i').filter({hasText:/^more_horiz$/}).first(); await rm.click({force:true}).catch(()=>{}); await page.waitForTimeout(1500); log('TV row menu:',await ov()); await esc();
  // Board card menu + reassign dialog
  await clickIcon('view_kanban');
  const bh=page.locator('i').filter({hasText:/^push_pin$/}).nth(1); log('Board pin tooltip:',await tip(bh));
  const bd=page.locator('i').filter({hasText:/^drag_indicator$/}).nth(1); log('Board drag handle tooltip:',await tip(bd));
  const cm=page.locator('i').filter({hasText:/^more_horiz$/}).first(); await cm.click({force:true}).catch(()=>{}); await page.waitForTimeout(1500); log('Board card menu:',await ov()); await dump('board-card-menu');
  const ra=page.locator('.q-menu .q-item').filter({hasText:/Reassign/i}).first();
  if(await ra.count()){ await ra.click(); await page.waitForTimeout(2500); log('Reassign dialog:',await ov()); await dump('reassign-dialog'); const c=page.locator('.q-dialog button',{hasText:/^Cancel$/}).first(); if(await c.count()) await c.click(); else await esc(); }
  else await esc();
  // empty search
  const s=page.locator('input[placeholder*="Search"]').nth(1); await s.fill('ZZNOMATCH123').catch(()=>{}); await page.waitForTimeout(3500);
  let b=await body(); const i=b.indexOf('Create Work Order'); log('no-match (board):',b.slice(i,i+400));
  await clickIcon('person'); b=await body(); log('no-match (tech):',b.slice(b.indexOf('Create Work Order'),b.indexOf('Create Work Order')+400));
  await clickIcon('view_list'); b=await body(); log('no-match (list):',b.slice(b.indexOf('Create Work Order'),b.indexOf('Create Work Order')+400));
}catch(e){log('ERR',e.message.slice(0,300));}
await browser.close(); log('DONE');
