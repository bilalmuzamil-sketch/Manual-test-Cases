import {start,mk,L,menu,newCustomer,newContact,newAsset,save,B} from './h.mjs';
const log=L('s1'); const b=await start('/administration/staff','admin'); const {page}=b; const {dump,esc,body}=mk(page); page.setDefaultTimeout(15000);
const IDX={'First Name':0,'Last Name':1,'Email':2,'Role':6,'Dept':7,'Location':8}; const F=(l)=>page.locator('.q-dialog .q-field').nth(IDX[l]);
try{
 const bt=await body(); log('has Ana',bt.includes('ZZAUTOTEST Ana'),'Ben',bt.includes('ZZAUTOTEST Ben'),'Cal',bt.includes('ZZAUTOTEST Cal'),'TechSV',bt.includes('Tech ShopView'));
 const i=bt.indexOf('Tech ShopView'); log('TECH ROW',bt.slice(i-50,i+200));
 if(!bt.includes('ZZAUTOTEST Cal')){
  await page.locator('button',{hasText:/New Staff Member/}).first().click(); await page.waitForTimeout(2500);
  await F('First Name').locator('input').fill('ZZAUTOTEST Cal'); await F('Last Name').locator('input').fill('Charlie'); await F('Email').locator('input').fill('zzautotest.charlie.'+(Date.now()%100000)+'@example.com');
  await F('Role').click(); await page.waitForTimeout(1200); await page.locator('[role=option],.q-menu .q-item').filter({hasText:/^\s*Technician\s*$/}).first().click(); await page.waitForTimeout(700);
  await F('Dept').click(); await page.waitForTimeout(1200); await page.locator('[role=option],.q-menu .q-item').first().click(); await page.keyboard.press('Escape'); await page.waitForTimeout(700);
  await F('Location').click(); await page.waitForTimeout(1200); await page.locator('[role=option],.q-menu .q-item').filter({hasText:'Staging Heavy Duty'}).first().click(); await page.keyboard.press('Escape'); await page.waitForTimeout(700);
  const tc=page.locator('.q-dialog .q-toggle').filter({hasText:'Time Clock'}).first(); if(await tc.getAttribute('aria-checked')!=='true'){await tc.click(); await page.waitForTimeout(500);} 
  log('dlg',(await menu(page)).slice(0,400)); await page.locator('.q-dialog button',{hasText:'Save & Close'}).first().click(); await page.waitForTimeout(4000); log('after save',(await menu(page)).slice(0,200));
 }
 const u=await newCustomer(page,'ZZAUTOTEST Regression Walk',log); save('custUrl',u);
 await newContact(page,'ZZAUTOTEST','Walker',log);
 await newAsset(page,{unit:'RW-1',mileage:'120000'},log);
 await page.getByRole('tab',{name:/Assets/}).first().click(); await page.waitForTimeout(3000); await dump('S1-cust-assets');
}catch(e){log('ERR',e.message.slice(0,300));}
await b.browser.close();
