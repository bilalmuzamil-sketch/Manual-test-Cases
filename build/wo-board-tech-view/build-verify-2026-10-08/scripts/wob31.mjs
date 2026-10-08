import {start,mk} from './woblib.mjs'; import fs from 'fs';
const L='/tmp/cln/wob31.log'; fs.writeFileSync(L,''); const log=(...a)=>fs.appendFileSync(L,a.join(' ')+'\n');
const b=await start('/customers/b416a8ad-011f-4946-a6af-e736abf7fe2f/work-orders','admin'); const {page}=b; const {dump,ov,esc}=mk(page); page.setDefaultTimeout(15000);
const open=async()=>{await page.locator('a[role=tab]:has-text("Assets")').first().click(); await page.waitForTimeout(3000);
 await page.locator('button:has-text("New Asset")').first().click(); await page.waitForTimeout(3000);
 const d=page.locator('.q-dialog'); await d.getByLabel('Contact *').click(); await page.waitForTimeout(1500); await page.locator('.q-menu .q-item').first().click(); await page.waitForTimeout(800); return d;};
const pick=async(d,lab,txt,exact)=>{await d.getByLabel(lab).click(); await d.getByLabel(lab).pressSequentially(txt,{delay:110}); await page.waitForTimeout(2500); log(lab,'MENU',(await ov()).split('||').pop().slice(0,200)); await page.locator('.q-menu .q-item').filter({hasText:new RegExp('^\\s*(check)?\\s*'+exact+'\\s*$')}).first().click(); await page.waitForTimeout(1000);};
try{ // A: contact only -> save
 let d=await open(); await d.getByRole('button',{name:'Save'}).click(); await page.waitForTimeout(3000); log('A no make',await ov()); await dump('asset-no-make');
 await esc(); await page.waitForTimeout(1500);
}catch(e){log('ERR A',e.message.slice(0,200));}
try{ // B: 1999 Ford Explorer no unit
 await page.goto('https://sv10043.qa.shopview.com/customers/b416a8ad-011f-4946-a6af-e736abf7fe2f/work-orders'); await page.waitForTimeout(6000);
 let d=await open(); await d.getByLabel('Year').fill('1999'); await pick(d,'Make *','Ford','Ford'); await pick(d,'Model','Explorer','Explorer');
 await d.getByRole('button',{name:'Save'}).click(); await page.waitForTimeout(4000); log('B after save',await ov()); await dump('asset-ford-no-unit');
}catch(e){log('ERR B',e.message.slice(0,200));}
await b.browser.close();
