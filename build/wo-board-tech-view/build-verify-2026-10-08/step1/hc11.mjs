import {start,mk} from './woblib.mjs'; import fs from 'fs';
const L='/tmp/cln/hc11.log'; fs.writeFileSync(L,''); const log=(...a)=>fs.appendFileSync(L,a.join(' ')+'\n');
const b=await start('/workorders','admin'); const {page}=b; const {dump,ov,go,esc,body,tip}=mk(page); page.setDefaultTimeout(15000);
try{
 log('STATUS BTN',(await page.locator('button:has-text("Status")').first().innerText()).replace(/\s+/g,' '));
 if(!(await page.locator('tbody tr').filter({hasText:'ZZIMP-1001'}).count())){ await page.locator('button:has-text("Status")').first().click(); await page.waitForTimeout(1200); await page.locator('.q-menu').last().getByText('Imported',{exact:true}).first().click(); await page.waitForTimeout(4000); await esc(); }
 await page.locator('tbody tr').filter({hasText:'ZZIMP-1001'}).first().locator('td').nth(3).click(); await page.waitForTimeout(7000);
 log('URL',page.url()); const t=await body(); const i=t.search(/Lead [Tt]echnician/); log('LEAD AREA',i>=0?t.slice(i-200,i+250):'no lead label'); await dump('hc-imported-wo');
 await page.goBack(); await page.waitForTimeout(5000);
 await page.getByRole('button',{name:'Board View'}).first().click(); await page.waitForTimeout(6000);
 const u=await body(); log('BOARD has ZZIMP',u.includes('ZZIMP-1001')); await dump('hc-imported-board');
 const more=page.locator('button[aria-label="More actions for ZZIMP-1001"]'); log('more',await more.count());
 if(await more.count()){ await more.first().click(); await page.waitForTimeout(1200); log('MENU',await ov()); const it=page.locator('.q-menu .q-item').filter({hasText:'Reassign lead technician'}).first(); log('TIP',await tip(it)); await esc(); }
 // reset status filter
 await page.locator('button:has-text("Status")').first().click(); await page.waitForTimeout(1200); await page.locator('.q-menu').last().getByText('Clear selection',{exact:true}).first().click().catch(()=>{}); await page.waitForTimeout(2000);
 await page.getByRole('button',{name:'List'}).first().click().catch(()=>{}); await page.waitForTimeout(2000);
}catch(e){log('ERR',e.message.slice(0,200));}
await b.browser.close();
