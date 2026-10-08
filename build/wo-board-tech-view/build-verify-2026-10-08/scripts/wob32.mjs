import {start,mk} from './woblib.mjs'; import fs from 'fs';
const L='/tmp/cln/wob32.log'; fs.writeFileSync(L,''); const log=(...a)=>fs.appendFileSync(L,a.join(' ')+'\n');
const b=await start('/workorders','admin'); const {page}=b; const {dump,ov}=mk(page); page.setDefaultTimeout(15000);
try{
for (let i=0;i<2;i++){
await page.goto('https://sv10043.qa.shopview.com/workorders'); await page.waitForTimeout(7000);
await page.locator('button:has-text("Create Work Order")').first().click(); await page.waitForTimeout(3000);
const d=page.locator('.q-dialog').last();
const c=d.locator('input').first(); await c.click(); await c.pressSequentially('ZZAUTOTEST Fib',{delay:100}); await page.waitForTimeout(3000);
await page.locator('.q-menu .q-item').filter({hasText:'ZZAUTOTEST Fibridge'}).first().click(); await page.waitForTimeout(2500);
await d.locator('button:has-text("Add")').nth(1).click(); await page.waitForTimeout(3000);
log('ASSET ADD FORM',await ov());
const d2=page.locator('.q-dialog').last();
await d2.getByLabel('Contact *').click().catch(()=>{}); await page.waitForTimeout(1500); await page.locator('.q-menu .q-item').first().click().catch(()=>{}); await page.waitForTimeout(800);
await d2.getByRole('button',{name:'Save'}).click(); await page.waitForTimeout(3000); log('TRY',i,'SAVE NO MAKE',await ov()); await dump('wo-asset-add-no-make-'+i);
}
}catch(e){log('ERR',e.message.slice(0,200));}
await b.browser.close();
