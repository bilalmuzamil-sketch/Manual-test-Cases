import {start,mk} from './woblib.mjs'; import fs from 'fs';
const L='/tmp/cln/wob28.log'; fs.writeFileSync(L,''); const log=(...a)=>fs.appendFileSync(L,a.join(' ')+'\n');
const b=await start('/customers/b416a8ad-011f-4946-a6af-e736abf7fe2f/work-orders','admin'); const {page}=b; const {dump,ov}=mk(page);
page.setDefaultTimeout(15000);
try{
await page.getByRole('tab',{name:/Contacts/}).first().click(); await page.waitForTimeout(4000);
log('CONTACT BTNS',JSON.stringify(await page.evaluate(()=>[...document.querySelectorAll('button')].filter(e=>e.offsetParent).map(e=>e.innerText.replace(/\s+/g,' ').trim()).filter(Boolean))));
await page.getByRole('button',{name:/New Contact/}).first().click(); await page.waitForTimeout(3000);
log('NEW CONTACT',await ov());
const d=page.locator('.q-dialog');
log('CINPUTS',JSON.stringify(await page.evaluate(()=>[...document.querySelectorAll('.q-dialog input')].filter(e=>e.offsetParent).map(e=>e.getAttribute('aria-label')))));
await d.getByLabel(/First Name/).fill('ZZAUTOTEST'); await d.getByLabel(/Last Name/).fill('Contact').catch(()=>{});
await d.getByRole('button',{name:/^Save/}).first().click(); await page.waitForTimeout(4000); log('AFTER CONTACT',await ov()); await dump('new-contact-after');
}catch(e){log('ERR contact',e.message.slice(0,200));}
try{
await page.getByRole('tab',{name:/Assets/}).first().click(); await page.waitForTimeout(3000);
await page.getByRole('button',{name:'New Asset'}).first().click(); await page.waitForTimeout(3000);
const d=page.locator('.q-dialog');
await d.getByLabel('Contact *').click(); await page.waitForTimeout(2000); log('CONTACT MENU',(await ov()).slice(-300));
await page.locator('.q-menu .q-item').first().click(); await page.waitForTimeout(1000);
await d.getByLabel('Year').fill('2022');
await d.getByLabel('Make *').click(); await page.waitForTimeout(2000); log('MAKE MENU OPEN',(await ov()).slice(-400));
await d.getByLabel('Make *').pressSequentially('Freight',{delay:120}); await page.waitForTimeout(3000); log('MAKE TYPED',(await ov()).slice(-400));
await page.locator('.q-menu .q-item').first().click(); await page.waitForTimeout(1500);
await d.getByLabel('Model').click(); await page.waitForTimeout(2000); log('MODEL OPEN',(await ov()).slice(-400));
await d.getByLabel('Model').pressSequentially('M2',{delay:120}); await page.waitForTimeout(3000); log('MODEL TYPED',(await ov()).slice(-400));
await page.locator('.q-menu .q-item').first().click().catch(e=>log('model pick',e.message.slice(0,80))); await page.waitForTimeout(1500);
await d.getByLabel('Unit').fill('TRK-118');
log('BEFORE SAVE',await ov());
await d.getByRole('button',{name:'Save'}).click(); await page.waitForTimeout(5000);
log('AFTER SAVE',(await ov()).slice(0,500)); await dump('new-asset-after-save');
}catch(e){log('ERR asset',e.message.slice(0,200));}
await b.browser.close();
