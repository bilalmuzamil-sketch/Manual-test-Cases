import {start,mk,log,B} from '/tmp/cln/woblib.mjs';
const {browser,page}=await start('/workorders'); const {dump,ov,tip,go,esc,body}=mk(page);
const view=async(lbl)=>{await page.locator(`button[aria-label="${lbl}"]`).first().click({force:true}).catch(()=>log('noview',lbl)); await page.waitForTimeout(3500);};
try{
  await page.getByText('All',{exact:true}).first().click().catch(()=>{}); await page.waitForTimeout(3000);
  for(const v of ['List','Tech View']){ await view(v); const cs=page.locator('button[aria-label="Column Selection"]').first(); log(v,'Column Selection tooltip:',await tip(cs)); await cs.click({force:true}); await page.waitForTimeout(1500); log(v,'Column Selection menu:',await ov()); await dump('columns-'+v.replace(/ /g,'')); await esc(); }
  await view('Tech View');
  const dh=page.locator('i').filter({hasText:/^drag_indicator$/}).nth(1); await dh.hover(); await page.waitForTimeout(1500); log('drag handle tooltip:',await page.evaluate(()=>[...document.querySelectorAll('.q-tooltip')].map(e=>e.innerText).join('|')));
  const pin=page.locator('button[aria-label^="Pin "]').first(); log('pin btn:',await pin.getAttribute('aria-label'),'tooltip:',await tip(pin));
  const col=page.locator('button[aria-label^="Collapse "]').nth(1); log('collapse:',await col.getAttribute('aria-label'),'tooltip:',await tip(col));
  const d=page.locator('button[aria-label="Density"]').first(); log('density tooltip',await tip(d)); await d.click(); await page.waitForTimeout(1200); log('density menu (tech):',await ov()); await esc();
  // empty search
  const s=page.getByPlaceholder('Search').last(); await s.click().catch(()=>{}); await s.fill('ZZNOMATCH123').catch(e=>log('fill',e.message.slice(0,60))); await page.waitForTimeout(4000);
  let b=await body(); log('no-match (tech):',b.slice(b.indexOf('Create Work Order'),b.indexOf('Create Work Order')+300));
  await view('Board View'); b=await body(); log('no-match (board):',b.slice(b.indexOf('Create Work Order'),b.indexOf('Create Work Order')+300));
  await view('List'); b=await body(); log('no-match (list):',b.slice(b.indexOf('Create Work Order'),b.indexOf('Create Work Order')+300)); await dump('no-match-list');
  await s.fill('').catch(()=>{}); await page.waitForTimeout(2000);
  // Create Work Order dialog
  await page.locator('button',{hasText:'Create Work Order'}).first().click(); await page.waitForTimeout(3000); log('Create WO:',page.url(),'|',await ov()); await dump('create-wo'); await esc(); await esc();
  // Staff new staff member
  await go('/administration/staff'); await page.locator('button',{hasText:/New Staff Member/}).first().click().catch(e=>log('nsm',e.message.slice(0,60))); await page.waitForTimeout(3000); log('New Staff Member:',await ov()); await dump('new-staff-member'); await esc();
  // edit staff dialog full field list
  const r=page.locator('tr:has-text("@")').nth(1); const bt=r.locator('button'); if(await bt.count()){ await bt.last().click({force:true}); await page.waitForTimeout(3000); log('Edit Staff Member:',await ov()); await esc(); }
}catch(e){log('ERR',e.message.slice(0,300));}
await browser.close(); log('DONE');
